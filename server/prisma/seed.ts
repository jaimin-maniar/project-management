import { PrismaClient } from "../generated/prisma/client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

console.log("Script start");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("__filename:", __filename);
console.log("__dirname:", __dirname);

// Set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:password@localhost:5432/project_management_db?schema=public";
}

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();
console.log("Prisma client initialized");

async function deleteAllData(orderedFileNames: string[]) {
  console.log("deleteAllData start");
  const modelNames = orderedFileNames.map((fileName) => {
    return path.basename(fileName, path.extname(fileName));
  });
  console.log("Model names for deletion:", modelNames);

  for (const modelName of modelNames.reverse()) {
    console.log(`Deleting data for model: ${modelName}`);
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      try {
        await model.deleteMany({});
        console.log(`Cleared data from ${modelName}`);
      } catch (error) {
        console.error(`Error clearing data from ${modelName}:`, error);
        throw error; // re-throw to be caught by the final catch block
      }
    } else {
      console.error(`Model ${modelName} not found on prisma client`);
    }
  }
  console.log("deleteAllData end");
}

async function main() {
  console.log("main start");
  const dataDirectory = path.join(__dirname, "seedData");
  console.log("Data directory:", dataDirectory);

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  console.log("Ordered file names for seeding:", orderedFileNames);

  await deleteAllData(orderedFileNames);
  console.log("deleteAllData finished");

  // Step 1: Create teams without user references first
  console.log("Step 1: Creating teams without user references");
  const teamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"));
  const teamsWithoutUsers = teamData.map((team: any) => ({
    teamName: team.teamName
  }));
  
  const createdTeams = [];
  for (const teamData of teamsWithoutUsers) {
    console.log(`Creating team:`, teamData);
    const createdTeam = await prisma.team.create({ data: teamData });
    createdTeams.push(createdTeam);
    console.log(`Created team with ID:`, createdTeam.id);
  }
  console.log("Teams created successfully");

  // Step 2: Create users
  console.log("Step 2: Creating users");
  const userData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "user.json"), "utf-8"));
  for (let i = 0; i < userData.length; i++) {
    const user = userData[i];
    // Map the teamId from the seed data to the actual created team ID
    const actualTeamId = createdTeams[user.teamId - 1]?.id;
    if (!actualTeamId) {
      console.error(`No team found for teamId ${user.teamId}`);
      continue;
    }
    
    const userWithCorrectTeamId = {
      ...user,
      teamId: actualTeamId
    };
    
    console.log(`Creating user:`, userWithCorrectTeamId);
    await prisma.user.create({ data: userWithCorrectTeamId });
  }
  console.log("Users created successfully");

  // Step 3: Update teams with user references
  console.log("Step 3: Updating teams with user references");
  const originalTeamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"));
  for (let i = 0; i < originalTeamData.length; i++) {
    const team = originalTeamData[i];
    const teamId = createdTeams[i].id; // Use the actual created team ID
    console.log(`Updating team ${teamId} with user references`);
    await prisma.team.update({
      where: { id: teamId },
      data: {
        productOwnerUserId: team.productOwnerUserId,
        projectManagerUserId: team.projectManagerUserId
      }
    });
  }
  console.log("Teams updated with user references");

  // Step 4: Create projects
  console.log("Step 4: Creating projects");
  const projectData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "project.json"), "utf-8"));
  for (const project of projectData) {
    console.log(`Creating project:`, project);
    await prisma.project.create({ data: project });
  }
  console.log("Projects created successfully");

  // Step 5: Create project teams
  console.log("Step 5: Creating project teams");
  const projectTeamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "projectTeam.json"), "utf-8"));
  for (const projectTeam of projectTeamData) {
    // Map the teamId from the seed data to the actual created team ID
    const actualTeamId = createdTeams[projectTeam.teamId - 1]?.id;
    if (!actualTeamId) {
      console.error(`No team found for teamId ${projectTeam.teamId}`);
      continue;
    }
    
    const projectTeamWithCorrectTeamId = {
      ...projectTeam,
      teamId: actualTeamId
    };
    
    console.log(`Creating project team:`, projectTeamWithCorrectTeamId);
    await prisma.projectTeam.create({ data: projectTeamWithCorrectTeamId });
  }
  console.log("Project teams created successfully");

  // Step 6: Create remaining records
  const remainingFiles = ["task.json", "attachment.json", "comment.json", "taskAssignment.json"];
  
  // Get all users to map user IDs
  const allUsers = await prisma.user.findMany();
  console.log(`Found ${allUsers.length} users for ID mapping`);
  
  for (const fileName of remainingFiles) {
    console.log(`Processing file: ${fileName}`);
    const filePath = path.join(dataDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (model) {
      try {
        for (const data of jsonData) {
          // Map user IDs for records that reference users
          let mappedData = { ...data };
          
          if (data.authorUserId) {
            const actualAuthorId = allUsers[data.authorUserId - 1]?.userId;
            if (actualAuthorId) {
              mappedData.authorUserId = actualAuthorId;
            }
          }
          
          if (data.assignedUserId) {
            const actualAssignedId = allUsers[data.assignedUserId - 1]?.userId;
            if (actualAssignedId) {
              mappedData.assignedUserId = actualAssignedId;
            }
          }
          
          if (data.userId) {
            const actualUserId = allUsers[data.userId - 1]?.userId;
            if (actualUserId) {
              mappedData.userId = actualUserId;
            }
          }
          
          if (data.uploadedById) {
            const actualUploadedById = allUsers[data.uploadedById - 1]?.userId;
            if (actualUploadedById) {
              mappedData.uploadedById = actualUploadedById;
            }
          }
          
          console.log(`Creating data for ${modelName}:`, mappedData);
          await model.create({ data: mappedData });
        }
        console.log(`Seeded ${modelName} with data from ${fileName}`);
      } catch (error) {
        console.error(`Error seeding data for ${modelName}:`, error);
        throw error;
      }
    } else {
      console.error(`Model ${modelName} not found on prisma client`);
    }
  }
  console.log("main end");
}

main()
  .then(async () => {
    console.log("Seeding finished successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("An error occurred during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

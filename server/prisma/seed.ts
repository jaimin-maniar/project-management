import { PrismaClient } from "../generated/prisma/client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Fallback for local quick tests
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:password@localhost:5432/project_management_db?schema=public";
}

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((f) =>
    path.basename(f, path.extname(f))
  );
  for (const modelName of modelNames.reverse()) {
    const delegate: any = (prisma as any)[modelName];
    if (!delegate) {
      console.warn(
        `[deleteAllData] Model '${modelName}' not found on Prisma client; skipping.`
      );
      continue;
    }
    await delegate.deleteMany({});
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

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

  // 0) Clean existing data (reverse order within helper)
  await deleteAllData(orderedFileNames);

  // ---------- 1) TEAMS (create first) ----------
  const teamSeed = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8")
  );
  // Your team.json appears to reference users later; create teams first without user refs.
  const teamsWithoutUsers = teamSeed.map((t: any) => ({
    teamName: t.teamName,
  }));

  const createdTeams = await Promise.all(
    teamsWithoutUsers.map((data: any) => prisma.team.create({ data }))
  );

  // Map: seed index (1-based) -> actual team.id
  const teamIdMap = new Map<number, string>();
  createdTeams.forEach((t, idx) => {
    teamIdMap.set(idx + 1, t.id);
  });

  // ---------- 2) USERS (map teamId using teamIdMap) ----------
  const userSeed = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "user.json"), "utf-8")
  );

  const createdUsers = [];
  for (const user of userSeed) {
    const actualTeamId = teamIdMap.get(user.teamId);
    if (!actualTeamId) {
      console.warn(
        `[users] No team found for seed teamId=${user.teamId}; skipping user '${
          user?.email ?? ""
        }'`
      );
      continue;
    }
    const toCreate = { ...user, teamId: actualTeamId };
    const u = await prisma.user.create({ data: toCreate });
    createdUsers.push(u);
  }

  // Map: seed user index (1-based) -> actual user.userId (assuming your PK is 'userId')
  // If your PK is 'id' instead, change below to u.id
  const userIdMap = new Map<number, number>();
  createdUsers.forEach((u, idx) => {
    // adjust this if your model uses 'id' instead of 'userId'
    const actual = (u as any).userId ?? (u as any).id;
    userIdMap.set(idx + 1, Number(actual));
  });

  // ---------- 3) UPDATE TEAMS with user references (map seed user indices -> actual user IDs) ----------
  // team.json likely has productOwnerUserId / projectManagerUserId as seed indices
  for (let i = 0; i < teamSeed.length; i++) {
    const createdTeam = createdTeams[i];
    if (!createdTeam) {
      console.warn(`[teams update] No created team at index ${i}; skipping`);
      continue;
    }

    const seedTeam = teamSeed[i];

    const productOwnerReal = seedTeam.productOwnerUserId
      ? userIdMap.get(seedTeam.productOwnerUserId)
      : undefined;
    const projectManagerReal = seedTeam.projectManagerUserId
      ? userIdMap.get(seedTeam.projectManagerUserId)
      : undefined;

    await prisma.team.update({
      where: { id: createdTeam.id },
      data: {
        ...(productOwnerReal ? { productOwnerUserId: productOwnerReal } : {}),
        ...(projectManagerReal
          ? { projectManagerUserId: projectManagerReal }
          : {}),
      },
    });
  }

  // ---------- 4) PROJECTS ----------
  const projectSeed = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "project.json"), "utf-8")
  );
  for (const project of projectSeed) {
    await prisma.project.create({ data: project });
  }

  // ---------- 5) PROJECT TEAMS (map teamId) ----------
  const projectTeamSeed = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "projectTeam.json"), "utf-8")
  );

  for (const pt of projectTeamSeed) {
    const actualTeamId = teamIdMap.get(pt.teamId);
    if (!actualTeamId) {
      console.warn(
        `[projectTeam] No team found for seed teamId=${pt.teamId}; skipping`
      );
      continue;
    }
    const toCreate = { ...pt, teamId: actualTeamId };
    await prisma.projectTeam.create({ data: toCreate });
  }

  // ---------- 6) REMAINING (map all user references via userIdMap) ----------
  const remainingFiles = [
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  for (const fileName of remainingFiles) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const delegate: any = (prisma as any)[modelName];

    if (!delegate) {
      console.warn(
        `[${fileName}] Model '${modelName}' not found on Prisma client; skipping.`
      );
      continue;
    }

    for (const row of jsonData) {
      const mapped = { ...row };

      const maybeMap = (seedVal?: number) =>
        typeof seedVal === "number" ? userIdMap.get(seedVal) : undefined;

      if (row.authorUserId) {
        const v = maybeMap(row.authorUserId);
        if (v) mapped.authorUserId = v;
      }
      if (row.assignedUserId) {
        const v = maybeMap(row.assignedUserId);
        if (v) mapped.assignedUserId = v;
      }
      if (row.userId) {
        const v = maybeMap(row.userId);
        if (v) mapped.userId = v;
      }
      if (row.uploadedById) {
        const v = maybeMap(row.uploadedById);
        if (v) mapped.uploadedById = v;
      }

      await delegate.create({ data: mapped });
    }
  }

  console.log("Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

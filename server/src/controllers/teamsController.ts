import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: `Error retrieving teams, ${message}` });
  }
};

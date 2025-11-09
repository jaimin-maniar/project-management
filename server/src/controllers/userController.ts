import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: `Error retrieving users, ${message}` });
  }
};

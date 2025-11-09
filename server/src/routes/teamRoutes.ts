import { Router } from "express";
import { getTeams } from "../controllers/teamsController.js";

const router = Router();

router.get("/", getTeams);

export default router;

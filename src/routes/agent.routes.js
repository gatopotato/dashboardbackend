import { Router } from "express";
import {
  getAgents,
  getRequiredAgents,
  getRequiredAgentsbyhead
} from "../controllers/agent.controller.js";

const router = Router();
router.get("/", getAgents);
router.get("/rm/:relationshipManagerID", getRequiredAgents);
router.get("/head/:headID", getRequiredAgents);
export default router;

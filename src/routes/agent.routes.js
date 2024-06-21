import { Router } from "express";
import {
  getAgents,
  getRequiredAgents,
} from "../controllers/agent.controller.js";

const router = Router();
router.get("/", getAgents);
router.get("/rm/:relationshipManagerID", getRequiredAgents);

export default router;

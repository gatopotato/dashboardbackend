import { Router } from "express";
import {
  getAgents,
  getRequiredAgents,
  getRequiredAgentsbyhead
} from "../controllers/agent.controller.js";

const router = Router();
router.get("/", getAgents);
router.get("/rm/:relationshipManagerId", getRequiredAgents);
router.get("/head/:headId", getRequiredAgentsbyhead);
export default router;

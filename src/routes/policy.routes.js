import { Router } from "express";
import {
  getPolicies,
  getPolicybyHead,
  getPolicybyRM,
  getPolicybyAgent,
} from "../controllers/policy.controller.js";

const router = Router();

router.get("/", getPolicies);
router.get("/head/:headId", getPolicybyHead);
router.get("/rm/:relationshipManagerId", getPolicybyRM);
router.get("/agent/:agentId", getPolicybyAgent);

export default router;

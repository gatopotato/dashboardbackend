import express from "express";
import {
  getRelationshipManagers,
  getrRequiredRms,
} from "../controllers/relationshipManager.controller.js";

const router = express.Router();

router.get("/", getRelationshipManagers);
router.get("/:headid", getrRequiredRms);

export default router;

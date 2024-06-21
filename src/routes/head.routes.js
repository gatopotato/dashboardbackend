import { Router } from "express";
import { getHeads } from "../controllers/head.controller.js";

const router = Router();

router.get("/", getHeads);

export default router;

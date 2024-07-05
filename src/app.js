import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

import agentRouter from "./routes/agent.routes.js";
import headRouter from "./routes/head.routes.js";
import policyRouter from "./routes/policy.routes.js";
import relationshipManagerRouter from "./routes/relationshipManager.routes.js";

app.use("/api/v2/agent", agentRouter);
app.use("/api/v2/head", headRouter);
app.use("/api/v2/policy", policyRouter);
app.use("/api/v2/rm", relationshipManagerRouter);

export default app;

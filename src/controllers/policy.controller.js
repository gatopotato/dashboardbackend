import { Policy } from "../models/policy.model.js";
import { apiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Head } from "../models/head.model.js";
import { Agent } from "../models/agent.model.js";
import { RelationshipManager } from "../models/relationshipManager.model.js";
const getPolicies = asyncHandler(async (req, res) => {
  const allData = await Policy.aggregate([
    {
      $project: {
        _id: 1,
        policyNumber: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new apiResponse(200, allData, "All data returned."));
});

const getPolicybyHead = asyncHandler(async (req, res) => {
  const { headId } = req.params;
  const head = await Head.findById(headId);
  if (!head) {
    throw new apiError(404, "Head not found");
  }
  const data = await Policy.aggregate([
    {
      $match: {
        headId: headId,
      },
    },
  ]);
  return res
    .status(200)
    .json(new apiResponse(200, data, "Policy by head returned."));
});

const getPolicybyRM = asyncHandler(async (req, res) => {
  const { relationshipManagerId } = req.params;
  const rm = await RelationshipManager.findById(relationshipManagerId);
  if (!rm) {
    throw new apiError(404, "Relationship Manager not found");
  }
  const data = await Policy.aggregate([
    {
      $match: {
        rmId: relationshipManagerId,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new apiResponse(200, data, "Policy by Relationship Manager returned.")
    );
});

const getPolicybyAgent = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const agent = await Agent.findById(agentId);
  if (!agent) {
    throw new apiError(404, "Agent not found");
  }
  const data = await Policy.aggregate([
    {
      $match: {
        agentID: agentId,
      },
    },
  ]);
  return res
    .status(200)
    .json(new apiResponse(200, data, "Policy by Agent returned."));
});

export { getPolicies, getPolicybyHead, getPolicybyRM, getPolicybyAgent };

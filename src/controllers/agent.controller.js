import { Agent } from "../models/agent.model.js";
import { apiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { RelationshipManager } from "../models/relationshipManager.model.js";
import { apiError } from "../utils/apiError.js";
const getAgents = asyncHandler(async (req, res) => {
  let data = await Agent.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res.status(200).json(new apiResponse(200, data, "Agents returned."));
});

const getRequiredAgents = asyncHandler(async (req, res) => {
  const { relationshipManagerID } = req.params;

  const relationshipManager = await RelationshipManager.findById(
    relationshipManagerID
  );

  if (!relationshipManager) {
    throw new apiError(404, "Relationship Manager not found.");
  }

  let data = await Agent.aggregate([
    {
      $match: {
        relationshipManagerID: ObjectId(relationshipManagerID),
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res.status(200).json(new apiResponse(200, data, "Agents returned."));
});

export { getAgents, getRequiredAgents };

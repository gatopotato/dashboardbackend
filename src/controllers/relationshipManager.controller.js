import { RelationshipManager } from "../models/relationshipManager.model.js";
import { apiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Head } from "../models/head.model.js";

const getRelationshipManagers = asyncHandler(async (req, res) => {
  let data = await RelationshipManager.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, data, "Relationship Managers returned."));
});

const getrRequiredRms = asyncHandler(async (req, res) => {
  const { headid } = req.params;

  const head = await Head.findById(headid);

  if (!head) {
    throw new apiError(404, "Head not found.");
  }

  let data = await RelationshipManager.aggregate([
    {
      $match: {
        headId: ObjectId(headid),
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, data, "Relationship Managers returned."));
});

export { getRelationshipManagers, getrRequiredRms };

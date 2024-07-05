import { Agent } from "../models/agent.model.js";
import { apiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { RelationshipManager } from "../models/relationshipManager.model.js";
import { Head } from "../models/head.model.js";
import { apiError } from "../utils/apiError.js";

const generateAgentId = async()=>{
  let corpInsId = "AIBAG"+ (""+Math.random()).substring(2,7);
  let checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  while(checkCorpIns){
      corpInsId = "AIBAG"+ (""+Math.random()).substring(2,7);
      checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  }
  return corpInsId;
};

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
  const { relationshipManagerId } = req.params;

  const relationshipManager = await RelationshipManager.findById(
    relationshipManagerId
  );

  if (!relationshipManager) {
    throw new apiError(404, "Relationship Manager not found.");
  }

  let data = await Agent.aggregate([
    {
      $match: {
        relationshipManagerId: relationshipManagerId,
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

const getRequiredAgentsbyhead = asyncHandler(async (req, res) => {
  const { headId } = req.params;

  const head = await Head.findById(
    headId
  );

  if (!head) {
    throw new apiError(404, "Head not found.");
  }

  let data = await Agent.aggregate([
    {
      $match: {
        headId: headId,
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

const registerAgent = asyncHandler(async (req, res) => {
  
});

export { getAgents, getRequiredAgents, getRequiredAgentsbyhead };

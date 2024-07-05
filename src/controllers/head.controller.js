import { Head } from "../models/head.model.js";
import { apiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateHeadId = async()=>{
  let corpInsId = "AIBHD"+ (""+Math.random()).substring(2,7);
  let checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  while(checkCorpIns){
      corpInsId = "AIBHD"+ (""+Math.random()).substring(2,7);
      checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  }
  return corpInsId;
};

const getHeads = asyncHandler(async (req, res) => {
  let data = await Head.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res.status(200).json(new apiResponse(200, data, "Heads returned."));
});

export { getHeads };

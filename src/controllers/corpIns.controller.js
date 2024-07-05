import { CorporateInsurance } from "../models/corpIns.model.js";
import asynchandler from '../utils/asyncHandler.js'
import apiResponse from '../utils/apiresponse.js';
import apiError from '../utils/apiError.js';

const generateCorpInsId = async()=>{
    let corpInsId = "AIBICI"+ (""+Math.random()).substring(2,8);
    let checkCorpIns = await CorporateInsurance.findOne({corpInsId});
    while(checkCorpIns){
        corpInsId = "AIBICI"+ (""+Math.random()).substring(2,8);
        checkCorpIns = await CorporateInsurance.findOne({corpInsId});
    }
    return corpInsId;
};

const createCorpIns = asynchandler(async(req,res)=>{
    const {
        productId
    } = req.body;

    if(!(productId)){
        throw new apiError(400,'All fields are required');
    }

    const oldCorpIns = await CorporateInsurance.findOne({prod});
    if(oldCorpIns?._id){
        throw new apiError(400,'Corporate Insurance already exists');
    }

    const corpInsId = await generateCorpInsId();

    const newCorpIns = CorporateInsurance.create({
        corpInsId,
        name,
        address,
        contactDetails,
        rmId
    });

    return res.status(201).json(apiResponse(201,newCorpIns,"Corporate Insurance created successfully"));

});

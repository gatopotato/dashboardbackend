import jwt from "jsonwebtoken";
import {apiError} from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Head } from "../models/head.model.js";
import { RelationshipManager } from "../models/relationshipManager.model.js";
import { Agent } from "../models/agent.model.js";

const verifyHead = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw apiError(401, "Authorization TOekn not found.");
        }
        const decoded = jwt.verify(token, process.env.HEAD_ACCESS_TOKEN_SECRET);
        const head = await Head.findById(decoded._id).select("-password -refreshToken");
        if(!head){
            throw new apiError(401,"Invalid Token.")
        }
        res.head = head;
        next()
    
    } catch (error) {
        throw new apiError(401, "Unauthorized request.");
    }
});

const verifyRm = asyncHandler(async(req,res,next)=>{
    try {
        console.log("hello");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw apiError(401, "Authorization Token not found.");
        }
        const decoded = jwt.verify(token, process.env.RM_ACCESS_TOKEN_SECRET);
        const rm = await RelationshipManager.findById(decoded._id).select("-password -refreshToken");
        if(!rm){
            throw new apiError(401,"Invalid Token.")
        }
        res.rm = rm;
        next()
    
    } catch (error) {
        throw new apiError(401, error );
    }
});

const verifyAgent = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw apiError(401, "Authorization Token not found.");
        }
        const decoded = jwt.verify(token, process.env.AGENT_ACCESS_TOKEN_SECRET);
        const agent = await Agent.findById(decoded._id).select("-password -refreshToken");
        if(!agent){
            throw new apiError(401,"Invalid Token.")
        }
        res.agent = agent;
        next()
    
    } catch (error) {
        throw new apiError(401, "Unauthorized request.");
    }
});
export { verifyHead, verifyRm, verifyAgent };
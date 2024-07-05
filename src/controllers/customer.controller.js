import {Customer} from '../models/customer.model.js';
import asynchandler from '../utils/asyncHandler.js'
import apiResponse from '../utils/apiresponse.js';
import apiError from '../utils/apiError.js';

const generateCustId = async()=>{
  let custId = "AIBCS"+ (""+Math.random()).substring(2,7);
  let checkCust = await Customer.findOne({custId});
  while(checkCust){
    custId = "AIBCS"+ (""+Math.random()).substring(2,7);
    checkCust = await Customer.findOne({custId});
  }
  return custId;
}

const createCustomer = asynchandler(async(req,res)=>{
  const {
    name,
    address,
    contactDetails,
    dateOfBirth,
    rmId,
  } = req.body;

  if(!(name && address && contactDetails && dateOfBirth && rmId)){
    throw new apiError(400,'All fields are required');
  }

  const oldCustomer = await Customer.findOne({contactDetails});
  if(oldCustomer?._id){
    throw new apiError(400,'Customer already exists');
  }

  const custId = await generateCustId();

  const newCustomer = Customer.create({
    custId,
    name,
    address,
    contactDetails,
    dateOfBirth,
    rmId
  });

  return res.status(201).json(apiResponse(201,newCustomer,"Customer created successfully"));

});
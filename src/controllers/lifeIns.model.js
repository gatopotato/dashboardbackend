import { LifeInsurance } from "../models/lifeIns.model.js";

const generateLifeInsId = async()=>{
    let lifeInsId = "AIBICI"+ (""+Math.random()).substring(2,8);
    let checkLifeIns = await LifeInsurance.findOne({lifeInsId});
    while(checkLifeIns){
        LifeInsId = "AIBICI"+ (""+Math.random()).substring(2,8);
        checkLifeIns = await LifeInsurance.findOne({lifeInsId});
    }
    return lifeInsId;
};
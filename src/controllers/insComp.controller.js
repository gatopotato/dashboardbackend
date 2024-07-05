import {InsCompany} from '../models/insComp.model.js';

const generateInsCompId = async()=>{
  let corpInsId = "AIBIC"+ (""+Math.random()).substring(2,7);
  let checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  while(checkCorpIns){
      corpInsId = "AIBIC"+ (""+Math.random()).substring(2,7);
      checkCorpIns = await CorporateInsurance.findOne({corpInsId});
  }
  return corpInsId;
};
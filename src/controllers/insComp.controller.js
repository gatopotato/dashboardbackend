import { InsCompany } from '../models/insComp.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateInsCompId = async () => {
    let corpInsId = 'AIBIC' + ('' + Math.random()).substring(2, 7);
    let checkCorpIns = await InsCompany.findOne({ corpInsId });
    while (checkCorpIns) {
        corpInsId = 'AIBIC' + ('' + Math.random()).substring(2, 7);
        checkCorpIns = await InsCompany.findOne({ corpInsId });
    }
    return corpInsId;
};

const createInsComp = asyncHandler(async (req, res) => {
    const { name, managerName, managerPhone } = req.body;

    const insCompId = await generateInsCompId();

    const insComp = await InsCompany.create({
        name,
        managerName,
        managerPhone,
        insCompId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, insComp, 'Insurance Company created.'));
});

const getInsComp = asyncHandler(async (req, res) => {
    const { insCompId } = req.params;
    const insComp = await InsCompany.findById(insCompId);
    if (!insComp) {
        throw new apiError(404, 'Insurance Company not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, insComp, 'Insurance Company returned.'));
});

const getInsCompbyID = asyncHandler(async (req, res) => {
    const { insCompId } = req.params;
    const insComp = await InsCompany.findOne({ insCompId });
    if (!insComp) {
        throw new apiError(404, 'Insurance Company not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, insComp, 'Insurance Company returned.'));
});

const getAllInsComp = asyncHandler(async (req, res) => {
    const allData = await InsCompany.find();
    return res
        .status(200)
        .json(new apiResponse(200, allData, 'All data returned.'));
});

export { createInsComp, getInsComp, getAllInsComp, getInsCompbyID };

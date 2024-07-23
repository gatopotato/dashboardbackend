import { LifeInsurance } from '../models/lifeIns.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiresponse.js';
import apiError from '../utils/apiError.js';

const generateLifeInsuranceId = async () => {
    let lifeInsId = 'AIBILI' + ('' + Math.random()).substring(2, 8);
    let checkLifeInsId = await LifeInsurance.findOne({ lifeInsId });
    while (checkLifeInsId) {
        lifeInsId = 'AIBILI' + ('' + Math.random()).substring(2, 8);
        checkLifeInsId = await LifeInsurance.findOne({ lifeInsId });
    }
    return lifeInsId;
};

const createLifeIns = asyncHandler(async (req, res) => {
    const {} = req.body;

    const lifeInsuranceId = await generateLifeInsuranceId();

    const lifeIns = await LifeInsurance.create({
        lifeInsuranceId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, lifeIns, 'Life Insurance created.'));
});

const getLifeIns = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lifeIns = await LifeInsurance.findById(id);
    if (!lifeIns) {
        throw new apiError(404, 'Life Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, lifeIns, 'Life Insurance returned.'));
});

const getLifeInsById = asyncHandler(async (req, res) => {
    const { lifeInsuranceId } = req.params;
    const lifeIns = await LifeInsurance.findOne({ lifeInsuranceId });
    if (!lifeIns) {
        throw new apiError(404, 'Life Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, lifeIns, 'Life Insurance returned.'));
});

export { createLifeIns, getLifeIns, getLifeInsById };

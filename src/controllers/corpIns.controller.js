import { CorporateInsurance } from '../models/corpIns.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiresponse.js';
import { apiError } from '../utils/apiError.js';

const generateCorporateInsuranceId = async () => {
    let corpInsId = 'AIBICI' + ('' + Math.random()).substring(2, 8);
    let checkCorpInsId = await CorporateInsurance.findOne({ corpInsId });
    while (checkCorpInsId) {
        corpInsId = 'AIBICI' + ('' + Math.random()).substring(2, 8);
        checkCorpInsId = await CorporateInsurance.findOne({ corpInsId });
    }
    return corpInsId;
};

const createCorpIns = asyncHandler(async (req, res) => {
    const {} = req.body;

    const corporateInsuranceId = await generateCorporateInsuranceId();

    const corpIns = await CorporateInsurance.create({
        corporateInsuranceId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, corpIns, 'Corporate Insurance created.'));
});

const getCorpIns = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const corpIns = await CorporateInsurance.findById(id);
    if (!corpIns) {
        throw new apiError(404, 'Corporate Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, corpIns, 'Corporate Insurance returned.'));
});

const getCorpInsById = asyncHandler(async (req, res) => {
    const { corporateInsuranceId } = req.params;
    const corpIns = await CorporateInsurance.findOne({ corporateInsuranceId });
    if (!corpIns) {
        throw new apiError(404, 'Corporate Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, corpIns, 'Corporate Insurance returned.'));
});

export { createCorpIns, getCorpIns, getCorpInsById };

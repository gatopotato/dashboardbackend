import { MedicalInsurance } from '../models/medicalIns.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiresponse.js';
import { apiError } from '../utils/apiError.js';

const generateMedicalInsuranceId = async () => {
    let medicalInsId = 'AIBIMD' + ('' + Math.random()).substring(2, 8);
    let checkMedicalInsId = await MedicalInsurance.findOne({ medicalInsId });
    while (checkMedicalInsId) {
        medicalInsId = 'AIBIMD' + ('' + Math.random()).substring(2, 8);
        checkMedicalInsId = await MedicalInsurance.findOne({ medicalInsId });
    }
    return medicalInsId;
};

const createMedicalIns = asyncHandler(async (req, res) => {
    const {} = req.body;

    const medicalInsuranceId = await generateMedicalInsuranceId();

    const medicalIns = await MedicalInsurance.create({
        medicalInsuranceId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, medicalIns, 'Medical Insurance created.'));
});

const getMedicalIns = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const medicalIns = await MedicalInsurance.findById(id);
    if (!medicalIns) {
        throw new apiError(404, 'Medical Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, medicalIns, 'Medical Insurance returned.'));
});

const getMedicalInsById = asyncHandler(async (req, res) => {
    const { medicalInsuranceId } = req.params;
    const medicalIns = await MedicalInsurance.findOne({ medicalInsuranceId });
    if (!medicalIns) {
        throw new apiError(404, 'Medical Insurance not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, medicalIns, 'Medical Insurance returned.'));
});

export { createMedicalIns, getMedicalIns, getMedicalInsById };

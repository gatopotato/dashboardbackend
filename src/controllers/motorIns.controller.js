import { MotorInsurance } from '../models/motorIns.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiresponse.js';

const generateMotorInsuranceId = async () => {
    let motorInsId = 'AIBIMT' + ('' + Math.random()).substring(2, 8);
    let checkMotorInsId = await MotorInsurance.findOne({ motorInsId });
    while (checkMotorInsId) {
        motorInsId = 'AIBIMT' + ('' + Math.random()).substring(2, 8);
        checkMotorInsId = await MotorInsurance.findOne({ motorInsId });
    }
    return motorInsId;
};

const createMotorInsurance = asyncHandler(async (req, res) => {
    const { vehicleNo, model, yearOfManufacture, fuelType, category, cases } =
        req.body;

    const motorInsuranceId = await generateMotorInsuranceId();

    const motorInsurance = await MotorInsurance.create({
        vehicleNo,
        model,
        yearOfManufacture,
        fuelType,
        category,
        cases,
        motorInsuranceId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, motorInsurance, 'Motor Insurance created.'));
});

const getMotorInsurance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const motorInsurance = await MotorInsurance.findById(id);
    if (!motorInsurance) {
        throw new apiError(404, 'Motor Insurance not found');
    }
    return res
        .status(200)
        .json(
            new apiResponse(200, motorInsurance, 'Motor Insurance returned.')
        );
});

const getMotorInsuranceById = asyncHandler(async (req, res) => {
    const { motorInsuranceId } = req.params;
    const motorInsurance = await MotorInsurance.findOne({ motorInsuranceId });
    if (!motorInsurance) {
        throw new apiError(404, 'Motor Insurance not found');
    }
    return res
        .status(200)
        .json(
            new apiResponse(200, motorInsurance, 'Motor Insurance returned.')
        );
});

export { createMotorInsurance, getMotorInsurance, getMotorInsuranceById };

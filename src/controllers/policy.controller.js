import { Policy } from '../models/policy.model.js';
import { Product } from '../models/product.model.js';
import { apiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { Head } from '../models/head.model.js';
import { Agent } from '../models/agent.model.js';
import { RelationshipManager } from '../models/relationshipManager.model.js';
import { InsCompany } from '../models/insComp.model.js';
const generateBookingNo = async () => {
    let bookingNo = 'AIBSBK' + ('' + Math.random()).substring(2, 8);
    let checkBookingNo = await Booking.findOne({ bookingNo });
    while (checkBookingNo) {
        bookingNo = 'AIBSBK' + ('' + Math.random()).substring(2, 8);
        checkBookingNo = await Booking.findOne({ bookingNo });
    }
    return bookingNo;
};

const getPolicies = asyncHandler(async (req, res) => {
    const allData = await Policy.find();
    return res
        .status(200)
        .json(new apiResponse(200, allData, 'All data returned.'));
});

const getPolicybyHead = asyncHandler(async (req, res) => {
    const { headId } = req.params;
    const head = await Head.findById(headId);
    if (!head) {
        throw new apiError(404, 'Head not found');
    }
    const data = await Policy.find({ headId: head._id });
    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policy by head returned.'));
});

const getPolicybyRM = asyncHandler(async (req, res) => {
    const { relationshipManagerId } = req.params;
    const rm = await RelationshipManager.findById(relationshipManagerId);
    if (!rm) {
        throw new apiError(404, 'Relationship Manager not found');
    }
    const data = await Policy.find({ relationshipManagerId: rm._id });
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                data,
                'Policy by Relationship Manager returned.'
            )
        );
});

const getPolicybyAgent = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);
    if (!agent) {
        throw new apiError(404, 'Agent not found');
    }
    const data = await Policy.find({ agentId: agent._id });
    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policy by Agent returned.'));
});

const getPolicyDetails = asyncHandler(async (req, res) => {
    const { policyId } = req.params;
    const policy = await Policy.findById(policyId);
    if (!policy) {
        throw new apiError(404, 'Policy not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, policy, 'Policy details returned.'));
});

const getPolicyDetailsbyNo = asyncHandler(async (req, res) => {
    const { policyNo } = req.params;
    const policy = await Policy.find({ policyNo: policyNo });
    if (!policy) {
        throw new apiError(404, 'Policy not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, policy, 'Policy details returned.'));
});

const getPolicyDetailsbyBookingNo = asyncHandler(async (req, res) => {
    const { bookingNo } = req.params;
    const policy = await Policy.find({ bookingNo });
    if (!policy) {
        throw new apiError(404, 'Policy not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, policy, 'Policy details returned.'));
});

// const updatePolicy = asyncHandler(async (req, res) => {
//     const { policyId,policyNo,customerId, } = req.body;
//     const policy = await Policy.findById(policyId);
//     if (!policy) {
//         throw new apiError(404, 'Policy not found');
//     }

//     const updatedPolicy = await Policy.findByIdAndUpdate(policyId, req.body, {
//         new: true,
//     });
//     return res
//         .status(200)
//         .json(new apiResponse(200, updatedPolicy, 'Policy updated.'));
// });

const deletePolicy = asyncHandler(async (req, res) => {
    const { policyId } = req.body;
    const policy = await Policy.findById(policyId);
    if (!policy) {
        throw new apiError(404, 'Policy not found');
    }
    await Policy.findByIdAndDelete(policyId);
    return res.status(200).json(new apiResponse(200, {}, 'Policy deleted.'));
});

const createPolicy = asyncHandler(async (req, res) => {
    const {
        insuranceCompanyId,
        headId,
        relationshipManagerId,
        agentId,
        policyNo,
        customerId,
        productId,
        issueDate,
        expiryDate,
        ncb,
        idvValue,
        netOdPremium,
        commPremium,
    } = req.body;
    if (
        !(
            insuranceCompanyId &&
            headId &&
            relationshipManagerId &&
            policyNo &&
            customerId &&
            productId &&
            issueDate &&
            expiryDate &&
            ncb &&
            idvValue &&
            netOdPremium &&
            commPremium
        )
    ) {
        throw new apiError(400, 'All fields are required');
    }
    const head = await Head.findById(headId);
    if (!head) {
        throw new apiError(404, 'Head not found');
    }
    const rm = await RelationshipManager.findById(relationshipManagerId);
    if (!rm) {
        throw new apiError(404, 'Relationship Manager not found');
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new apiError(404, 'Customer not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(404, 'Product not found');
    }

    const bookingNo = await generateBookingNo();

    if (agentId) {
        const agent = await Agent.findById(agentId);
        if (!agent) {
            throw new apiError(404, 'Agent not found');
        }
        const newPolicy = await Policy.create({
            headId: head._id,
            relationshipManagerId: rm._id,
            agentId: agent._id,
            policyNo,
            customerId: customer._id,
            productId: product._id,
            issueDate,
            expiryDate,
            ncb,
            idvValue,
            netOdPremium,
            commPremium,
            bookingNo,
        });

        product.policyId = newPolicy._id;
        await product.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new apiResponse(200, newPolicy, 'Policy created.'));
    }
    const newPolicy = await Policy.create({
        headId: head._id,
        relationshipManagerId: rm._id,
        policyNo,
        customerId: customer._id,
        productId: product._id,
        issueDate,
        expiryDate,
        ncb,
        idvValue,
        netOdPremium,
        commPremium,
        bookingNo,
    });

    product.policyId = newPolicy._id;
    await product.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, newPolicy, 'Policy created.'));
});

const getAllPolicyDetails = asyncHandler(async (req, res) => {
    const { policyId } = req.params;
    const policy = await Policy.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(policyId),
            },
        },
        {
            $lookup: {
                from: 'heads',
                localField: 'headId',
                foreignField: '_id',
                as: 'head',
            },
        },
        {
            $lookup: {
                from: 'relationshipmanagers',
                localField: 'relationshipManagerId',
                foreignField: '_id',
                as: 'relationshipManager',
            },
        },
        {
            $lookup: {
                from: 'agents',
                localField: 'agentId',
                foreignField: '_id',
                as: 'agent',
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product',
                // pipeline:[{

                // }]
            },
        },
        {
            $addFields: {
                head: {
                    $arrayElemAt: ['$head', 0],
                },
                relationshipManager: {
                    $arrayElemAt: ['$relationshipManager', 0],
                },
                agent: {
                    $arrayElemAt: ['$agent', 0],
                },
                product: {
                    $arrayElemAt: ['$product', 0],
                },
            },
        },
    ]);
    return res
        .status(200)
        .json(new apiResponse(200, policy, 'Policy details returned.'));
});

export {
    getPolicies,
    getPolicybyHead,
    getPolicybyRM,
    getPolicybyAgent,
    getPolicyDetails,
    getPolicyDetailsbyNo,
    deletePolicy,
    createPolicy,
    getAllPolicyDetails,
};

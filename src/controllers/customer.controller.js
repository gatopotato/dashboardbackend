import { Customer } from '../models/customer.model.js';
import { Head } from '../models/head.model.js';
import { Agent } from '../models/agent.model.js';
import { RelationshipManager } from '../models/relationshipManager.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiresponse.js';
import { apiError } from '../utils/apiError.js';

const generateCustId = async () => {
    let custId = 'AIBCS' + ('' + Math.random()).substring(2, 7);
    let checkCust = await Customer.findOne({ custId });
    while (checkCust) {
        custId = 'AIBCS' + ('' + Math.random()).substring(2, 7);
        checkCust = await Customer.findOne({ custId });
    }
    return custId;
};

const createCustomer = asyncHandler(async (req, res) => {
    const {
        name,
        address,
        contactDetails,
        dateOfBirth,
        relationshipManagerId,
        agentId,
    } = req.body;
    console.log(req.body);
    if (
        !(
            name ||
            address ||
            contactDetails ||
            dateOfBirth ||
            relationshipManagerId
        )
    ) {
        throw new apiError(400, 'All fields are required');
    }

    const oldCustomer = await Customer.findOne({ contactDetails });
    if (oldCustomer?._id) {
        throw new apiError(
            400,
            `Customer already exists with ID:${oldCustomer.custId}`
        );
    }

    const custId = await generateCustId();

    const rm = await RelationshipManager.findById(relationshipManagerId);
    if (!rm) {
        throw new apiError(400, 'Relationship Manager not found');
    }

    if (agentId) {
        const agent = await Agent.findById(agentId);
        if (!agent) {
            throw new apiError(400, 'Agent not found');
        }
        if (agent.relationshipManagerId.toString() != relationshipManagerId) {
            throw new apiError(
                400,
                'Agent and Relationship Manager do not match'
            );
        }
        const newCustomer = await Customer.create({
            custId,
            name,
            address,
            contactDetails,
            dateOfBirth,
            relationshipManagerId,
            agentId,
        });
        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    newCustomer,
                    'Customer created successfully'
                )
            );
    }

    const newCustomer = await Customer.create({
        custId,
        name,
        address,
        contactDetails,
        dateOfBirth,
        relationshipManagerId,
    });

    return res
        .status(201)
        .json(
            new apiResponse(201, newCustomer, 'Customer created successfully')
        );
});

const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find();
    res.status(200).json(
        new apiResponse(200, customers, 'Customers retrieved successfully.')
    );
});

const getCustomersByRM = asyncHandler(async (req, res) => {
    const { relationshipManagerId } = req.params;
    const rm = await RelationshipManager.findById(relationshipManagerId);
    if (!rm) {
        throw new apiError(404, 'Relationship Manager not found.');
    }
    const customers = await Customer.find({ relationshipManagerId });
    res.status(200).json(
        new apiResponse(200, customers, 'Customers retrieved successfully.')
    );
});

const getCustomersByHead = asyncHandler(async (req, res) => {
    const { headId } = req.params;
    const head = await Head.findById(headId);
    if (!head) {
        throw new apiError(404, 'Head not found');
    }
    const rms = await RelationshipManager.find({ headId });
    console.log(rms);
    const rmIds = rms.map((rm) => rm._id);
    const customers = await Customer.find({
        relationshipManagerId: { $in: rmIds },
    });
    res.status(200).json(
        new apiResponse(200, customers, 'Customers retrieved successfully.')
    );
});

const getCustomersByAgent = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);
    if (!agent) {
        throw new apiError(404, 'Agent not found.');
    }
    const customers = await Customer.find({ agentId });
    res.status(200).json(
        new apiResponse(200, customers, 'Customers retrieved successfully.')
    );
});

const getCustomerDetails = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new apiError(404, 'Customer not found.');
    }
    res.status(200).json(
        new apiResponse(
            200,
            customer,
            'Customer details retrieved successfully.'
        )
    );
});

export {
    createCustomer,
    getAllCustomers,
    getCustomersByRM,
    getCustomersByHead,
    getCustomersByAgent,
    getCustomerDetails,
};

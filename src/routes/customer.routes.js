import express from 'express';
import {
    getAllCustomers,
    getCustomersByRM,
    getCustomersByHead,
    getCustomersByAgent,
    getCustomerDetails,
    createCustomer,
} from '../controllers/customer.controller.js';

const router = express.Router();

// Route to get all customers
router.get('/', getAllCustomers);

router.post('/create-customer', createCustomer);

// Route to get all customers by relationship manager (RM)
router.get('/rm/:relationshipManagerId', getCustomersByRM);

// Route to get all customers by head (via RMs)
router.get('/head/:headId', getCustomersByHead);

// Route to get all customers by agent
router.get('/agent/:agentId', getCustomersByAgent);

// Route to get customer details
router.get('/:customerId', getCustomerDetails);

export default router;

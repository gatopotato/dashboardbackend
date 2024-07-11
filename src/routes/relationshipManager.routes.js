// import express from "express";
// import {
//   getRelationshipManagers,
//   getrRequiredRms,
// } from "../controllers/relationshipManager.controller.js";

// const router = express.Router();

// router.get("/", getRelationshipManagers);
// router.get("/:headId", getrRequiredRms);

// export default router;
import { Router } from 'express';
import {
    registerRM,
    loginRM,
    logoutRM,
    refreshAccessToken,
    getCurrentRM,
    changePassword,
    updateRMDetails,
    getRMs,
    getRequiredRMsByHead,
    getRMDetails,
    getRMPolicies,
    getCurrentRMPolicies
} from '../controllers/relationshipManager.controller.js';
import { verifyRm } from "../middleware/auth.middleware.js";
const router = Router();

// Route for registering a new relationship manager
router.post('/register', registerRM);

// Route for logging in a relationship manager
router.post('/login', loginRM);

// Route for logging out a relationship manager
router.post('/logout', verifyRm, logoutRM);

// Route for refreshing access token
router.post('/refresh-token', refreshAccessToken);

// Route for getting current relationship manager details
router.get('/current', verifyRm, getCurrentRM);

// Route for changing password
router.put('/change-password', verifyRm, changePassword);

// Route for updating relationship manager details
router.put('/update-details', verifyRm, updateRMDetails);

// Route for getting a list of all relationship managers
router.get('/', getRMs);

// Route for getting relationship managers based on head ID
router.get('/head/:headId', getRequiredRMsByHead);

// Route for getting details of a specific relationship manager
router.get('/:relationshipManagerId', getRMDetails);

// Route for getting policies of the current relationship manager
router.get('/current/policies', verifyRm, getCurrentRMPolicies);

// Route for getting policies of a specific relationship manager
router.get('/:relationshipManagerId/policies', getRMPolicies);
export default router;

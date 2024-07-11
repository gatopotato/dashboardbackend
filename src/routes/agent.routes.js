import {Router} from 'express';
import {
    registerAgent,
    loginAgent,
    logoutAgent,
    refreshAccesToken,
    getCurrentAgent,
    changePassword,
    updateAgentDetails,
    getAgents,
    getRequiredAgents,
    getRequiredAgentsbyhead,
    getAgentDetails,
    getAgentPolicies,
    getCurrentAgentPolicies
} from '../controllers/agent.controller.js';
import {verifyAgent} from "../middleware/auth.middleware.js";
const router = Router();

// Route for registering a new agent
router.post('/register', registerAgent);

// Route for logging in an agent
router.post('/login', loginAgent);

// Route for logging out an agent
router.post('/logout', verifyAgent, logoutAgent);

// Route for refreshing access token
router.post('/refresh-token', refreshAccesToken);

// Route for getting current agent details
router.get('/current', verifyAgent, getCurrentAgent);

// Route for changing password
router.put('/change-password', verifyAgent, changePassword);

// Route for updating agent details
router.put('/update-details', verifyAgent, updateAgentDetails);

// Route for getting a list of all agents
router.get('/', getAgents);

// Route for getting agents based on relationship manager ID
router.get('/relationship-manager/:relationshipManagerId', getRequiredAgents);

// Route for getting agents based on head ID
router.get('/head/:headId', getRequiredAgentsbyhead);

// Route for getting details of a specific agent
router.get('/:agentId', getAgentDetails);

// Route for getting policies of a specific agent


// Route for getting policies of the current agent
router.get('/current/policies', verifyAgent, getCurrentAgentPolicies);

router.get('/:agentId/policies', getAgentPolicies);

export default router;

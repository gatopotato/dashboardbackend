import { Router } from 'express';
import {
    getPolicies,
    getPolicybyHead,
    getPolicybyRM,
    getPolicybyAgent,
    getPolicyDetails,
    getPolicyDetailsbyNo,
    deletePolicy,
    createPolicy,
    getAllPolicyDetails,
} from '../controllers/policy.controller.js';

const router = Router();

router.get('/', getPolicies);
router.get('/head/:headId', getPolicybyHead);
router.get('/rm/:relationshipManagerId', getPolicybyRM);
router.get('/agent/:agentId', getPolicybyAgent);
router.post('/create', createPolicy);
export default router;

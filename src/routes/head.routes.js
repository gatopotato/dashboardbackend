import {Router} from 'express';
import {
    registerHead,
    loginHead,
    logoutHead,
    refreshAccessToken,
    getCurrentHead,
    changePassword,
    updateHeadDetails,
    getHeads,
    getHeadDetails,
    getHeadPolicies,
    getCurrentHeadPolicies,
} from '../controllers/head.controller.js';
import { verifyHead } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerHead);
router.post('/login', loginHead);
router.post('/logout', verifyHead, logoutHead);
router.post('/refreshToken', refreshAccessToken);
router.get('/current', verifyHead, getCurrentHead);
router.put('/changePassword', verifyHead, changePassword);
router.put('/updateDetails', verifyHead, updateHeadDetails);
router.get('/', getHeads);
router.get('/:headId', getHeadDetails);
// router.post('/forgotPassword', forgotPassword);
// router.put('/resetPassword/:token', resetPassword);
router.get('/policies/current', verifyHead, getCurrentHeadPolicies);
router.get('/policies/:headId', getHeadPolicies);

export default router;

import {
    createMotorInsurance,
    getMotorInsurance,
    getMotorInsuranceById,
} from '../controllers/motorIns.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/create', createMotorInsurance);

router.get('/get/:id', getMotorInsurance);

router.get('/get/ID/:motorInsuranceId', getMotorInsuranceById);

export default router;

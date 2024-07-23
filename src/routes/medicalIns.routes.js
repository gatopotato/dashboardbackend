import {
    createMedicalIns,
    getMedicalIns,
    getMedicalInsById,
} from '../controllers/medicalIns.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/create', createMedicalIns);

router.get('/get/:id', getMedicalIns);

router.get('/get/ID/:medicalInsuranceId', getMedicalInsById);

export default router;

import {
    createLifeIns,
    getLifeIns,
    getLifeInsById,
} from '../controllers/lifeIns.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/create', createLifeIns);

router.get('/get/:id', getLifeIns);

router.get('/get/ID/:lifeInsuranceId', getLifeInsById);

export default router;

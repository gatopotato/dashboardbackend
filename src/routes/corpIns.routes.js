import { Router } from 'express';
import {
    createCorpIns,
    getCorpIns,
    getCorpInsById,
} from '../controllers/corpIns.controller.js';

const router = Router();

router.post('/create', createCorpIns);

router.get('/get/:id', getCorpIns);

router.get('/get/ID/:corporateInsuranceId', getCorpInsById);

export default router;

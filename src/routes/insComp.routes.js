import {
    createInsComp,
    getInsComp,
    getAllInsComp,
    getInsCompbyID,
} from '../controllers/insComp.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/create', createInsComp);

router.get('/get/all', getAllInsComp);

router.get('/get/:insCompId', getInsComp);

router.get('/get/ID/:insCompId', getInsCompbyID);

export default router;

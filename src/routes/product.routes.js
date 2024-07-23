import {
    createProduct,
    getProductDetails,
} from '../controllers/product.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/create', createProduct);

router.get('/get/:id', getProductDetails);

export default router;

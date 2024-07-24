import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiresponse.js';
import { apiError } from '../utils/apiError.js';
import { InsCompany } from '../models/insComp.model.js';
import { MotorInsurance } from '../models/motorIns.model.js';
import { CorporateInsurance } from '../models/corpIns.model.js';
import { LifeInsurance } from '../models/lifeIns.model.js';
import { MedicalInsurance } from '../models/medicalIns.model.js';

const generateProductId = async () => {
    let productId = 'AIBSPL' + ('' + Math.random()).substring(2, 7);
    let checkProductId = await Product.findOne({ productId });
    while (checkProductId) {
        productId = 'AIBSPL' + ('' + Math.random()).substring(2, 7);
        checkProductId = await Product.findOne({ productId });
    }
    return productId;
};

const createProduct = asyncHandler(async (req, res) => {
    const { insCompanyId, type, insId, planName } = req.body;
    const insCompany = await InsCompany.findById(insCompanyId);
    if (!insCompany) {
        throw new apiError(404, 'InsCompany not found');
    }
    let ins;
    console.log(type);
    console.log(insId);
    if (type === 'motor') {
        ins = await MotorInsurance.findById(insId);
        console.log(ins);
    } else if (type === 'health') {
        ins = await HealthInsurance.findById(insId);
    } else if (type === 'life') {
        ins = await LifeInsurance.findById(insId);
    } else if (type === 'corporate') {
        ins = await CorporateInsurance.findById(insId);
    } else {
        throw new apiError(404, 'Insurance type not valid');
    }

    if (!ins) {
        throw new apiError(404, 'Insurance not found');
    }

    const productId = await generateProductId();
    console.log(productId);
    const product = await Product.create({
        insCompanyId,
        type,
        insId,
        planName,
        productId,
    });

    ins.productId = product._id;
    await ins.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, product, 'Product created'));
});

const getProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new apiError(404, 'Product not found');
    }
    return res
        .status(200)
        .json(new apiResponse(200, product, 'Product details returned'));
});

export { createProduct, getProductDetails };

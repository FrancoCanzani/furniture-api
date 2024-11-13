import express from 'express';
import { productsController } from '../../controllers/products-controller';
import { productController } from '../../controllers/product-controller';

const router = express.Router();

router.get('/products', productsController);

router.get('/products/:sku', productController);

export default router;

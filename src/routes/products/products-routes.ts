import express from 'express';
import { productsController } from '../../controllers/products-controller.js';
import { productController } from '../../controllers/product-controller.js';
import { productStockController } from '../../controllers/product-stock-controller.js';
import { productFeaturedController } from '../../controllers/product-featured-controller.js';
import { productDiscountController } from '../../controllers/product-discount-controller.js';

const router = express.Router();

router.get('/products', productsController);
router.get('/products/:sku', productController);
router.patch('/products/stock', productStockController);
router.patch('/products/:sku/featured', productFeaturedController);
router.patch('/products/:sku/discount', productDiscountController);

export default router;

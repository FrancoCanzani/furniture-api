import express from 'express';
import { productsController } from '../../controllers/products-controller';
import { productController } from '../../controllers/product-controller';
import { productStockController } from '../../controllers/product-stock-controller';
import { productFeaturedController } from '../../controllers/product-featured-controller';

const router = express.Router();

router.get('/products', productsController);
router.get('/products/:sku', productController);
router.patch('/products/stock', productStockController);
router.patch('/products/:sku/featured', productFeaturedController);

export default router;

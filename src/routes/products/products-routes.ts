import express from 'express';
import { productsController } from '../../controllers/products-controller';
import { productController } from '../../controllers/product-controller';
import inventoryRoutes from './inventory/products-inventory-routes';

const router = express.Router();

router.get('/products', productsController);
router.get('/products/:sku', productController);
router.use('/products', inventoryRoutes);

export default router;

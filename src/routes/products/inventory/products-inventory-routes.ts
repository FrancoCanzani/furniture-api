import express from 'express';
import { productStockController } from '../../../controllers/product-stock-controller';

const router = express.Router();

router.patch('/stock', productStockController);

export default router;

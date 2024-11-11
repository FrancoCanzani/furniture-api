import express from 'express';
import productRoutes from './product-routes.js';

const router = express.Router();

router.use('/products', productRoutes);

export default router;

import express, { Request, Response } from 'express';
import getProduct from '../../services/product-service';
import { productsController } from '../../controllers/product-controllers';

const router = express.Router();

router.get('/products', productsController);

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProduct(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Failed to get product' });
  }
});

export default router;

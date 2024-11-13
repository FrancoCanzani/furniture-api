import { Request, Response } from 'express';
import getProduct from '../services/product-service';
import { productUUIDSchema } from '../lib/validations';

export const productController = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;

    // Validate query parameter
    const result = productUUIDSchema.safeParse(sku);

    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.issues,
      });
    }

    const product = await getProduct(sku);

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
};

import express, { Request, Response } from 'express';
import supabase from '../../../lib/supabase';
import { updateProductStockSchema } from '../../../lib/validations';

const router = express.Router();

router.patch('/stock', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = updateProductStockSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: validationResult.error.format(),
      });
    }

    const { updates } = validationResult.data;

    // Process all updates
    const results = await Promise.all(
      updates.map(async (update) => {
        // Get current stock
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('sku', update.productSku)
          .single();

        if (fetchError || !products) {
          return {
            sku: update.productSku,
            success: false,
            error: 'Product not found',
          };
        }

        const newStock = products.stock + update.quantity;

        // Check for negative stock
        if (newStock < 0) {
          return {
            sku: update.productSku,
            success: false,
            error: 'Stock cannot be negative',
          };
        }

        // Update stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('sku', update.productSku);

        if (updateError) {
          return {
            sku: update.productSku,
            success: false,
            error: 'Failed to update stock',
          };
        }

        return {
          sku: update.productSku,
          success: true,
          newStock,
        };
      })
    );

    // Check if any updates failed
    const hasErrors = results.some((result) => !result.success);

    if (hasErrors) {
      return res.status(400).json({
        error: 'Some updates failed',
        results,
      });
    }

    return res.status(200).json({
      message: 'Stock updated successfully',
      results,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;

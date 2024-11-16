import { Request, Response } from 'express';
import { productUUIDSchema } from '../lib/validations';
import supabase from '../lib/supabase';
import { handleSupabaseError } from '../lib/helpers/handle-supabase-error';

export const productController = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;

    // Validate query parameter
    const result = productUUIDSchema.safeParse(sku);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: result.error.issues,
      });
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Unexpected error:', error);

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
};

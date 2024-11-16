import { Request, Response } from 'express';
import supabase from '../lib/supabase.js';
import { productUUIDSchema } from '../lib/validations.js';
import { handleSupabaseError } from '../lib/helpers/handle-supabase-error.js';

export const productFeaturedController = async (
  req: Request,
  res: Response
) => {
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

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('featured')
      .eq('sku', sku)
      .single();

    if (fetchError) {
      handleSupabaseError(fetchError);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data, error } = await supabase
      .from('products')
      .update({ featured: !product.featured })
      .eq('sku', sku)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

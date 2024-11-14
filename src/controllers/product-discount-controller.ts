import { Request, Response } from 'express';
import supabase from '../lib/supabase';
import { productUUIDSchema } from '../lib/validations';
import { discountQuerySchema } from '../lib/validations';

export const productDiscountController = async (
  req: Request,
  res: Response
) => {
  try {
    const { sku } = req.params;

    const queryResult = discountQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: queryResult.error.errors,
      });
    }

    const { discountPercentage, discountPrice } = queryResult.data;

    const skuResult = productUUIDSchema.safeParse(sku);
    if (!skuResult.success) {
      return res.status(400).json({
        error: 'Invalid SKU format',
        details: skuResult.error.errors,
      });
    }

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('price')
      .eq('sku', skuResult.data)
      .single();

    if (fetchError) throw fetchError;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let updateData = {};

    if (discountPrice) {
      const newDiscountPrice = Number(discountPrice);
      if (newDiscountPrice >= product.price) {
        return res.status(400).json({
          error: 'Discount price must be less than the original price',
        });
      }
      updateData = { discount_price: newDiscountPrice };
    } else if (discountPercentage) {
      const percentage = Number(discountPercentage);
      const discountPrice = product.price * (1 - percentage / 100);
      updateData = { discount_price: Number(discountPrice.toFixed(2)) };
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('sku', skuResult.data)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

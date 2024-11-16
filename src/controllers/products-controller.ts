import { productQuerySchema } from '../lib/validations.js';
import { Request, Response } from 'express';
import supabase from '../lib/supabase.js';

export const productsController = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const result = productQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.issues,
      });
    }

    const {
      limit,
      name,
      category,
      wood_type,
      finish,
      max_price,
      min_price,
      max_stock,
      min_stock,
      status,
      featured,
    } = result.data;

    let query = supabase.from('products').select('*');

    // Apply filters
    if (limit) {
      query = query.limit(limit);
    }

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (wood_type) {
      query = query.eq('wood_type', wood_type);
    }

    if (finish) {
      query = query.eq('finish', finish);
    }

    if (min_price) {
      query = query.gte('price', min_price);
    }

    if (max_price) {
      query = query.lte('price', max_price);
    }

    if (min_stock) {
      query = query.gte('stock', min_stock);
    }

    if (max_stock) {
      query = query.lte('stock', max_stock);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({
        error: 'Failed to fetch products',
        details: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'No products found matching the criteria',
      });
    }

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

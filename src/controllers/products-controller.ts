import { productQuerySchema } from '../lib/validations.js';
import { Request, Response } from 'express';
import supabase from '../lib/supabase.js';

export const productsController = async (req: Request, res: Response) => {
  try {
    const result = productQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.issues,
      });
    }

    const {
      limit = 10,
      offset = 0,
      sort = 'newest',
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

    let query = supabase.from('products').select('*', { count: 'exact' });

    //  filters
    if (name) {
      const searchTerm = name.trim().toLowerCase();
      const singularTerm = searchTerm.endsWith('s')
        ? searchTerm.slice(0, -1)
        : searchTerm;

      query = query.or(
        `name.ilike.%${searchTerm}%,category.ilike.%${singularTerm}%`
      );
    }

    if (category) query = query.eq('category', category);
    if (wood_type) query = query.eq('wood_type', wood_type);
    if (finish) query = query.eq('finish', finish);
    if (min_price) query = query.gte('price', min_price);
    if (max_price) query = query.lte('price', max_price);
    if (min_stock) query = query.gte('stock', min_stock);
    if (max_stock) query = query.lte('stock', max_stock);
    if (status) query = query.eq('status', status);
    if (featured !== undefined) query = query.eq('featured', featured);

    //  sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('name', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('name', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    //  pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({
        error: 'Failed to fetch products',
        details: error.message,
      });
    }

    return res.json({
      success: true,
      count: count ?? 0,
      data: data ?? [],
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

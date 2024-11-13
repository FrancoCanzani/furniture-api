import { z } from 'zod';

export const productQuerySchema = z.object({
  // Pagination
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .pipe(z.number().min(1).max(100)),

  // Search
  name: z.string().optional(),

  // Filters
  category: z
    .enum([
      'sofa',
      'chair',
      'stool',
      'table',
      'desk',
      'kitchen',
      'vanitory',
      'matress',
      'mirror',
      'wardrove',
      'lamp',
      'tv table',
      'garden',
    ])
    .optional(),

  finish: z.enum(['dark', 'medium', 'light', 'natural']).optional(),

  wood_type: z
    .enum([
      'walnut',
      'maple',
      'oak',
      'pine',
      'eucalyptus',
      'bamboo',
      'teak',
      'cedar',
    ])
    .optional(),

  // Price range
  min_price: z.coerce.number().nonnegative().optional(),

  max_price: z.coerce.number().nonnegative().optional(),

  // Stock range
  min_stock: z.coerce.number().nonnegative().optional(),

  max_stock: z.coerce.number().nonnegative().optional(),

  // Boolean filters
  featured: z.coerce.boolean().optional(),

  status: z.enum(['active', 'inactive']).optional(),
});

export const productUUIDSchema = z.string().uuid({ message: 'Invalid UUID' });

export const updateProductStockSchema = z.object({
  updates: z.array(
    z.object({
      productSku: z.string().min(1, 'Product SKU is required'),
      quantity: z.number().int('Quantity must be a whole number'),
    })
  ),
});

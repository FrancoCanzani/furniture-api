export interface ImageAPIResponse {
  seed: number;
  cost: number;
  image: string; // Base64 string
}

interface Dimensions {
  depth: number;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  wood_type: string;
  finish: string;
  dimensions: Dimensions;
  price: number;
  weight: number;
  image_path: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  featured: boolean;
  discount_price?: number;
  tags?: string[] | null;
}

import { Product } from '../lib/types';
import supabase from '../lib/supabase';

export default async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return data as Product;
  } catch (error) {
    console.error('Error in getProduct service:', error);
    throw error;
  }
}

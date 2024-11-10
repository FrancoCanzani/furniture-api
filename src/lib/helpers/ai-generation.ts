import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { ImageAPIResponse } from '../types.js';
import { createClient } from '@supabase/supabase-js';
import { getRandomInt } from './get-random-int.js';
import { compressImage } from './compress-image.js';

const supabase = createClient(
  'https://wvxxlssoccbctxspmtyy.supabase.co',
  `${process.env.PUBLIC_ANON_KEY}`
);

const model = openai('gpt-4o-mini');

export const FurnitureSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['lamp']),
  description: z.string().min(10).max(600),
  woodType: z.enum([
    'eucalyptus',
    'pine',
    'maple',
    'walnut',
    'cherry',
    'oak',
    'bamboo',
    'teak',
    'cedar',
  ]),
  finish: z.enum(['natural', 'light', 'medium', 'dark']),
  dimensions: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    depth: z.number().positive(),
  }),
  price: z.number().positive(),
  weight: z.number().positive(),
});

let products = ['lamp'];

let toShift = products.pop();
products.pop();
if (toShift) {
  products.unshift(toShift);
}

async function generateFurniture() {
  const { object: product } = await generateObject({
    model: model,
    schema: FurnitureSchema,
    prompt: `Generate random furniture specs for an ecommerce api. Choose randomly between different categories ${products} Make sure to vary the selection.`,
    seed: undefined,
    temperature: 1.0,
  });

  const url = 'https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.GETIMG_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'stable-diffusion-xl-v1-0',
      prompt: `Single ${product.woodType} ${product.name} ${product.description} in a minimalist studio setting, photographed from 3/4 angle, clear full view, light grey background. Only show a ${product.category}, nothing else. Product photography, 8k quality`,
      negative_prompt: `interior, room, decoration, plants, accessories, multiple pieces, tableware, dining set, macro, closeup, other furniture`,
      prompt_2: `Single ${product.woodType} ${product.name} ${product.description} in a minimalist studio setting, photographed from 3/4 angle, clear full view, light grey background. Only show a ${product.category}, nothing else. Product photography, 8k quality`,
      negative_prompt_2: `interior, room, decoration, plants, accessories, multiple pieces, tableware, dining set, macro, closeup, other furniture`,
    }),
  };

  const res = await fetch(url, options);
  const img = (await res.json()) as ImageAPIResponse;

  const buffer = Buffer.from(img.image, 'base64');
  const compressedBuffer = await compressImage(buffer);
  const fileName = `public/${uuidv4()}.jpeg`;

  const uploadResult = await supabase.storage
    .from('products')
    .upload(fileName, compressedBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/jpeg',
    });

  if (uploadResult.error) {
    console.error('Upload error:', uploadResult.error);
    throw uploadResult.error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('products').getPublicUrl(fileName);

  const random = getRandomInt(1, 25);

  const { data, error } = await supabase.from('products').insert({
    name: product.name,
    category: product.category,
    description: product.description,
    wood_type: product.woodType,
    finish: product.finish,
    dimensions: product.dimensions,
    price: product.price,
    weight: product.weight,
    image_path: publicUrl,
    sku: uuidv4(),
    discount_price: Math.floor(product.price - (product.price * random) / 100),
  });

  console.log(product.name);
}

// Loop to call the function 50 times
for (let i = 0; i < 500; i++) {
  await generateFurniture();
}

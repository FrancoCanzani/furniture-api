import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { ImageAPIResponse } from '../types.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wvxxlssoccbctxspmtyy.supabase.co',
  `${process.env.PUBLIC_ANON_KEY}`
);

const model = openai('gpt-4o-mini');

export const FurnitureSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['chair', 'table', 'bed', 'shelf', 'desk']),
  description: z.string().min(10).max(500),
  woodType: z.enum(['oak', 'pine', 'maple', 'walnut', 'cherry']),
  finish: z.enum(['natural', 'light', 'medium', 'dark']),
  dimensions: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    depth: z.number().positive(),
  }),
  price: z.number().positive(),
  weight: z.number().positive(),
});

const seed = Math.floor(Math.random() * 1000000);

const { object } = await generateObject({
  model: model,
  schema: FurnitureSchema,
  prompt:
    'Generate random furniture specs for an ecommerce api. Choose randomly between different categories (chair, table, bed, shelf, desk). Make sure to vary the selection.',
  seed: seed,
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
    prompt: `Single ${object.woodType} ${object.category} in a minimalist studio setting, photographed from 3/4 angle, clear full view, light grey background. Only show a ${object.category}, nothing else. Product photography, 8k quality`,
    negative_prompt: `interior, room, decoration, plants, accessories, multiple pieces, tableware, dining set, macro, closeup, ${
      object.category === 'table' ? '' : 'table, '
    }other furniture`,
    prompt_2: `Single ${object.woodType} ${object.category} in a minimalist studio setting, photographed from 3/4 angle, clear full view, light grey background. Only show a ${object.category}, nothing else. Product photography, 8k quality`,
    negative_prompt_2: `interior, room, decoration, plants, accessories, multiple pieces, tableware, dining set, macro, closeup, ${
      object.category === 'table' ? '' : 'table, '
    }other furniture`,
  }),
};

const res = await fetch(url, options);
const img = (await res.json()) as ImageAPIResponse;

const buffer = Buffer.from(img.image, 'base64');

const { data, error } = await supabase.storage
  .from('products')
  .upload(`public/${uuidv4()}.jpeg`, buffer, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/jpeg',
  });

console.log(data);
console.log(error);

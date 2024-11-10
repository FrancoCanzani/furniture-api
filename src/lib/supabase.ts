import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  'https://wvxxlssoccbctxspmtyy.supabase.co',
  `${process.env.PUBLIC_ANON_KEY}`
);

export default supabase;

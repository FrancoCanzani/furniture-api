import { PostgrestError } from '@supabase/supabase-js';

export const handleSupabaseError = (error: PostgrestError) => {
  console.error('Supabase error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  return {
    status: 500,
    body: {
      success: false,
      error: 'Database error occurred',
    },
  };
};

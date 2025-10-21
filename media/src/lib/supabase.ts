import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CodeAnalysis {
  id: string;
  user_id: string;
  code_content: string;
  language: string;
  created_at: string;
  total_errors: number;
  bracket_errors: number;
  comma_errors: number;
  indentation_errors: number;
  case_spelling_errors: number;
  colon_errors: number;
  reversed_word_errors: number;
  recommendations: string;
}

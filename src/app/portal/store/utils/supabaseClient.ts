import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing!");
  }


// Client-side client (uses anon key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
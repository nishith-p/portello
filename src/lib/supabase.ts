import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Server-side client (uses service role key)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client (uses anon key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
// src/utils/supabase.ts

import { createClient } from '@supabase/supabase-js';

// 1. URLs und Keys aus dem .env File laden
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL; 
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// 2. Prüfen, ob die Variablen vorhanden sind (guter Clean Code Stil)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables not set. Check your .env file.");
}

// 3. Supabase Client erstellen und exportieren
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis (fichier .env ou variables de build).'
  );
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'missing-anon-key'
);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingInfo {
  starting_price?: string;
  price_range?: string;
  note?: string;
  free_quote?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string;
  detailed_content?: string;
  pricing_info?: PricingInfo;
  features?: string[];
  benefits?: string[];
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
  read?: boolean;
}

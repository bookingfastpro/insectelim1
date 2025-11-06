/*
  # INSECTELIM Database Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, article title)
      - `slug` (text, URL-friendly identifier, unique)
      - `excerpt` (text, short description)
      - `content` (text, full article content)
      - `category` (text, article category)
      - `image_url` (text, featured image URL)
      - `published` (boolean, publication status)
      - `created_at` (timestamptz, creation date)
      - `updated_at` (timestamptz, last update date)
    
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, setting identifier, unique)
      - `value` (jsonb, setting value)
      - `updated_at` (timestamptz, last update date)
    
    - `services`
      - `id` (uuid, primary key)
      - `title` (text, service name)
      - `description` (text, service description)
      - `icon` (text, lucide icon name)
      - `image_url` (text, service image URL)
      - `order` (integer, display order)
      - `active` (boolean, visibility status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, sender name)
      - `email` (text, sender email)
      - `phone` (text, sender phone)
      - `message` (text, message content)
      - `created_at` (timestamptz)
      - `read` (boolean, read status)

  2. Security
    - Enable RLS on all tables
    - Blog posts: public read access, admin write access
    - Site settings: public read access, admin write access
    - Services: public read access, admin write access
    - Contact messages: public insert access, admin read access
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'prévention',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'bug',
  image_url text,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default services
INSERT INTO services (title, description, icon, "order") VALUES
  ('Désinsectisation', 'Élimination efficace des cafards, fourmis, moustiques, punaises de lit et autres insectes nuisibles avec des traitements professionnels et respectueux de l''environnement.', 'bug', 1),
  ('Dératisation', 'Lutte contre les rats et souris avec des méthodes sûres et durables. Protection complète de votre habitat et de vos locaux professionnels.', 'rat', 2),
  ('Désinfection', 'Traitement antibactérien et antiviral pour assurer un environnement sain et sécurisé. Idéal pour les établissements recevant du public.', 'shield-check', 3),
  ('Traitement Termites', 'Diagnostic et traitement des infestations de termites et capricornes. Protection durable du bois et des structures.', 'home', 4),
  ('Dépigeonnage', 'Solutions professionnelles pour éloigner les pigeons et protéger vos bâtiments des nuisances et dégradations.', 'bird', 5)
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_info', '{"phone": "04 95 XX XX XX", "email": "contact@insectelim.fr", "address": "Porto-Vecchio, Corse-du-Sud", "hours": "Lundi - Samedi : 8h - 19h"}'::jsonb),
  ('hero_section', '{"title": "INSECTELIM — Techniciens experts en lutte anti-nuisibles à Porto-Vecchio", "subtitle": "Protégez votre maison et votre entreprise avec des traitements efficaces, écologiques et certifiés."}'::jsonb),
  ('why_choose_us', '{"items": ["Interventions rapides partout en Corse-du-Sud", "Produits respectueux de l''environnement", "Techniciens certifiés et agréés", "Service professionnel et discret"]}'::jsonb)
ON CONFLICT DO NOTHING;
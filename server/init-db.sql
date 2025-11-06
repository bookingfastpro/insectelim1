-- Script d'initialisation de la base de données INSECTELIM
-- Exécutez ce fichier avec: psql "votre-database-url" -f init-db.sql

-- Active l'extension pour le cryptage des mots de passe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Table des services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  detailed_content TEXT,
  pricing_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'prévention',
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer le premier utilisateur admin
-- Mot de passe: admin123 (CHANGEZ-LE APRÈS LA PREMIÈRE CONNEXION!)
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@insectelim.fr', crypt('admin123', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

-- Insérer des services par défaut
INSERT INTO services (title, description, icon, detailed_content, pricing_info) VALUES
  (
    'Dératisation',
    'Élimination complète et durable des rats et souris avec des méthodes professionnelles.',
    'Rat',
    'Notre service de dératisation inclut une inspection complète, un traitement adapté et un suivi régulier.',
    '{"starting_price": "150€", "details": "À partir de 150€ selon la surface"}'
  ),
  (
    'Désinsectisation',
    'Traitement efficace contre tous types d''insectes nuisibles.',
    'Bug',
    'Nous traitons tous les types d''insectes: cafards, punaises de lit, fourmis, guêpes, etc.',
    '{"starting_price": "120€", "details": "À partir de 120€ selon l''infestation"}'
  ),
  (
    'Désinfection',
    'Désinfection professionnelle de vos locaux pour un environnement sain.',
    'Shield',
    'Désinfection complète avec des produits professionnels certifiés.',
    '{"starting_price": "100€", "details": "À partir de 100€ selon la surface"}'
  )
ON CONFLICT DO NOTHING;

-- Insérer un article de blog par défaut
INSERT INTO blog_posts (title, slug, excerpt, content, category, image_url, published) VALUES
  (
    'Comment prévenir les infestations de nuisibles',
    'comment-prevenir-infestations',
    'Découvrez nos conseils d''experts pour protéger votre maison contre les nuisibles.',
    'La prévention est la clé pour éviter les infestations. Voici nos meilleurs conseils...',
    'prévention',
    'https://images.pexels.com/photos/4098778/pexels-photo-4098778.jpeg',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insérer les paramètres par défaut du site
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', '"Experts en 3D: Dératisation, Désinsectisation, Désinfection"'),
  ('hero_subtitle', '"Protection professionnelle contre les nuisibles en Guadeloupe"'),
  ('hero_logo_url', '"https://images.pexels.com/photos/4098778/pexels-photo-4098778.jpeg"'),
  ('contact_email', '"contact@insectelim.fr"'),
  ('contact_phone', '"0590 XX XX XX"'),
  ('contact_address', '"Guadeloupe, France"')
ON CONFLICT (key) DO NOTHING;

-- Afficher un message de succès
DO $$
BEGIN
  RAISE NOTICE '✅ Base de données initialisée avec succès!';
  RAISE NOTICE '👤 Email admin: admin@insectelim.fr';
  RAISE NOTICE '🔑 Mot de passe: admin123';
  RAISE NOTICE '⚠️  CHANGEZ LE MOT DE PASSE IMMÉDIATEMENT APRÈS CONNEXION!';
END $$;

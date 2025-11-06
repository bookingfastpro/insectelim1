/*
  # Ajout des colonnes manquantes pour les services

  1. Nouvelles colonnes
    - `active` (boolean) : Indique si le service est visible publiquement
    - `order` (integer) : Ordre d'affichage des services
    - `image_url` (text) : URL de l'image personnalisée
    - `slug` (text) : URL-friendly pour les pages de détail
    - `features` (jsonb) : Liste des prestations du service
    - `benefits` (jsonb) : Liste des avantages du service

  2. Modifications
    - `pricing_info` devient JSONB au lieu de TEXT pour stocker des objets JSON
*/

-- Ajouter les nouvelles colonnes
ALTER TABLE services
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;

-- Modifier pricing_info pour être JSONB
DO $$
BEGIN
  -- Vérifier si la colonne existe et est de type TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services'
    AND column_name = 'pricing_info'
    AND data_type = 'text'
  ) THEN
    -- Supprimer l'ancienne colonne TEXT
    ALTER TABLE services DROP COLUMN pricing_info;
  END IF;

  -- Ajouter la nouvelle colonne JSONB si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services'
    AND column_name = 'pricing_info'
  ) THEN
    ALTER TABLE services ADD COLUMN pricing_info JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Mettre à jour les valeurs order pour les services existants
UPDATE services
SET "order" = sub.row_num - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM services
) sub
WHERE services.id = sub.id;

-- Créer un index sur slug pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Créer un index sur order pour le tri
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- Créer un index sur active pour filtrer les services actifs
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Colonnes ajoutées avec succès à la table services';
END $$;

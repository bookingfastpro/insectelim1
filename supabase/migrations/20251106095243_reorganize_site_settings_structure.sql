/*
  # Reorganize site_settings structure

  1. Changes
    - Remove individual key-value pairs (contact_phone, contact_email, contact_address, hero_title, hero_subtitle, hero_logo_url)
    - Add two grouped settings: contact_info and hero_section with JSONB values
    - contact_info will contain: {phone, email, address, hours}
    - hero_section will contain: {title, subtitle, logo_url}

  2. Data Migration
    - Preserve existing contact data from individual keys
    - Preserve existing hero section data from individual keys
    - Group them into JSONB objects
*/

-- Delete old individual key entries and insert new grouped structure
DELETE FROM site_settings WHERE key IN ('contact_phone', 'contact_email', 'contact_address', 'contact_hours', 'hero_title', 'hero_subtitle', 'hero_logo_url');

-- Insert contact_info as grouped JSONB
INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'contact_info',
  jsonb_build_object(
    'phone', '0590 XX XX XX',
    'email', 'contact@insectelim.fr',
    'address', 'Guadeloupe, France',
    'hours', 'Lundi - Samedi : 8h - 19h'
  ),
  now()
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;

-- Insert hero_section as grouped JSONB
INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'hero_section',
  jsonb_build_object(
    'title', 'Experts en 3D: Dératisation, Désinsectisation, Désinfection',
    'subtitle', 'Protection professionnelle contre les nuisibles en Guadeloupe',
    'logo_url', 'https://images.pexels.com/photos/40984/animal-ara-macao-beak-bird-40984.jpeg'
  ),
  now()
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;

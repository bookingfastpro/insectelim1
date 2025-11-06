-- =====================================================
-- SCRIPT POUR RÉCUPÉRER VOS VRAIES DONNÉES
-- =====================================================
-- Exécutez ces requêtes dans Supabase Studio pour
-- obtenir vos données réelles à copier dans export-database.sql
-- =====================================================

-- =====================================================
-- 1. SERVICES
-- =====================================================
-- Copiez le résultat au format JSON ou CSV

SELECT
  id,
  title,
  description,
  icon,
  image_url,
  "order",
  active,
  slug,
  detailed_content,
  pricing_info,
  features,
  benefits,
  created_at,
  updated_at
FROM services
ORDER BY "order";

-- Si vous voulez le résultat au format INSERT :
-- (Copiez ce bloc et remplacez dans export-database.sql)

SELECT
  'INSERT INTO services (id, title, description, icon, image_url, "order", active, slug, detailed_content, pricing_info, features, benefits, created_at, updated_at) VALUES' ||
  E'\n  (' ||
  '''' || id::text || '''::uuid, ' ||
  '''' || replace(title, '''', '''''') || ''', ' ||
  '''' || replace(description, '''', '''''') || ''', ' ||
  '''' || icon || ''', ' ||
  COALESCE('''' || replace(image_url, '''', '''''') || '''', 'NULL') || ', ' ||
  "order"::text || ', ' ||
  active::text || ', ' ||
  COALESCE('''' || slug || '''', 'NULL') || ', ' ||
  COALESCE('''' || replace(detailed_content, '''', '''''') || '''', 'NULL') || ', ' ||
  COALESCE('''' || pricing_info::text || '''::jsonb', 'NULL') || ', ' ||
  COALESCE('''' || features::text || '''::jsonb', 'NULL') || ', ' ||
  COALESCE('''' || benefits::text || '''::jsonb', 'NULL') || ', ' ||
  '''' || created_at::text || '''::timestamptz, ' ||
  '''' || updated_at::text || '''::timestamptz' ||
  '),'
FROM services
ORDER BY "order";

-- =====================================================
-- 2. BLOG POSTS
-- =====================================================

SELECT
  id,
  title,
  slug,
  excerpt,
  content,
  category,
  image_url,
  published,
  created_at,
  updated_at
FROM blog_posts
ORDER BY created_at DESC;

-- Format INSERT pour blog_posts :

SELECT
  'INSERT INTO blog_posts (id, title, slug, excerpt, content, category, image_url, published, created_at, updated_at) VALUES' ||
  E'\n  (' ||
  '''' || id::text || '''::uuid, ' ||
  '''' || replace(title, '''', '''''') || ''', ' ||
  '''' || slug || ''', ' ||
  '''' || replace(excerpt, '''', '''''') || ''', ' ||
  '''' || replace(content, '''', '''''') || ''', ' ||
  '''' || category || ''', ' ||
  COALESCE('''' || image_url || '''', 'NULL') || ', ' ||
  published::text || ', ' ||
  '''' || created_at::text || '''::timestamptz, ' ||
  '''' || updated_at::text || '''::timestamptz' ||
  '),'
FROM blog_posts
ORDER BY created_at DESC;

-- =====================================================
-- 3. SITE SETTINGS
-- =====================================================

SELECT
  id,
  key,
  value,
  updated_at
FROM site_settings
ORDER BY key;

-- Format INSERT pour site_settings :

SELECT
  'INSERT INTO site_settings (id, key, value, updated_at) VALUES' ||
  E'\n  (' ||
  '''' || id::text || '''::uuid, ' ||
  '''' || key || ''', ' ||
  '''' || value::text || '''::jsonb, ' ||
  '''' || updated_at::text || '''::timestamptz' ||
  '),'
FROM site_settings
ORDER BY key;

-- =====================================================
-- 4. CONTACT MESSAGES (Optionnel)
-- =====================================================
-- ATTENTION : Contient des données personnelles !

SELECT
  id,
  name,
  email,
  phone,
  message,
  created_at,
  read
FROM contact_messages
ORDER BY created_at DESC
LIMIT 20; -- Limitez si vous avez beaucoup de messages

-- Format INSERT pour contact_messages :

SELECT
  'INSERT INTO contact_messages (id, name, email, phone, message, created_at, read) VALUES' ||
  E'\n  (' ||
  '''' || id::text || '''::uuid, ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || email || ''', ' ||
  COALESCE('''' || phone || '''', 'NULL') || ', ' ||
  '''' || replace(message, '''', '''''') || ''', ' ||
  '''' || created_at::text || '''::timestamptz, ' ||
  read::text ||
  '),'
FROM contact_messages
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- 5. VÉRIFICATION DES DONNÉES
-- =====================================================

-- Comptage par table :
SELECT
  'services' AS table_name,
  COUNT(*) AS count,
  COUNT(CASE WHEN active = true THEN 1 END) AS active_count
FROM services
UNION ALL
SELECT
  'blog_posts',
  COUNT(*),
  COUNT(CASE WHEN published = true THEN 1 END)
FROM blog_posts
UNION ALL
SELECT
  'site_settings',
  COUNT(*),
  NULL
FROM site_settings
UNION ALL
SELECT
  'contact_messages',
  COUNT(*),
  COUNT(CASE WHEN read = true THEN 1 END)
FROM contact_messages;

-- =====================================================
-- 6. EXPORT JSON COMPLET
-- =====================================================
-- Pour un export JSON complet de toutes les tables

SELECT jsonb_build_object(
  'services', (SELECT jsonb_agg(to_jsonb(s.*)) FROM services s ORDER BY s."order"),
  'blog_posts', (SELECT jsonb_agg(to_jsonb(b.*)) FROM blog_posts b ORDER BY b.created_at DESC),
  'site_settings', (SELECT jsonb_agg(to_jsonb(st.*)) FROM site_settings st),
  'contact_messages', (SELECT jsonb_agg(to_jsonb(cm.*)) FROM contact_messages cm ORDER BY cm.created_at DESC LIMIT 20)
) AS complete_export;

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
-- 1. Exécutez chaque section dans Supabase Studio
-- 2. Copiez les résultats (JSON ou format INSERT)
-- 3. Remplacez les données d'exemple dans export-database.sql
-- 4. Importez dans votre nouvelle base de données
-- =====================================================

-- =====================================================
-- EXPORT COMPLET DE LA BASE DE DONNÉES INSECTELIM
-- Date: 2025-11-06
-- =====================================================
-- Ce fichier contient toutes les données de votre base
-- Pour l'importer dans une nouvelle base :
-- psql "postgresql://user:pass@host:port/db" -f export-database.sql
-- =====================================================

-- Désactiver temporairement les triggers et contraintes
SET session_replication_role = 'replica';

-- =====================================================
-- EXPORT TABLE: services
-- =====================================================

-- Vider la table services avant d'insérer
TRUNCATE TABLE services CASCADE;

-- Exporter les données de services
-- Remplacez cette section par vos données réelles
-- Pour obtenir vos données, exécutez dans Supabase Studio :
-- SELECT * FROM services ORDER BY "order";

-- Exemple de structure (à remplacer par vos vraies données) :
INSERT INTO services (id, title, description, icon, image_url, "order", active, slug, detailed_content, pricing_info, features, benefits, created_at, updated_at)
VALUES
  -- Service 1: Désinsectisation
  (
    gen_random_uuid(),
    'Désinsectisation',
    'Élimination efficace des cafards, fourmis, moustiques, punaises de lit et autres insectes nuisibles avec des traitements professionnels et respectueux de l''environnement.',
    'bug',
    NULL, -- Remplacez par votre image_url si vous en avez
    0,
    true,
    'desinsectisation',
    '# Désinsectisation Professionnelle

## Traitement des Insectes Nuisibles

Nous intervenons rapidement pour éliminer tous types d''insectes : cafards, fourmis, punaises de lit, moustiques, guêpes et frelons.

### Nos Méthodes

- Traitement par pulvérisation
- Fumigation et nébulisation
- Pièges et appâts sécurisés
- Traitement thermique pour punaises de lit

### Zones d''Intervention

Nous intervenons dans toute la Corse-du-Sud pour les particuliers et professionnels.',
    '{"starting_price": "À partir de 89€", "price_range": "89€ - 350€", "note": "Tarif selon type d''insecte et surface à traiter", "free_quote": true}'::jsonb,
    '["Traitement punaises de lit", "Élimination cafards et blattes", "Destruction nids de guêpes", "Traitement fourmis", "Éradication moustiques"]'::jsonb,
    '["Intervention rapide sous 24h", "Garantie de résultat", "Produits certifiés sans danger", "Techniciens certifiés", "Devis gratuit"]'::jsonb,
    now(),
    now()
  ),

  -- Service 2: Dératisation
  (
    gen_random_uuid(),
    'Dératisation',
    'Lutte contre les rats et souris avec des méthodes sûres et durables. Protection complète de votre habitat et de vos locaux professionnels.',
    'rat',
    NULL,
    1,
    true,
    'deratisation',
    '# Dératisation Professionnelle

## Élimination Rats et Souris

Protection efficace contre les rongeurs avec des solutions adaptées à votre situation.

### Nos Techniques

- Pose de pièges mécaniques
- Appâts rodenticides sécurisés
- Bouchage des points d''entrée
- Suivi et contrôle régulier

### Prévention

Nous vous conseillons sur les mesures préventives pour éviter toute nouvelle intrusion.',
    '{"starting_price": "À partir de 120€", "price_range": "120€ - 450€", "note": "Selon l''ampleur de l''infestation", "free_quote": true}'::jsonb,
    '["Dératisation complète", "Pose de pièges sécurisés", "Bouchage des accès", "Suivi post-traitement", "Conseil en prévention"]'::jsonb,
    '["Méthodes sûres et efficaces", "Intervention discrète", "Garantie de résultat", "Suivi inclus", "Devis gratuit"]'::jsonb,
    now(),
    now()
  ),

  -- Service 3: Désinfection
  (
    gen_random_uuid(),
    'Désinfection',
    'Traitement antibactérien et antiviral pour assurer un environnement sain et sécurisé. Idéal pour les établissements recevant du public.',
    'shield-check',
    NULL,
    2,
    true,
    'desinfection',
    '# Désinfection Professionnelle

## Assainissement Complet

Élimination des bactéries, virus et germes pour un environnement sain.

### Nos Services

- Désinfection complète des locaux
- Traitement des surfaces et de l''air
- Produits homologués et certifiés
- Respect des normes sanitaires

### Secteurs d''Activité

Restaurants, hôtels, bureaux, commerces, écoles, établissements médicaux.',
    '{"starting_price": "À partir de 150€", "price_range": "150€ - 600€", "note": "Selon la surface et le type d''établissement", "free_quote": true}'::jsonb,
    '["Désinfection bactéricide", "Traitement virucide", "Purification de l''air", "Traitement des surfaces", "Certification d''intervention"]'::jsonb,
    '["Produits homologués", "Normes sanitaires respectées", "Intervention rapide", "Certificat fourni", "Devis gratuit"]'::jsonb,
    now(),
    now()
  ),

  -- Service 4: Traitement Termites
  (
    gen_random_uuid(),
    'Traitement Termites',
    'Diagnostic et traitement des infestations de termites et capricornes. Protection durable du bois et des structures.',
    'home',
    NULL,
    3,
    true,
    'traitement-termites',
    '# Traitement Anti-Termites

## Protection de vos Structures en Bois

Détection et élimination des termites et insectes xylophages.

### Notre Expertise

- Diagnostic termites obligatoire
- Traitement curatif du bois
- Traitement préventif
- Garantie décennale

### Zones à Risque

La Corse est particulièrement touchée par les termites. Un diagnostic régulier est recommandé.',
    '{"starting_price": "À partir de 200€", "price_range": "200€ - 1500€", "note": "Selon la surface et l''ampleur des dégâts", "free_quote": true}'::jsonb,
    '["Diagnostic termites", "Traitement curatif", "Traitement préventif", "Injection dans le bois", "Garantie décennale"]'::jsonb,
    '["Techniciens certifiés", "Matériel professionnel", "Garantie longue durée", "Diagnostic gratuit", "Respect des normes"]'::jsonb,
    now(),
    now()
  ),

  -- Service 5: Dépigeonnage
  (
    gen_random_uuid(),
    'Dépigeonnage',
    'Solutions professionnelles pour éloigner les pigeons et protéger vos bâtiments des nuisances et dégradations.',
    'bird',
    NULL,
    4,
    true,
    'depigeonnage',
    '# Dépigeonnage Professionnel

## Protection Anti-Pigeons

Éliminez les nuisances causées par les pigeons avec des solutions durables.

### Nos Solutions

- Pose de filets anti-pigeons
- Installation de pics dissuasifs
- Répulsifs naturels
- Nettoyage et désinfection

### Avantages

Protection efficace de vos bâtiments, balcons, toitures et structures.',
    '{"starting_price": "À partir de 180€", "price_range": "180€ - 800€", "note": "Selon la surface à protéger", "free_quote": true}'::jsonb,
    '["Pose de filets", "Installation de pics", "Répulsifs sonores", "Nettoyage fientes", "Désinfection"]'::jsonb,
    '["Solutions durables", "Installation professionnelle", "Matériel résistant", "Respect de la faune", "Devis gratuit"]'::jsonb,
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  "order" = EXCLUDED."order",
  active = EXCLUDED.active,
  slug = EXCLUDED.slug,
  detailed_content = EXCLUDED.detailed_content,
  pricing_info = EXCLUDED.pricing_info,
  features = EXCLUDED.features,
  benefits = EXCLUDED.benefits,
  updated_at = now();

-- =====================================================
-- EXPORT TABLE: blog_posts
-- =====================================================

-- Vider la table blog_posts avant d'insérer
TRUNCATE TABLE blog_posts CASCADE;

-- Exporter les données de blog_posts
-- Pour obtenir vos données, exécutez dans Supabase Studio :
-- SELECT * FROM blog_posts ORDER BY created_at DESC;

-- Exemple de structure (à remplacer par vos vraies données) :
INSERT INTO blog_posts (id, title, slug, excerpt, content, category, image_url, published, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Comment prévenir une infestation de cafards',
    'prevenir-infestation-cafards',
    'Les cafards sont des nuisibles particulièrement tenaces. Découvrez nos conseils pour éviter leur apparition dans votre maison.',
    '# Comment prévenir une infestation de cafards

Les cafards sont des insectes particulièrement résistants et prolifiques. Une fois installés, ils sont difficiles à éliminer. La prévention est donc essentielle.

## Mesures préventives

1. **Propreté rigoureuse** : Nettoyez régulièrement votre cuisine
2. **Éliminez les sources d''eau** : Réparez les fuites
3. **Stockage hermétique** : Conservez les aliments dans des contenants fermés
4. **Bouchez les fissures** : Colmatez tous les points d''entrée

## Signes d''infestation

- Présence d''excréments (petits points noirs)
- Odeur nauséabonde
- Traces de mues
- Observation nocturne

## Que faire en cas d''infestation ?

Contactez immédiatement un professionnel. Les traitements en vente libre sont souvent inefficaces contre les cafards.',
    'prévention',
    'https://images.pexels.com/photos/3714898/pexels-photo-3714898.jpeg?auto=compress&cs=tinysrgb&w=800',
    true,
    now() - interval '10 days',
    now() - interval '10 days'
  ),
  (
    gen_random_uuid(),
    'Punaises de lit : symptômes et traitement',
    'punaises-de-lit-symptomes-traitement',
    'Les punaises de lit sont un fléau en augmentation. Apprenez à les identifier et à vous en débarrasser efficacement.',
    '# Punaises de lit : symptômes et traitement

Les punaises de lit connaissent une recrudescence inquiétante ces dernières années.

## Comment les identifier ?

- Piqûres alignées sur la peau
- Petites taches noires sur les draps (excréments)
- Traces de sang sur les textiles
- Observation des insectes (5-7mm, ovales, bruns)

## Traitement professionnel

Le traitement thermique est la méthode la plus efficace :
- Chauffage de la pièce à 60°C
- Éradication complète en une séance
- Sans produits chimiques

## Prévention

- Inspectez les hébergements lors de voyages
- Lavez le linge à 60°C minimum
- Aspirez régulièrement matelas et sommiers',
    'traitement',
    'https://images.pexels.com/photos/7876673/pexels-photo-7876673.jpeg?auto=compress&cs=tinysrgb&w=800',
    true,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  (
    gen_random_uuid(),
    'Termites en Corse : un risque à ne pas négliger',
    'termites-corse-risque',
    'La Corse est particulièrement touchée par les termites. Découvrez pourquoi un diagnostic régulier est indispensable.',
    '# Termites en Corse : un risque à ne pas négliger

La Corse est classée en zone à risque pour les termites. Ces insectes xylophages peuvent causer des dégâts structurels importants.

## Pourquoi la Corse est-elle touchée ?

- Climat favorable (humidité + chaleur)
- Présence de bois ancien
- Proximité de la mer

## Le diagnostic termites

Obligatoire pour toute vente immobilière, le diagnostic permet de détecter :
- Présence de termites actifs
- Dégâts sur les structures
- Zones à risque

## Traitement préventif

Un traitement préventif du bois est recommandé :
- Injection de produits fongicides
- Barrière chimique autour des fondations
- Pièges à termites

## Garanties

Nos traitements sont garantis 10 ans.',
    'réglementation',
    'https://images.pexels.com/photos/6189578/pexels-photo-6189578.jpeg?auto=compress&cs=tinysrgb&w=800',
    true,
    now() - interval '15 days',
    now() - interval '15 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  published = EXCLUDED.published,
  updated_at = now();

-- =====================================================
-- EXPORT TABLE: site_settings
-- =====================================================

-- Vider la table site_settings avant d'insérer
TRUNCATE TABLE site_settings CASCADE;

-- Exporter les données de site_settings
-- Pour obtenir vos données, exécutez dans Supabase Studio :
-- SELECT * FROM site_settings;

INSERT INTO site_settings (id, key, value, updated_at)
VALUES
  (
    gen_random_uuid(),
    'contact_info',
    '{
      "phone": "04 95 XX XX XX",
      "email": "contact@insectelim.fr",
      "address": "Porto-Vecchio, Corse-du-Sud",
      "hours": "Lundi - Samedi : 8h - 19h"
    }'::jsonb,
    now()
  ),
  (
    gen_random_uuid(),
    'hero_section',
    '{
      "title": "INSECTELIM — Techniciens experts en lutte anti-nuisibles à Porto-Vecchio",
      "subtitle": "Protégez votre maison et votre entreprise avec des traitements efficaces, écologiques et certifiés.",
      "logo_url": ""
    }'::jsonb,
    now()
  ),
  (
    gen_random_uuid(),
    'why_choose_us',
    '{
      "items": [
        "Interventions rapides partout en Corse-du-Sud",
        "Produits respectueux de l''environnement",
        "Techniciens certifiés et agréés",
        "Service professionnel et discret"
      ]
    }'::jsonb,
    now()
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- =====================================================
-- EXPORT TABLE: contact_messages
-- =====================================================

-- NOTE: Les messages de contact ne sont généralement PAS exportés
-- car ils contiennent des données personnelles temporaires
-- Si vous souhaitez les exporter, décommentez cette section

-- TRUNCATE TABLE contact_messages CASCADE;

-- Pour obtenir vos données, exécutez dans Supabase Studio :
-- SELECT * FROM contact_messages ORDER BY created_at DESC;

-- INSERT INTO contact_messages (id, name, email, phone, message, created_at, read)
-- VALUES
--   (gen_random_uuid(), 'Nom', 'email@example.com', '06...', 'Message', now(), false);

-- =====================================================
-- Réactiver les triggers et contraintes
-- =====================================================

SET session_replication_role = 'default';

-- =====================================================
-- VÉRIFICATION DES DONNÉES IMPORTÉES
-- =====================================================

-- Afficher le nombre d'enregistrements par table
SELECT 'services' AS table_name, COUNT(*) AS count FROM services
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;

-- =====================================================
-- FIN DE L'EXPORT
-- =====================================================

/*
  # Add Service Details and Pricing

  1. Changes to services table
    - Add `slug` column for URL-friendly identifier
    - Add `detailed_content` column for full service description
    - Add `pricing_info` JSONB column for flexible pricing structure
    - Add `features` JSONB column for service features list
    - Add `benefits` JSONB column for service benefits list

  2. Notes
    - `slug` will be used for service detail pages routing
    - `pricing_info` can store different pricing tiers, starting prices, etc.
    - `features` and `benefits` arrays will enhance service detail pages
    - Uses IF NOT EXISTS to safely add columns
*/

-- Add slug column for URL routing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'slug'
  ) THEN
    ALTER TABLE services ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

-- Add detailed_content for full service description
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'detailed_content'
  ) THEN
    ALTER TABLE services ADD COLUMN detailed_content text DEFAULT '';
  END IF;
END $$;

-- Add pricing_info JSONB for flexible pricing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'pricing_info'
  ) THEN
    ALTER TABLE services ADD COLUMN pricing_info jsonb DEFAULT '{}';
  END IF;
END $$;

-- Add features array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'features'
  ) THEN
    ALTER TABLE services ADD COLUMN features jsonb DEFAULT '[]';
  END IF;
END $$;

-- Add benefits array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'benefits'
  ) THEN
    ALTER TABLE services ADD COLUMN benefits jsonb DEFAULT '[]';
  END IF;
END $$;

-- Update existing services with slugs and basic content
UPDATE services SET slug = 'desinsectisation' WHERE title = 'Désinsectisation' AND slug IS NULL;
UPDATE services SET slug = 'deratisation' WHERE title = 'Dératisation' AND slug IS NULL;
UPDATE services SET slug = 'desinfection' WHERE title = 'Désinfection' AND slug IS NULL;
UPDATE services SET slug = 'traitement-termites' WHERE title = 'Traitement Termites' AND slug IS NULL;
UPDATE services SET slug = 'depigeonnage' WHERE title = 'Dépigeonnage' AND slug IS NULL;

-- Add detailed content for Désinsectisation
UPDATE services 
SET 
  detailed_content = '# Désinsectisation Professionnelle à Porto-Vecchio

Protégez votre maison ou votre commerce des invasions d''insectes nuisibles avec nos traitements professionnels adaptés au climat méditerranéen de Porto-Vecchio.

## Nos Interventions Anti-Insectes

### Punaises de Lit
Traitement thermique et chimique pour éliminer définitivement les punaises de lit. Intervention discrète avec garantie de résultat.

### Cafards et Blattes
Application de gel professionnel et pulvérisation rémanente pour éradiquer les colonies de cafards dans votre habitat ou restaurant.

### Fourmis
Traitement des nids et zones de passage pour stopper l''invasion de fourmis. Solutions préventives et curatives.

### Moustiques et Moustique Tigre
Traitement anti-larvaire et pulvérisation adulticide pour protéger votre jardin et terrasse. Particulièrement efficace contre le moustique tigre.

### Guêpes et Frelons
Destruction de nids en toute sécurité avec équipement professionnel. Intervention rapide pour protéger votre famille.

## Notre Méthode d''Intervention

1. **Diagnostic gratuit** : Inspection complète pour identifier l''espèce et le niveau d''infestation
2. **Plan de traitement personnalisé** : Choix de la méthode adaptée (gel, pulvérisation, fumigation, traitement thermique)
3. **Application professionnelle** : Utilisation de produits certifiés par des techniciens formés
4. **Suivi et garantie** : Contrôle post-traitement et intervention complémentaire si nécessaire

## Pourquoi Choisir INSECTELIM ?

- **Techniciens certifiés** : Formation continue aux dernières techniques
- **Produits professionnels** : Biocides homologués efficaces et sécurisés
- **Intervention rapide** : Disponibilité 7j/7 sur Porto-Vecchio et Corse-du-Sud
- **Discrétion garantie** : Véhicules banalisés pour préserver votre réputation
- **Respect de l''environnement** : Solutions écologiques disponibles',
  features = '["Traitement punaises de lit", "Élimination cafards et blattes", "Destruction nids de guêpes", "Anti-moustiques et moustique tigre", "Traitement fourmis", "Désinsectisation commerces et restaurants"]',
  benefits = '["Intervention rapide sous 24h", "Garantie de résultat", "Produits certifiés sans danger", "Techniciens formés et équipés", "Devis gratuit et sans engagement", "Service 7j/7 en saison"]',
  pricing_info = '{"starting_price": "À partir de 89€", "price_range": "89€ - 350€", "note": "Tarif selon type d''insecte et surface à traiter", "free_quote": true}'
WHERE slug = 'desinsectisation';

-- Add detailed content for Dératisation
UPDATE services 
SET 
  detailed_content = '# Dératisation Professionnelle à Porto-Vecchio

Éliminez rats et souris de votre propriété avec nos solutions de dératisation efficaces et durables adaptées aux spécificités de la Corse-du-Sud.

## Protection Contre les Rongeurs

### Rats (Surmulot et Rat Noir)
Traitement complet par appâts rodenticides sécurisés et pièges mécaniques. Expertise des infestations en milieu urbain et rural.

### Souris Domestiques
Élimination rapide des souris avec suivi régulier. Solutions adaptées aux habitations, commerces et entrepôts.

## Notre Approche Professionnelle

### Inspection et Diagnostic
Identification de l''espèce, évaluation de l''infestation, localisation des points d''entrée et zones à risque.

### Traitement Adapté
- **Appâts rodenticides** : Postes sécurisés avec produits professionnels anticoagulants
- **Pièges mécaniques** : Solution écologique sans poison, idéale pour zones sensibles
- **Exclusion** : Colmatage des accès et points d''entrée

### Suivi et Prévention
Visites de contrôle régulières, renouvellement des appâts, conseils pour éviter les récidives.

## Zones d''Intervention

INSECTELIM intervient dans toute la région de Porto-Vecchio :
- Habitations et villas
- Restaurants et commerces alimentaires
- Hôtels et résidences touristiques
- Entrepôts et locaux professionnels
- Copropriétés et bâtiments collectifs

## Réglementation

La dératisation est obligatoire pour les restaurants, commerces alimentaires et établissements recevant du public. Un registre doit être tenu et présenté lors des contrôles sanitaires.

## Nos Garanties

- **Intervention d''urgence** : Disponibilité 7j/7 pour situations critiques
- **Techniciens certifiés** : Formation spécialisée en dératisation
- **Discrétion totale** : Préservation de votre image professionnelle
- **Tarifs transparents** : Devis détaillé sans frais cachés',
  features = '["Dératisation rats et souris", "Appâts rodenticides sécurisés", "Pièges mécaniques écologiques", "Colmatage des accès", "Contrats de maintenance", "Registre de dératisation"]',
  benefits = '["Techniciens formés et certifiés", "Intervention rapide 7j/7", "Méthodes écologiques disponibles", "Suivi régulier inclus", "Conformité réglementaire", "Garantie de résultat"]',
  pricing_info = '{"starting_price": "À partir de 120€", "price_range": "120€ - 450€", "note": "Tarif selon surface et niveau d''infestation", "free_quote": true}'
WHERE slug = 'deratisation';

-- Add detailed content for Désinfection
UPDATE services 
SET 
  detailed_content = '# Désinfection Professionnelle à Porto-Vecchio

Assurez un environnement sain et sécurisé avec nos services de désinfection professionnelle adaptés aux établissements recevant du public et aux habitations.

## Services de Désinfection

### Désinfection Antibactérienne
Élimination des bactéries pathogènes (staphylocoques, salmonelles, E.coli) dans tous types de locaux.

### Désinfection Antivirale
Traitement efficace contre les virus (coronavirus, grippe, gastro-entérites) avec produits virucides certifiés.

### Désinfection après Infestation
Nettoyage et désinfection complète après élimination de nuisibles (rongeurs, cafards, punaises de lit).

### Désinfection COVID-19
Protocole spécifique pour décontamination suite à cas positif ou en prévention.

## Nos Méthodes

### Pulvérisation Professionnelle
Application de désinfectants professionnels sur toutes les surfaces avec matériel haute performance.

### Nébulisation
Diffusion de micro-gouttelettes pour atteindre les zones difficiles d''accès. Idéal pour grands volumes.

### Essuyage et Décontamination
Désinfection manuelle minutieuse des surfaces critiques et points de contact fréquents.

## Secteurs d''Activité

- **Restauration** : Cuisines, salles, zones de stockage
- **Hébergement** : Hôtels, chambres d''hôtes, locations saisonnières
- **Santé** : Cabinets médicaux, dentaires, pharmacies
- **Commerce** : Boutiques, bureaux, espaces de vente
- **Collectivités** : Écoles, crèches, établissements publics
- **Habitations** : Maisons, appartements après événement sanitaire

## Produits et Normes

Tous nos produits sont certifiés et homologués :
- Normes EN 14476 (virucide)
- Normes EN 1276 (bactéricide)
- Normes EN 13697 (surfaces)

## Intervention Rapide

Service d''urgence disponible pour situations critiques nécessitant une désinfection immédiate.

## Notre Engagement

- **Efficacité prouvée** : Produits testés et certifiés
- **Sécurité maximale** : Respect strict des protocoles
- **Certification** : Attestation de désinfection délivrée
- **Conseil personnalisé** : Accompagnement pour maintenir l''hygiène',
  features = '["Désinfection antibactérienne", "Désinfection antivirale", "Traitement COVID-19", "Nébulisation professionnelle", "Attestation de désinfection", "Produits certifiés"]',
  benefits = '["Intervention rapide 24h/24", "Produits homologués efficaces", "Techniciens formés aux protocoles", "Attestation officielle délivrée", "Respect des normes en vigueur", "Tarif transparent"]',
  pricing_info = '{"starting_price": "À partir de 150€", "price_range": "150€ - 600€", "note": "Tarif selon surface et type de désinfection", "free_quote": true}'
WHERE slug = 'desinfection';

-- Add detailed content for Traitement Termites
UPDATE services 
SET 
  detailed_content = '# Traitement des Termites et Capricornes à Porto-Vecchio

Protégez votre patrimoine immobilier contre les insectes xylophages avec nos traitements professionnels de charpente et boiseries.

## Les Insectes Xylophages en Corse

### Termites
Insectes sociaux vivant en colonies souterraines, ils s''attaquent au bois de construction, charpentes et planchers. Particulièrement présents dans les zones humides de Porto-Vecchio.

### Capricornes des Maisons
Leurs larves creusent des galeries dans le bois, affaiblissant dangereusement les structures. Reconnaissables aux trous ovales et sciure près des poutres.

### Vrillettes
Petits coléoptères dont les larves dévorent bois d''œuvre et meubles anciens. Dégâts progressifs mais sérieux sur le long terme.

## Notre Diagnostic

### Inspection Complète
Examen minutieux de la charpente, planchers, boiseries, caves et zones à risque. Identification précise de l''espèce et évaluation des dégâts.

### Rapport Détaillé
Document complet avec photos, cartographie des zones touchées et recommandations de traitement.

## Traitements Professionnels

### Traitement Curatif par Injection
Injection de produits xylophages profonds dans les bois infestés pour éliminer larves et adultes.

### Traitement Préventif
Application de produits protecteurs sur bois sains pour prévenir toute infestation future.

### Traitement par Pulvérisation
Pulvérisation de surface pour charpentes et boiseries accessibles.

### Traitement par Pièges
Installation de pièges à termites pour colonies souterraines avec monitoring régulier.

## Obligations Légales

Dans les zones à risque termites (Porto-Vecchio est concerné), un diagnostic termites est obligatoire :
- Lors de la vente d''un bien immobilier
- Avant démolition d''un bâtiment
- Déclaration en mairie en cas d''infestation

## Après Traitement

- Garantie jusqu''à 10 ans selon traitement
- Certificat de traitement officiel
- Suivi et contrôles réguliers
- Conseils d''entretien préventif

## Nos Atouts

- **Expertise locale** : Connaissance des espèces corses
- **Diagnostic gratuit** : Inspection et devis sans engagement
- **Certifications** : Techniciens certifiés en traitement du bois
- **Produits professionnels** : Xylophages homologués longue durée
- **Garantie décennale** : Protection durable de votre patrimoine',
  features = '["Diagnostic termites", "Traitement curatif par injection", "Traitement préventif charpente", "Élimination capricornes", "Certificat de traitement", "Garantie jusqu''à 10 ans"]',
  benefits = '["Diagnostic gratuit obligatoire", "Techniciens certifiés CTB-A+", "Produits garantie décennale", "Respect des normes DTU", "Certificat pour vente immobilière", "Suivi post-traitement"]',
  pricing_info = '{"starting_price": "Sur devis uniquement", "price_range": "Variable selon surface", "note": "Diagnostic gratuit puis devis détaillé selon dégâts", "free_quote": true}'
WHERE slug = 'traitement-termites';

-- Add detailed content for Dépigeonnage
UPDATE services 
SET 
  detailed_content = '# Dépigeonnage Professionnel à Porto-Vecchio

Protégez vos bâtiments et espaces des nuisances causées par les pigeons avec nos solutions de dépigeonnage durables et respectueuses.

## Problèmes Causés par les Pigeons

### Dégradations Matérielles
Les fientes acides de pigeons corrodent les façades, toitures, gouttières et détériorent les structures en pierre et métal.

### Risques Sanitaires
Les déjections véhiculent bactéries et parasites dangereux : salmonellose, cryptococcose, histoplasmose, psittacose.

### Nuisances Sonores
Roucoulements incessants, battements d''ailes et bagarres territoriales perturbent la tranquillité des occupants.

### Obstruction d''Installations
Nids dans gouttières et conduits provoquent infiltrations d''eau et dysfonctionnements des systèmes de ventilation.

## Solutions Anti-Pigeons

### Filets de Protection
Installation de filets anti-pigeons sur balcons, cours intérieures, toitures. Solution discrète et très efficace.

### Pics Anti-Pigeons
Pose de pics inox sur rebords, corniches, enseignes pour empêcher le stationnement. Durables et discrets.

### Systèmes Électriques
Fils électriques basse tension créant une zone inconfortable mais inoffensive pour les oiseaux.

### Répulsifs Visuels et Sonores
Effaroucheurs visuels (rapaces artificiels) et sonores (ultrasons) pour zones spécifiques.

### Capture et Relocalisation
Piégeage éthique des colonies avec relâche loin des zones urbaines, dans le respect de la réglementation.

## Notre Intervention

### Audit Complet
Analyse du bâtiment, identification des zones de nidification et de repos, évaluation du niveau d''infestation.

### Solution Sur-Mesure
Recommandation du système le plus adapté à votre bâtiment et budget. Combinaison possible de plusieurs méthodes.

### Installation Professionnelle
Pose par techniciens qualifiés avec matériel adapté aux hauteurs. Respect de l''architecture du bâtiment.

### Nettoyage et Désinfection
Élimination des fientes, nids et parasites. Désinfection complète des zones souillées.

### Maintenance
Vérification régulière des installations, remplacement si nécessaire, garantie de durabilité.

## Secteurs Concernés

- **Bâtiments historiques** : Églises, monuments, vieux port
- **Immeubles résidentiels** : Copropriétés, balcons, toitures
- **Commerces** : Enseignes, devantures, terrasses
- **Industries** : Entrepôts, hangars, sites de production
- **Collectivités** : Écoles, mairies, équipements publics

## Réglementation

Les pigeons sont protégés mais leur prolifération peut être contrôlée légalement. Nos méthodes respectent la législation en vigueur.

## Avantages INSECTELIM

- **Intervention en hauteur** : Équipement professionnel et habilitations
- **Matériaux durables** : Inox, filets traités anti-UV, garantie 5-10 ans
- **Esthétique préservée** : Solutions discrètes respectant l''architecture
- **Conformité légale** : Méthodes éthiques et autorisées
- **Garantie résultat** : Efficacité durable contre le retour des pigeons',
  features = '["Installation filets anti-pigeons", "Pose pics anti-pigeons inox", "Systèmes électriques", "Répulsifs visuels et sonores", "Capture et relocalisation", "Nettoyage et désinfection"]',
  benefits = '["Matériaux haute qualité", "Installation par cordistes", "Garantie 5 à 10 ans", "Respect de l''architecture", "Conformité réglementaire", "Maintenance incluse"]',
  pricing_info = '{"starting_price": "À partir de 200€", "price_range": "200€ - 2000€", "note": "Tarif selon surface et hauteur d''intervention", "free_quote": true}'
WHERE slug = 'depigeonnage';

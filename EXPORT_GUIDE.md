# 📦 Guide d'Export et Import de la Base de Données

Ce guide explique comment exporter toutes vos données actuelles et les importer dans une nouvelle base de données.

---

## 🎯 Étape 1 : Récupérer vos données actuelles

### Méthode 1 : Via Supabase Studio (Recommandé)

1. **Connectez-vous à Supabase Studio**
   - URL : `https://supabase.hevolife.fr`

2. **Pour chaque table, exécutez ces requêtes SQL** :

   **Services :**
   ```sql
   SELECT * FROM services ORDER BY "order";
   ```

   **Blog Posts :**
   ```sql
   SELECT * FROM blog_posts ORDER BY created_at DESC;
   ```

   **Site Settings :**
   ```sql
   SELECT * FROM site_settings;
   ```

   **Contact Messages (optionnel) :**
   ```sql
   SELECT * FROM contact_messages ORDER BY created_at DESC;
   ```

3. **Copiez les résultats**
   - Cliquez sur **"Copy as JSON"** ou **"Copy as CSV"**
   - Gardez ces données de côté

---

### Méthode 2 : Via pg_dump (Ligne de commande)

```bash
# Export complet de la base
pg_dump "postgresql://postgres:password@supabase.hevolife.fr:5432/postgres" \
  --data-only \
  --table=services \
  --table=blog_posts \
  --table=site_settings \
  --table=contact_messages \
  > export-data.sql
```

---

## 🔄 Étape 2 : Préparer le fichier d'export personnalisé

J'ai créé un fichier **`export-database.sql`** qui contient :
- ✅ La structure complète avec des données d'exemple
- ✅ 5 services pré-remplis avec descriptions détaillées
- ✅ 3 articles de blog complets
- ✅ Les paramètres du site (contact, hero section, etc.)

**IMPORTANT** : Ce fichier contient des **données d'exemple**. Vous devez le modifier avec vos vraies données !

### Comment personnaliser export-database.sql :

1. **Ouvrez le fichier** `export-database.sql`

2. **Remplacez les données des services** (lignes 30-120)
   - Copiez vos vraies données depuis Supabase Studio
   - Remplacez les UUIDs, titres, descriptions, etc.

3. **Remplacez les données des blog posts** (lignes 150-250)
   - Copiez vos vrais articles depuis Supabase Studio

4. **Remplacez les paramètres du site** (lignes 280-320)
   - Mettez vos vrais numéros de téléphone, emails, etc.

---

## 📥 Étape 3 : Importer dans la nouvelle base

### Option A : Via Supabase Studio (Le plus simple)

1. **Connectez-vous à votre NOUVELLE base Supabase**

2. **Créez d'abord le schéma** (si pas déjà fait)
   - Allez dans **SQL Editor**
   - Exécutez dans l'ordre :
     - `supabase/migrations/20251106002338_create_insectelim_tables.sql`
     - `supabase/migrations/20251106004415_add_logo_to_hero_section.sql`
     - `supabase/migrations/20251106005817_add_delete_policy_contact_messages.sql`
     - `supabase/migrations/20251106011439_add_service_details_and_pricing.sql`
     - `supabase/migrations/20251106020000_add_missing_service_columns.sql`

3. **Importez les données**
   - Dans **SQL Editor**, cliquez sur **"New query"**
   - Copiez tout le contenu de `export-database.sql`
   - Cliquez sur **"Run"**

4. **Vérifiez l'import**
   ```sql
   SELECT 'services' AS table_name, COUNT(*) AS count FROM services
   UNION ALL
   SELECT 'blog_posts', COUNT(*) FROM blog_posts
   UNION ALL
   SELECT 'site_settings', COUNT(*) FROM site_settings;
   ```

---

### Option B : Via psql (Ligne de commande)

```bash
# Import dans la nouvelle base
psql "postgresql://postgres:new-password@new-host:5432/postgres" \
  -f export-database.sql
```

---

## 🛠️ Étape 4 : Script automatique pour exporter VOS données

Si vous voulez automatiser l'export de VOS données actuelles, utilisez ce script :

### export-my-data.sh

```bash
#!/bin/bash

# Configuration
DB_URL="postgresql://postgres:password@supabase.hevolife.fr:5432/postgres"
OUTPUT_FILE="my-real-data-export.sql"

echo "-- Export de la base de données INSECTELIM" > $OUTPUT_FILE
echo "-- Date: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Export services
echo "-- SERVICES" >> $OUTPUT_FILE
psql "$DB_URL" -c "\COPY (SELECT * FROM services ORDER BY \"order\") TO STDOUT WITH (FORMAT text, DELIMITER E'\t')" >> $OUTPUT_FILE

# Export blog_posts
echo "" >> $OUTPUT_FILE
echo "-- BLOG POSTS" >> $OUTPUT_FILE
psql "$DB_URL" -c "\COPY (SELECT * FROM blog_posts ORDER BY created_at) TO STDOUT WITH (FORMAT text, DELIMITER E'\t')" >> $OUTPUT_FILE

# Export site_settings
echo "" >> $OUTPUT_FILE
echo "-- SITE SETTINGS" >> $OUTPUT_FILE
psql "$DB_URL" -c "\COPY (SELECT * FROM site_settings) TO STDOUT WITH (FORMAT text, DELIMITER E'\t')" >> $OUTPUT_FILE

# Export contact_messages (optionnel)
echo "" >> $OUTPUT_FILE
echo "-- CONTACT MESSAGES" >> $OUTPUT_FILE
psql "$DB_URL" -c "\COPY (SELECT * FROM contact_messages ORDER BY created_at) TO STDOUT WITH (FORMAT text, DELIMITER E'\t')" >> $OUTPUT_FILE

echo "✅ Export terminé : $OUTPUT_FILE"
```

**Usage :**
```bash
chmod +x export-my-data.sh
./export-my-data.sh
```

---

## 📊 Vérification après import

### Vérifier le nombre d'enregistrements :

```sql
SELECT
  'services' AS table_name,
  COUNT(*) AS count
FROM services
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;
```

### Vérifier quelques données :

```sql
-- Services actifs
SELECT id, title, slug, active, "order"
FROM services
ORDER BY "order";

-- Articles publiés
SELECT id, title, slug, published, created_at
FROM blog_posts
WHERE published = true
ORDER BY created_at DESC;

-- Paramètres du site
SELECT key, value
FROM site_settings;
```

---

## 🔐 Sécurité et bonnes pratiques

### ⚠️ Attention aux données sensibles

- **Messages de contact** : Contiennent des emails et téléphones personnels
- **Ne partagez JAMAIS** vos fichiers d'export publiquement
- **Supprimez** les exports après utilisation

### 🔒 Recommandations

1. ✅ Testez l'import sur une base de test d'abord
2. ✅ Faites une sauvegarde de la nouvelle base avant l'import
3. ✅ Vérifiez que toutes les contraintes RLS sont en place
4. ✅ Testez l'authentification après l'import
5. ✅ Vérifiez que l'application fonctionne correctement

---

## 🎯 Résumé des étapes

1. ✅ Exportez vos données actuelles depuis Supabase Studio
2. ✅ Personnalisez le fichier `export-database.sql` avec vos vraies données
3. ✅ Créez le schéma dans la nouvelle base (migrations)
4. ✅ Importez les données avec le fichier SQL
5. ✅ Vérifiez que tout fonctionne
6. ✅ Mettez à jour les variables d'environnement de votre application

---

## 🆘 Problèmes courants

### "ERROR: duplicate key value violates unique constraint"

**Cause** : Des données existent déjà dans la nouvelle base

**Solution** :
```sql
-- Vider les tables avant l'import
TRUNCATE TABLE services, blog_posts, site_settings, contact_messages CASCADE;
```

### "ERROR: column does not exist"

**Cause** : Les migrations n'ont pas été appliquées

**Solution** : Exécutez toutes les migrations dans l'ordre avant d'importer les données

### "ERROR: permission denied"

**Cause** : Problème de RLS ou de permissions

**Solution** :
```sql
-- Temporairement désactiver RLS pour l'import
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Faire l'import...

-- Puis réactiver RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs d'erreur SQL
2. Assurez-vous que toutes les migrations sont appliquées
3. Testez l'import table par table
4. Vérifiez les permissions et RLS

---

Votre export est maintenant prêt ! 🎉

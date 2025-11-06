# 🔧 Correction de l'erreur 400

## ❌ Problème rencontré

```
GET https://supabase.hevolife.fr/rest/v1/services?select=*&active=eq.true&order=order.asc 400 (Bad Request)
```

**Cause** : Les colonnes `active`, `order`, `image_url`, `slug`, `features`, et `benefits` n'existaient pas dans la table `services`.

---

## ✅ Solution : Exécuter la migration

### Méthode 1 : Via Supabase Studio (Recommandé)

1. Connectez-vous à votre **Supabase Studio** sur Coolify
   - URL : `https://supabase.hevolife.fr` (ou votre domaine)

2. Allez dans **"SQL Editor"** (icône 📝 dans la barre latérale)

3. Cliquez sur **"New query"**

4. **Copiez tout le contenu** du fichier :
   ```
   supabase/migrations/20251106020000_add_missing_service_columns.sql
   ```

5. **Collez-le** dans l'éditeur SQL

6. Cliquez sur **"Run"** (ou Ctrl+Enter)

7. ✅ Vous devriez voir : "Success" avec le message "Colonnes ajoutées avec succès"

---

### Méthode 2 : Via psql (Ligne de commande)

Si vous avez accès au terminal PostgreSQL :

```bash
psql "postgresql://postgres:votre-mot-de-passe@supabase.hevolife.fr:5432/postgres" \
  -f supabase/migrations/20251106020000_add_missing_service_columns.sql
```

---

## 📋 Ce que fait cette migration

La migration ajoute les colonnes manquantes :

| Colonne | Type | Description | Défaut |
|---------|------|-------------|--------|
| `active` | boolean | Service visible publiquement | `true` |
| `order` | integer | Ordre d'affichage | `0` |
| `image_url` | text | URL de l'image personnalisée | NULL |
| `slug` | text | URL du service (ex: deratisation) | NULL |
| `features` | jsonb | Liste des prestations | `[]` |
| `benefits` | jsonb | Liste des avantages | `[]` |
| `pricing_info` | jsonb | Informations tarifaires | `{}` |

---

## 🔍 Vérifier que ça fonctionne

### 1. Vérifiez les colonnes dans SQL Editor :

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'services'
ORDER BY ordinal_position;
```

Vous devriez voir toutes les colonnes listées ci-dessus.

### 2. Testez l'application :

1. Actualisez votre navigateur (F5)
2. L'erreur 400 devrait disparaître
3. Les services devraient s'afficher normalement

---

## 🎯 Prochaines étapes

Une fois la migration appliquée :

### 1. Configurer les services existants

Dans Supabase Studio → SQL Editor, exécutez :

```sql
-- Ajouter des slugs aux services existants
UPDATE services
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Vérifier les services
SELECT id, title, slug, active, "order" FROM services;
```

### 2. Accéder au panneau admin

1. Allez sur votre site : `https://votre-domaine.com`
2. Cliquez sur **"Admin"** en haut à droite
3. Connectez-vous avec : `admin@insectelim.fr` / `admin123`
4. Vous pouvez maintenant :
   - ✅ Activer/Désactiver les services
   - ✅ Réorganiser l'ordre d'affichage
   - ✅ Ajouter des images personnalisées
   - ✅ Créer des pages détaillées avec slug

---

## 🆘 En cas de problème

### "Column already exists"
C'est normal ! La migration utilise `ADD COLUMN IF NOT EXISTS`, donc elle ne fait rien si la colonne existe déjà.

### L'erreur 400 persiste
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez que la migration a bien été exécutée :
   ```sql
   \d services
   ```
3. Redémarrez votre application frontend

### "Permission denied"
Assurez-vous d'être connecté avec le compte `postgres` (super utilisateur) dans Supabase.

---

## 📝 Résumé

1. ✅ Ouvrez Supabase Studio
2. ✅ SQL Editor → New query
3. ✅ Collez le contenu de `20251106020000_add_missing_service_columns.sql`
4. ✅ Cliquez sur "Run"
5. ✅ Actualisez votre application
6. 🎉 L'erreur 400 est résolue !

---

Votre application devrait maintenant fonctionner parfaitement ! 🚀

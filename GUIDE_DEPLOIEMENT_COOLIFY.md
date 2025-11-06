# 🚀 Guide complet : Déployer InsectElim sur Coolify avec Supabase

Ce guide vous montre comment déployer votre site InsectElim sur **Coolify** avec une base de données **Supabase** (hébergée sur Coolify).

---

## 📋 Prérequis

✅ Un serveur Coolify fonctionnel
✅ Un repository Git accessible (GitHub, GitLab, etc.)
✅ Ce projet poussé sur le repository

---

## 🗄️ ÉTAPE 1 : Installer Supabase sur Coolify

### 1.1 Créer une instance Supabase

1. Dans Coolify, cliquez sur **"+ New Resource"**
2. Sélectionnez **"Service"**
3. Cherchez **"Supabase"** dans la liste
4. Cliquez sur **"Deploy"**

### 1.2 Configuration Supabase

Coolify va créer automatiquement :
- PostgreSQL (base de données)
- Supabase API
- Supabase Studio (interface d'admin)
- Auth, Storage, etc.

**⚠️ Notez les informations importantes :**
- **SUPABASE_URL** : URL de votre instance (ex: `https://supabase.votredomaine.fr`)
- **SUPABASE_ANON_KEY** : La clé publique (dans les variables d'environnement)
- **SUPABASE_SERVICE_ROLE_KEY** : La clé admin (ne PAS exposer publiquement)

### 1.3 Configurer un domaine pour Supabase

1. Dans votre service Supabase sur Coolify
2. Ajoutez un domaine (ex: `supabase.hevolife.fr`)
3. Activez HTTPS/SSL

### 1.4 Appliquer les migrations

1. Accédez à **Supabase Studio** : `https://supabase.votredomaine.fr`
2. Allez dans **SQL Editor**
3. Exécutez les migrations dans l'ordre :

```sql
-- Copiez le contenu de chaque fichier de migration dans l'ordre :
-- 1. supabase/migrations/20251106002338_create_insectelim_tables.sql
-- 2. supabase/migrations/20251106004415_add_logo_to_hero_section.sql
-- 3. supabase/migrations/20251106005817_add_delete_policy_contact_messages.sql
-- 4. supabase/migrations/20251106011439_add_service_details_and_pricing.sql
-- 5. supabase/migrations/20251106020000_add_missing_service_columns.sql
```

Ou utilisez la CLI Supabase si vous l'avez installée localement :

```bash
supabase link --project-ref votre-project-ref
supabase db push
```

---

## 🌐 ÉTAPE 2 : Déployer le site Frontend sur Coolify

### 2.1 Créer l'application Frontend

1. Dans Coolify, cliquez sur **"+ New Resource"**
2. Sélectionnez **"Application"**
3. Type : **"Public Repository"** ou connectez votre Git

### 2.2 Configuration Git

- **Repository URL** : `https://github.com/votre-user/votre-repo.git`
- **Branch** : `main` (ou votre branche de prod)
- **Build Pack** : **"Dockerfile"**

### 2.3 Configuration Build

- **Dockerfile Location** : `./Dockerfile`
- **Port** : `80`

### 2.4 Variables d'environnement (⚠️ CRITIQUE)

Dans Coolify, allez dans **Environment Variables** et ajoutez :

```env
VITE_SUPABASE_URL=https://supabase.hevolife.fr
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT** :
- Utilisez les valeurs de **votre instance Supabase Coolify**
- Ces variables doivent être marquées comme **"Build Time Variables"**
- **NE PAS** mettre la `SERVICE_ROLE_KEY` ici (c'est une clé admin sensible)

### 2.5 Domaine

1. Ajoutez votre domaine : `jarvis.hevolife.fr`
2. Activez **HTTPS/SSL**

### 2.6 Déployer !

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine
3. Vérifiez les logs

---

## 🔐 ÉTAPE 3 : Créer un compte administrateur

### Option A : Via Supabase Studio

1. Allez sur `https://supabase.votredomaine.fr`
2. **Authentication** → **Users**
3. Cliquez sur **"Add user"**
4. Email : `admin@votredomaine.com`
5. Mot de passe : créez un mot de passe sécurisé
6. Confirmez la création

### Option B : Via SQL

Dans Supabase Studio → SQL Editor :

```sql
-- Remplacez email et password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@votredomaine.com',
  crypt('VotreMotDePasseSecurise', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

---

## ✅ ÉTAPE 4 : Vérifier le déploiement

### 4.1 Vérifier le site

1. Ouvrez `https://jarvis.hevolife.fr`
2. Le site devrait s'afficher correctement
3. Vérifiez que les services et blogs s'affichent

### 4.2 Tester l'admin

1. Allez sur `https://jarvis.hevolife.fr/admin`
2. Connectez-vous avec vos identifiants admin
3. Vérifiez que vous pouvez créer/modifier des contenus

### 4.3 Tester le formulaire de contact

1. Remplissez le formulaire de contact
2. Vérifiez dans l'admin que le message apparaît

### 4.4 Vérifier les logs (si problème)

Dans Coolify :
- Cliquez sur votre application
- **"Logs"** → **"Show Logs"**
- Vérifiez qu'il n'y a pas d'erreurs

Dans le navigateur :
- Ouvrez la console (F12)
- Vérifiez qu'il n'y a pas d'erreurs réseau ou Supabase

---

## 🛠️ Dépannage

### Problème : "fetch failed" ou erreurs Supabase

**Cause** : Les variables d'environnement ne sont pas correctes

**Solution** :
1. Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont bien définies dans Coolify
2. Vérifiez qu'elles correspondent à votre instance Supabase
3. Redéployez l'application

### Problème : 404 sur /admin

**Cause** : Nginx ne redirige pas les routes SPA

**Solution** : Le `nginx.conf` est déjà configuré. Si le problème persiste, vérifiez que le Dockerfile copie bien le fichier.

### Problème : Cannot read properties of null

**Cause** : Les tables Supabase ne sont pas créées

**Solution** : Exécutez toutes les migrations dans Supabase Studio (voir ÉTAPE 1.4)

### Problème : CORS errors

**Cause** : Mauvaise configuration du domaine Supabase

**Solution** :
1. Vérifiez que votre domaine Supabase est bien configuré avec HTTPS
2. Dans Supabase Studio → Settings → API, vérifiez que votre domaine frontend est autorisé

---

## 📝 Résumé de l'architecture

```
┌─────────────────────────────────────────┐
│          Coolify Server                 │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Supabase Service               │  │
│  │   (supabase.hevolife.fr)         │  │
│  │   - PostgreSQL                   │  │
│  │   - Supabase API                 │  │
│  │   - Auth                         │  │
│  │   - Storage                      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Frontend App (Dockerfile)      │  │
│  │   (jarvis.hevolife.fr)           │  │
│  │   - React + Vite                 │  │
│  │   - Nginx                        │  │
│  │   - Connecté à Supabase          │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🎉 C'est terminé !

Votre site InsectElim est maintenant déployé sur Coolify avec :
- ✅ Frontend React servi par Nginx
- ✅ Base de données Supabase
- ✅ Authentification sécurisée
- ✅ HTTPS/SSL
- ✅ Interface d'administration

Pour mettre à jour le site, poussez vos changements sur Git et redéployez dans Coolify !

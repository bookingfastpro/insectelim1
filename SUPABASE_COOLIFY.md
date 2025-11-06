# 🐳 Déployer Supabase auto-hébergé sur Coolify

Ce guide explique comment héberger votre propre instance Supabase sur Coolify au lieu d'utiliser le cloud Supabase.

## 📋 Pourquoi Supabase auto-hébergé ?

- ✅ **Gratuit** : Pas de limite de stockage ou d'utilisateurs
- ✅ **Contrôle total** : Vos données sur votre serveur
- ✅ **Pas de dépendance** : Ne dépend pas du cloud Supabase
- ✅ **Interface admin** : Tableau de bord comme sur supabase.com

---

## 🚀 Étape 1 : Prérequis

Vous devez avoir :
- Un compte Coolify avec un serveur configuré
- Au moins **4 GB de RAM** disponible (Supabase a besoin de ressources)
- Un nom de domaine (optionnel mais recommandé)

---

## 🔧 Étape 2 : Déployer Supabase sur Coolify

### Option A : Via le Template Coolify (Le plus simple)

1. **Dans Coolify, allez dans "Services"**
   - Cliquez sur **"+ Add Service"**
   - Cherchez **"Supabase"** dans les templates

2. **Si Supabase n'est pas dans les templates**, utilisez l'Option B ci-dessous

### Option B : Via Docker Compose (Méthode manuelle)

1. **Clonez le repository Supabase** (sur votre machine locale) :
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   ```

2. **Copiez le fichier d'environnement** :
   ```bash
   cp .env.example .env
   ```

3. **Générez des secrets sécurisés** :

   Ouvrez le fichier `.env` et remplacez ces valeurs :

   ```bash
   # Générez des mots de passe sécurisés
   POSTGRES_PASSWORD=$(openssl rand -base64 32)
   JWT_SECRET=$(openssl rand -base64 32)
   ANON_KEY=généré-ci-dessous
   SERVICE_ROLE_KEY=généré-ci-dessous
   ```

4. **Générez les clés JWT** :

   Utilisez cet outil en ligne : https://supabase.com/docs/guides/self-hosting/docker#generating-api-keys

   Ou installez Supabase CLI localement :
   ```bash
   npm install -g supabase
   supabase gen keys
   ```

   Cela vous donnera :
   - `ANON_KEY` : Clé publique pour le frontend
   - `SERVICE_ROLE_KEY` : Clé privée pour le backend (GARDEZ-LA SECRÈTE)

5. **Configurez les URLs** :

   Dans le fichier `.env`, modifiez :
   ```bash
   # Remplacez par votre domaine
   API_EXTERNAL_URL=https://votre-domaine.com
   SUPABASE_PUBLIC_URL=https://votre-domaine.com
   STUDIO_DEFAULT_PROJECT=insectelim
   ```

6. **Poussez sur Git** :
   ```bash
   git init
   git add .
   git commit -m "Supabase config"
   git push
   ```

7. **Dans Coolify** :
   - Cliquez sur **"+ New"** → **"Docker Compose"**
   - Connectez votre repository Git
   - Coolify détectera automatiquement le `docker-compose.yml`
   - Ajoutez les variables d'environnement du fichier `.env`
   - Cliquez sur **"Deploy"**

8. **Attendez le déploiement** (5-10 minutes)

   Supabase lancera plusieurs services :
   - PostgreSQL (base de données)
   - Kong (API Gateway)
   - GoTrue (authentification)
   - PostgREST (API REST)
   - Realtime (WebSockets)
   - Storage (fichiers)
   - Studio (interface admin)

---

## 📊 Étape 3 : Accéder à Supabase Studio

1. **Trouvez l'URL du Studio** :
   - Dans Coolify, allez dans votre service Supabase
   - Le Studio est accessible sur le port **3000**
   - URL : `https://votre-domaine.com:3000` ou configurez un sous-domaine

2. **Connectez-vous** :
   - Email : `admin@insectelim.fr` (ou celui dans votre `.env`)
   - Mot de passe : celui défini dans `DASHBOARD_PASSWORD` du `.env`

---

## 🗄️ Étape 4 : Initialiser votre base de données

Une fois Supabase déployé :

### Via l'interface Studio :

1. Allez dans **"SQL Editor"**
2. Cliquez sur **"New query"**
3. Copiez le contenu de `server/init-db.sql`
4. Cliquez sur **"Run"**

### Via la ligne de commande :

```bash
# Récupérez l'URL PostgreSQL depuis Coolify
# Elle ressemble à : postgresql://postgres:password@host:5432/postgres

cd server
npm install
npm run init-db "postgresql://postgres:votre-mot-de-passe@votre-domaine.com:5432/postgres"
```

---

## ⚙️ Étape 5 : Configurer votre application

### Frontend (.env dans la racine) :

```bash
VITE_SUPABASE_URL=https://votre-domaine.com
VITE_SUPABASE_ANON_KEY=votre-anon-key-generee
```

### Backend (server/.env) :

```bash
DATABASE_URL=postgresql://postgres:password@votre-domaine.com:5432/postgres
SUPABASE_URL=https://votre-domaine.com
SUPABASE_SERVICE_KEY=votre-service-role-key
JWT_SECRET=votre-jwt-secret
```

---

## 🔐 Étape 6 : Configurer l'authentification

Dans Supabase Studio :

1. Allez dans **"Authentication"** → **"Settings"**

2. **Configurez l'URL du site** :
   ```
   Site URL: https://votre-domaine-frontend.com
   ```

3. **Ajoutez les URLs de redirection autorisées** :
   ```
   https://votre-domaine-frontend.com/**
   http://localhost:5173/** (pour le dev)
   ```

4. **Désactivez la confirmation d'email** (pour simplifier) :
   - Allez dans **"Authentication"** → **"Providers"** → **"Email"**
   - Désactivez **"Confirm email"**

---

## 📦 Étape 7 : Déployer votre application

### Mettre à jour le frontend pour utiliser Supabase :

Votre application utilise déjà Supabase ! Le fichier `src/lib/supabase.ts` est déjà configuré.

Il suffit de définir les variables d'environnement :

```bash
VITE_SUPABASE_URL=https://votre-domaine-supabase.com
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

### Déployer sur Coolify :

1. **Frontend** :
   - Créez une nouvelle application
   - Pointez vers votre repository
   - Ajoutez les variables d'environnement ci-dessus
   - Deploy !

2. **Backend** (optionnel si vous utilisez uniquement Supabase) :
   - Vous n'avez peut-être plus besoin du backend Express
   - Supabase fournit déjà l'API REST, l'authentification, etc.

---

## 🏗️ Architecture finale

```
┌─────────────────────────────────┐
│   Frontend (Vite + React)      │
│   votre-domaine.com             │
└────────────┬────────────────────┘
             │
             │ VITE_SUPABASE_URL
             │ VITE_SUPABASE_ANON_KEY
             │
┌────────────▼────────────────────┐
│   Supabase Auto-hébergé         │
│   supabase.votre-domaine.com    │
│                                  │
│   ┌──────────────────────────┐  │
│   │  Studio (Admin UI)       │  │
│   │  Port 3000               │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  Kong (API Gateway)      │  │
│   │  Port 8000               │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  PostgreSQL              │  │
│   │  Port 5432               │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  Auth (GoTrue)           │  │
│   │  Storage                 │  │
│   │  Realtime                │  │
│   └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🎯 Avantages vs Express Backend

| Fonctionnalité | Express Backend | Supabase |
|----------------|-----------------|----------|
| Base de données | PostgreSQL séparé | ✅ Inclus |
| API REST | À coder | ✅ Auto-généré |
| Authentification | À coder | ✅ Inclus |
| Temps réel | À coder | ✅ Inclus |
| Stockage fichiers | À coder | ✅ Inclus |
| Interface admin | À coder | ✅ Inclus |
| Sécurité RLS | À coder | ✅ Inclus |

---

## 🔧 Migration de Express vers Supabase

Si vous voulez migrer complètement vers Supabase :

### 1. Les tables existent déjà
Vous avez déjà créé les tables avec `init-db.sql` ✅

### 2. Activer Row Level Security (RLS)

Dans Supabase Studio → SQL Editor :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour admin_users (seulement l'admin peut se voir)
CREATE POLICY "Admins can view own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour les services (lecture publique)
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Politique pour les blogs (lecture publique des publiés)
CREATE POLICY "Anyone can view published blogs"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage blogs"
  ON blog_posts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Politique pour les messages (seulement admins)
CREATE POLICY "Admins can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create messages"
  ON contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique pour les paramètres (lecture publique)
CREATE POLICY "Anyone can view settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

### 3. Mettre à jour le frontend

Le frontend utilise déjà `src/lib/supabase.ts` !

Il suffit de :
1. Définir les variables d'environnement
2. Tester que tout fonctionne

---

## 📝 Résumé des étapes

1. ✅ Déployer Supabase sur Coolify (Docker Compose)
2. ✅ Accéder à Supabase Studio
3. ✅ Exécuter `init-db.sql` pour créer les tables
4. ✅ Configurer RLS pour la sécurité
5. ✅ Configurer les variables d'environnement du frontend
6. ✅ Déployer le frontend
7. ✅ Tester l'application

---

## ⚠️ Points importants

1. **Ressources serveur** : Supabase nécessite au moins 4 GB de RAM
2. **Sauvegardes** : Configurez des sauvegardes régulières de PostgreSQL
3. **Sécurité** : Ne partagez JAMAIS la `SERVICE_ROLE_KEY`
4. **Monitoring** : Surveillez les logs dans Coolify
5. **Mises à jour** : Supabase sort des mises à jour régulières

---

## 🆘 Dépannage

### Supabase ne démarre pas
- Vérifiez que vous avez assez de RAM (4 GB minimum)
- Vérifiez les logs dans Coolify
- Attendez 10 minutes, le premier démarrage est long

### "Invalid API key"
- Vérifiez que `VITE_SUPABASE_ANON_KEY` est correct
- Regénérez les clés si nécessaire

### "Row Level Security: new row violates policy"
- Vos politiques RLS sont trop restrictives
- Ajoutez les politiques manquantes

### Cannot connect to database
- Vérifiez que PostgreSQL est bien démarré
- Vérifiez le port (5432)
- Vérifiez le mot de passe

---

## 🎉 Conclusion

Avec Supabase auto-hébergé sur Coolify, vous avez :
- ✅ Une base de données PostgreSQL
- ✅ Une API REST automatique
- ✅ Un système d'authentification
- ✅ Une interface d'administration
- ✅ Le tout 100% gratuit et sous votre contrôle !

Plus besoin du backend Express, Supabase fait tout ! 🚀

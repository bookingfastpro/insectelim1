# 🚀 Guide Simple d'Installation de la Base de Données

Ce guide est pour les débutants. Suivez étape par étape.

## 📋 Qu'est-ce qu'on va faire ?

1. Créer une base de données PostgreSQL gratuite en ligne
2. Exécuter un script automatique pour créer toutes les tables
3. Votre site sera prêt à fonctionner !

---

## Méthode 1 : Avec Supabase (Recommandé - 100% Gratuit)

### Étape 1 : Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **"Start your project"**
3. Créez un compte (avec GitHub ou email)

### Étape 2 : Créer un projet

1. Cliquez sur **"New Project"**
2. Donnez un nom : `insectelim`
3. Créez un mot de passe (notez-le !)
4. Choisissez une région proche de vous
5. Cliquez sur **"Create new project"**
6. ⏰ Attendez 2 minutes que le projet se crée

### Étape 3 : Récupérer l'URL de connexion

1. Dans votre projet, allez dans **"Settings"** (⚙️ en bas à gauche)
2. Cliquez sur **"Database"**
3. Scrollez jusqu'à **"Connection string"**
4. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.xxxxx.supabase.co:5432/postgres
   ```
5. ⚠️ Remplacez `[VOTRE-MOT-DE-PASSE]` par le mot de passe que vous avez créé

### Étape 4 : Exécuter le script d'initialisation

**Option A : Via l'interface Supabase (Plus facile)**

1. Dans Supabase, allez dans **"SQL Editor"** (icône 📝)
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `server/init-db.sql` sur votre ordinateur
4. Copiez TOUT le contenu
5. Collez-le dans l'éditeur Supabase
6. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)
7. ✅ Vous devriez voir "Success" !

**Option B : Via la ligne de commande**

```bash
# 1. Allez dans le dossier server
cd server

# 2. Installez les dépendances
npm install

# 3. Exécutez le script avec votre URL
npm run init-db "postgresql://postgres:[MOT-DE-PASSE]@db.xxxxx.supabase.co:5432/postgres"
```

### Étape 5 : Configurer votre application

Créez un fichier `.env` dans le dossier `server` :

```bash
DATABASE_URL=postgresql://postgres:[MOT-DE-PASSE]@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=votre-secret-genere-ci-dessous
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Pour générer un `JWT_SECRET`, exécutez :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ✅ C'est prêt !

Votre base de données contient maintenant :
- ✅ Un compte admin : `admin@insectelim.fr` / `admin123`
- ✅ 3 services par défaut
- ✅ 1 article de blog exemple
- ✅ Les paramètres du site

---

## Méthode 2 : Avec Neon (Alternative gratuite)

### Étape 1 : Créer un compte Neon

1. Allez sur https://neon.tech
2. Cliquez sur **"Sign up"**
3. Créez un compte (avec GitHub ou email)

### Étape 2 : Créer un projet

1. Cliquez sur **"Create a project"**
2. Nom du projet : `insectelim`
3. Région : Choisissez la plus proche
4. PostgreSQL version : **16** (recommandé)
5. Cliquez sur **"Create project"**

### Étape 3 : Récupérer l'URL

1. Sur la page du projet, copiez la **"Connection string"**
2. Elle ressemble à :
   ```
   postgresql://user:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb
   ```

### Étape 4 : Initialiser

Suivez la même **Étape 4** que pour Supabase ci-dessus.

---

## Méthode 3 : PostgreSQL local (Pour tester sur votre ordinateur)

### Étape 1 : Installer PostgreSQL

**Sur Windows :**
1. Téléchargez : https://www.postgresql.org/download/windows/
2. Installez avec les options par défaut
3. Notez le mot de passe que vous créez

**Sur Mac :**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Sur Linux :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Étape 2 : Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, créez la base
CREATE DATABASE insectelim;
\q
```

### Étape 3 : Initialiser

```bash
cd server
npm install
npm run init-db "postgresql://postgres:votre-mot-de-passe@localhost:5432/insectelim"
```

---

## 🎉 Vérification

Pour vérifier que tout fonctionne :

1. **Démarrez le backend** :
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Dans un autre terminal, démarrez le frontend** :
   ```bash
   npm install
   npm run dev
   ```

3. **Ouvrez votre navigateur** :
   - Allez sur `http://localhost:5173`
   - Cliquez sur "Admin" en haut à droite
   - Connectez-vous avec :
     - Email : `admin@insectelim.fr`
     - Mot de passe : `admin123`

4. ✅ Si vous voyez le panneau admin, **c'est bon !**

---

## ❓ Problèmes fréquents

### "Cannot connect to database"

**Vérifiez :**
- L'URL de connexion est correcte
- Vous avez remplacé `[VOTRE-MOT-DE-PASSE]` par votre vrai mot de passe
- Pas d'espaces avant ou après l'URL

### "Role does not exist"

**Solution :**
- Sur Supabase : utilisez `postgres` comme nom d'utilisateur
- URL correcte : `postgresql://postgres:mot-de-passe@...`

### "Permission denied"

**Solution :**
- Assurez-vous d'être connecté avec les bons droits
- Sur Supabase, utilisez l'URL de connexion complète

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué :

1. Vérifiez les messages d'erreur
2. Relisez les étapes depuis le début
3. Assurez-vous d'avoir copié l'URL complète
4. Testez l'URL dans un client PostgreSQL comme pgAdmin

---

## 🔐 Sécurité

⚠️ **IMPORTANT :**

1. Changez le mot de passe admin après la première connexion
2. Ne partagez JAMAIS votre `DATABASE_URL`
3. Ne committez JAMAIS le fichier `.env` sur Git
4. Utilisez des mots de passe forts en production

---

## 📁 Structure créée

Votre base de données contient maintenant :

```
📊 Tables créées :
├── admin_users          (Comptes administrateurs)
├── services             (Services proposés)
├── blog_posts           (Articles de blog)
├── contact_messages     (Messages des clients)
└── site_settings        (Paramètres du site)

👤 Données par défaut :
├── 1 admin : admin@insectelim.fr
├── 3 services : Dératisation, Désinsectisation, Désinfection
├── 1 article de blog
└── Paramètres du site (titre, contact, etc.)
```

---

Vous êtes prêt ! 🚀

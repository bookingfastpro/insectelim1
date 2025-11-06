# Guide de déploiement simplifié sur Coolify

---

## ⚠️ PROBLÈMES COURANTS

### 1. "Docker Compose file not found at: /docker-compose.yaml"

**Cause** : Coolify cherche `/docker-compose.yaml` mais le fichier s'appelle `docker-compose.yml`

**Solution** : N'utilisez PAS Docker Compose ! Utilisez juste le Dockerfile.

**Pourquoi ?** Le docker-compose.yml déploie PostgreSQL + Backend + Frontend, mais vous utilisez déjà Supabase, donc vous n'avez besoin que du **frontend seul**.

✅ **Configuration recommandée dans Coolify** :
- Type : **"Dockerfile"** (PAS "Docker Compose")
- Dockerfile path : `./Dockerfile`
- Port : `80`

---

### 2. 404 sur /admin

Si vous obtenez **"GET https://jarvis.hevolife.fr/admin 404 (Not Found)"**, c'est que votre serveur ne redirige pas correctement les routes SPA vers `index.html`.

### ✅ Solution rapide :

**Si vous utilisez Docker (Dockerfile)** : Votre configuration est déjà correcte ! Assurez-vous que :
1. Coolify utilise bien le `Dockerfile` pour le build
2. Le fichier `nginx.conf` est copié (c'est déjà fait dans le Dockerfile)
3. Le port est configuré sur **80**

**Si vous utilisez "Static Site" ou autre** : Voir la section "Résoudre le 404 sur /admin" ci-dessous.

---

## ✅ SOLUTION RECOMMANDÉE : Déploiement Frontend seul avec Supabase

Puisque vous utilisez **Supabase** pour la base de données, vous n'avez besoin de déployer que le **frontend**.

### Configuration dans Coolify :

1. **Créez une nouvelle application**
   - Cliquez sur **"+ New Resource"** ou **"Add"**
   - Type : **"Application"** → **"Dockerfile"**

2. **Configuration Git**
   - Connectez votre repository
   - Branch : `main` (ou votre branche)

3. **Build Configuration**
   - Build Pack : **"Dockerfile"**
   - Dockerfile Location : `./Dockerfile`
   - Port : **80**

4. **Variables d'environnement** (⚠️ CRITIQUE - définir AVANT le build)

   Dans Coolify, allez dans **Environment Variables** et ajoutez :
   ```
   VITE_SUPABASE_URL=https://juqesotdxzoilmpeelgl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cWVzb3RkeHpvaWxtcGVlbGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODM4NTcsImV4cCI6MjA3Nzk1OTg1N30.LTVRUggT-Pb93KKBIJmTtIpAdhk92vD-0qdMjNWtMOQ
   ```

   ⚠️ **Important** : Ces variables doivent être définies comme **"Build Time Variables"** dans Coolify, pas "Runtime Variables" !

5. **Domaine**
   - Ajoutez votre domaine : `jarvis.hevolife.fr`
   - Activez HTTPS/SSL

6. **Déployez !**

### ⚠️ NE PAS utiliser Docker Compose

Le fichier `docker-compose.yml` déploie PostgreSQL + Backend, mais vous n'en avez pas besoin puisque vous utilisez Supabase.

---

## Option Alternative : Déploiement avec Docker Compose (Non recommandé)

Cette méthode déploie tout (PostgreSQL, Backend, Frontend) en une seule fois.

### Étape 1 : Préparer votre repository Git

1. Committez tous les fichiers du projet
2. Poussez sur votre repository Git (GitHub, GitLab, etc.)

### Étape 2 : Dans Coolify

1. Allez dans **"Projects"** ou **"Applications"**
2. Cliquez sur **"+ New"** ou **"Add New"**
3. Sélectionnez **"Docker Compose"** ou **"Service"**
4. Connectez votre repository Git

### Étape 3 : Configuration

1. **Détection automatique** : Coolify devrait détecter le fichier `docker-compose.yml`

2. **Variables d'environnement** à ajouter :
   ```
   DB_PASSWORD=votre_mot_de_passe_securise
   JWT_SECRET=votre_secret_jwt_64_caracteres
   FRONTEND_URL=https://votre-domaine.com
   API_URL=/api
   ```

3. **Générer un JWT_SECRET sécurisé** :
   ```bash
   # Sur votre machine locale :
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Étape 4 : Initialiser la base de données

Après le premier déploiement, vous devez :

1. **Se connecter à PostgreSQL** :
   - Dans Coolify, trouvez votre service `db`
   - Cliquez sur "Terminal" ou "Execute Command"
   - Exécutez : `psql -U insectelim_user -d insectelim`

2. **Appliquer les migrations** :
   Copiez-collez le contenu de chaque fichier dans l'ordre :
   - `supabase/migrations/20251106002338_create_insectelim_tables.sql`
   - `supabase/migrations/20251106004415_add_logo_to_hero_section.sql`
   - `supabase/migrations/20251106005817_add_delete_policy_contact_messages.sql`
   - `supabase/migrations/20251106011439_add_service_details_and_pricing.sql`

3. **Créer le premier utilisateur admin** :
   ```sql
   INSERT INTO admin_users (email, password_hash)
   VALUES ('admin@insectelim.fr', crypt('VotreMotDePasse123', gen_salt('bf')));
   ```

### Étape 5 : Configurer le domaine

1. Dans Coolify, allez dans votre application
2. Section **"Domains"**
3. Ajoutez votre domaine : `votre-domaine.com`
4. Activez **HTTPS/SSL**
5. Coolify configurera automatiquement Let's Encrypt

### Étape 6 : Vérifier le déploiement

1. Visitez `https://votre-domaine.com`
2. Allez sur `https://votre-domaine.com/admin`
3. Connectez-vous avec les identifiants créés

---

## Option 2 : Déploiement séparé (Si Docker Compose ne fonctionne pas)

### Étape 1 : Créer une base de données externe

Utilisez un service PostgreSQL hébergé :
- **Supabase** (gratuit) : https://supabase.com
- **Neon** (gratuit) : https://neon.tech
- **Railway** : https://railway.app
- **ElephantSQL** : https://www.elephantsql.com

Récupérez l'URL de connexion : `postgresql://user:pass@host:port/db`

### Étape 2 : Déployer le Backend

1. Dans Coolify : **"+ New"** → **"Application"**
2. Connectez votre repository
3. **Configuration** :
   - Build Path: `/server`
   - Dockerfile: `/server/Dockerfile`
   - Port: `3000`

4. **Variables d'environnement** :
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=votre_secret_jwt_64_caracteres
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://votre-domaine-frontend.com
   ```

5. Ajoutez un domaine : `api.votre-domaine.com`

### Étape 3 : Déployer le Frontend

1. Dans Coolify : **"+ New"** → **"Application"**
2. Connectez le même repository
3. **Configuration** :
   - Build Path: `/`
   - Dockerfile: `/Dockerfile`
   - Port: `80`

4. **Variables d'environnement** :
   ```
   VITE_API_URL=https://api.votre-domaine.com/api
   ```

5. Ajoutez un domaine : `votre-domaine.com`

---

## Dépannage

### "Cannot connect to database"
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que le service PostgreSQL est démarré
- Testez la connexion depuis le terminal du backend

### "CORS error" dans le navigateur
- Vérifiez que `FRONTEND_URL` dans le backend correspond au domaine frontend
- Vérifiez que `VITE_API_URL` dans le frontend correspond au domaine backend
- Redéployez après modification des variables

### "Invalid token" lors de la connexion
- Vérifiez que `JWT_SECRET` est identique entre les redéploiements
- Ne changez jamais le `JWT_SECRET` après création, sinon tous les tokens deviennent invalides

### Le frontend affiche une page blanche
- Vérifiez les logs : probablement une erreur API
- Ouvrez la console du navigateur (F12)
- Vérifiez que l'API est accessible : `https://votre-domaine.com/api/health`

---

## Architecture finale

```
┌─────────────────────────────┐
│   votre-domaine.com         │
│   (Frontend - Nginx)        │
│   Port 80                   │
└──────────┬──────────────────┘
           │
           │ /api → proxy vers backend
           │
┌──────────▼──────────────────┐
│   Backend (Express)         │
│   Port 3000                 │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│   PostgreSQL                │
│   Port 5432                 │
└─────────────────────────────┘
```

---

## 🔧 Résoudre le 404 sur /admin

### Diagnostic

Le problème : votre application React utilise du routage côté client (SPA), mais le serveur ne redirige pas toutes les routes vers `index.html`.

Quand vous allez sur `/admin`, le serveur cherche un fichier `/admin.html` qui n'existe pas, d'où le 404.

### Solution 1 : Utiliser le Dockerfile (Recommandé)

Votre projet a déjà un `Dockerfile` et `nginx.conf` correctement configurés !

**Dans Coolify :**

1. Créez une nouvelle application
2. Type : **"Dockerfile"** (pas "Static Site")
3. Dockerfile path : `./Dockerfile`
4. Port : **80**
5. Variables d'environnement :
   ```
   VITE_SUPABASE_URL=https://supabase.hevolife.fr
   VITE_SUPABASE_ANON_KEY=votre-anon-key
   ```
6. Déployez !

Le `nginx.conf` contient déjà `try_files $uri $uri/ /index.html;` qui gère les routes SPA.

### Solution 2 : Ajouter une configuration Nginx personnalisée

Si vous ne pouvez pas utiliser Docker, ajoutez ceci dans Coolify :

**Settings → Custom Nginx Configuration** :

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Solution 3 : Vérifier le fichier _redirects

Le fichier `public/_redirects` existe déjà :
```
/*    /index.html   200
```

Ce fichier est automatiquement copié dans le dossier `dist/` lors du build et fonctionne avec certains hébergeurs (Netlify, Vercel, etc.).

Pour Coolify, assurez-vous qu'il est bien présent dans le dossier de build.

### Tester localement

```bash
# Build
npm run build

# Test avec Docker
docker build -t insectelim .
docker run -p 8080:80 insectelim

# Testez les routes
curl -I http://localhost:8080/
curl -I http://localhost:8080/admin
curl -I http://localhost:8080/any-route

# Toutes devraient retourner 200
```

### Checklist de déploiement

- [ ] Type d'application : **Dockerfile** (pas Static Site)
- [ ] Port configuré : **80**
- [ ] Variables `VITE_*` définies **avant le build**
- [ ] `nginx.conf` contient `try_files $uri $uri/ /index.html;`
- [ ] `public/_redirects` existe
- [ ] Logs de déploiement : pas d'erreurs
- [ ] Test manuel : `curl -I https://jarvis.hevolife.fr/admin` retourne 200

---

## Commandes utiles

### Générer un mot de passe sécurisé
```bash
openssl rand -base64 32
```

### Générer un JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Se connecter à PostgreSQL
```bash
psql "postgresql://user:password@host:port/database"
```

### Voir les tables
```sql
\dt
```

### Voir les utilisateurs admin
```sql
SELECT id, email, created_at FROM admin_users;
```

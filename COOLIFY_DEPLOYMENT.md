# Guide de déploiement simplifié sur Coolify

## Option 1 : Déploiement avec Docker Compose (Recommandé)

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

# Guide de déploiement sur Coolify avec PostgreSQL

Ce guide explique comment déployer l'application INSECTELIM sur Coolify avec une base de données PostgreSQL.

## Prérequis

- Compte Coolify configuré
- Repository Git avec le code
- Accès à l'interface Coolify

## Étape 1 : Créer la base de données PostgreSQL

1. **Dans Coolify** : Allez dans "Databases"
2. Cliquez sur **"Add Database"**
3. Sélectionnez **PostgreSQL**
4. Nom de la base : `insectelim-db`
5. Notez l'URL de connexion fournie (format : `postgresql://user:password@host:port/database`)

## Étape 2 : Appliquer les migrations

Connectez-vous à votre base PostgreSQL et exécutez les migrations dans l'ordre :

```bash
# Via psql
psql "votre-database-url"

# Puis exécutez chaque fichier
\i supabase/migrations/20251106002338_create_insectelim_tables.sql
\i supabase/migrations/20251106004415_add_logo_to_hero_section.sql
\i supabase/migrations/20251106005817_add_delete_policy_contact_messages.sql
\i supabase/migrations/20251106011439_add_service_details_and_pricing.sql
```

## Étape 3 : Créer le premier utilisateur admin

```sql
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@insectelim.fr', crypt('VotreMotDePasseSecurise', gen_salt('bf')));
```

## Étape 4 : Déployer le Backend

1. **Dans Coolify** : Allez dans "Applications"
2. Cliquez sur **"Add Application"**
3. Connectez votre repository Git
4. **Configuration Backend** :
   - Base Directory: `/server`
   - Dockerfile Path: `/server/Dockerfile`
   - Port: `3000`

5. **Variables d'environnement Backend** :
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=generer-une-cle-secrete-aleatoire-longue
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://votre-domaine-frontend.com
   ```

6. Cliquez sur **Deploy**

## Étape 5 : Déployer le Frontend

1. **Dans Coolify** : Créez une nouvelle application
2. Connectez le même repository Git
3. **Configuration Frontend** :
   - Build Pack: Dockerfile
   - Dockerfile Path: `/Dockerfile`
   - Port: `80`

4. **Variables d'environnement Frontend** :
   ```
   VITE_API_URL=https://votre-domaine-backend.com/api
   ```

5. Cliquez sur **Deploy**

## Étape 6 : Configuration des domaines

1. **Backend** :
   - Ajoutez un domaine : `api.votre-domaine.com`
   - Activez HTTPS/SSL

2. **Frontend** :
   - Ajoutez un domaine : `votre-domaine.com`
   - Activez HTTPS/SSL

3. **Mettez à jour les variables d'environnement** :
   - Dans le backend, changez `FRONTEND_URL` avec le vrai domaine
   - Dans le frontend, changez `VITE_API_URL` avec le vrai domaine backend
   - Redéployez les deux applications

## Étape 7 : Vérification

1. Visitez `https://votre-domaine.com`
2. Allez sur `/admin`
3. Connectez-vous avec les identifiants créés à l'Étape 3
4. Vérifiez que toutes les fonctionnalités marchent :
   - Création/édition de services
   - Création/édition d'articles de blog
   - Réception des messages de contact
   - Modification des paramètres du site

## Architecture de l'application

```
┌─────────────────┐
│   Frontend      │
│   (Nginx)       │ ← https://votre-domaine.com
│   Port 80       │
└────────┬────────┘
         │
         │ /api → proxy
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │ ← https://api.votre-domaine.com
│   Port 3000     │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  PostgreSQL     │
│  Database       │
└─────────────────┘
```

## Sécurité

- **JWT_SECRET** : Utilisez une clé aléatoire forte (minimum 32 caractères)
- **Passwords** : Tous les mots de passe sont hashés avec bcrypt
- **HTTPS** : Activez SSL/TLS pour tous les domaines
- **CORS** : Configuré pour accepter uniquement le domaine frontend

## Commandes utiles

### Générer un JWT_SECRET sécurisé
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Se connecter à la base de données
```bash
psql "votre-database-url"
```

### Voir les logs dans Coolify
- Allez dans votre application
- Cliquez sur "Logs"
- Surveillez les erreurs et les avertissements

## Dépannage

### Le frontend ne se connecte pas au backend
- Vérifiez que `VITE_API_URL` pointe vers le bon domaine backend
- Vérifiez que CORS est correctement configuré
- Regardez les logs du backend

### Erreurs d'authentification
- Vérifiez que `JWT_SECRET` est identique entre les redéploiements
- Vérifiez que l'utilisateur existe dans la table `admin_users`
- Regardez les logs du backend pour les erreurs JWT

### Erreurs de base de données
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que toutes les migrations ont été appliquées
- Testez la connexion avec `psql`

## Support

Pour toute question ou problème, consultez :
- Les logs de Coolify
- La documentation PostgreSQL
- La documentation Express.js

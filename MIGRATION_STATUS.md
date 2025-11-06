# État de la migration Supabase → PostgreSQL + Express

## ✅ Backend créé

Le backend Express est complet avec :
- Authentification JWT
- Tous les endpoints API (services, blog, messages, settings)
- Connection PostgreSQL
- Middleware CORS et sécurité
- Dockerfile pour déploiement

## ⚠️ Frontend - Migration partielle

### Fichiers mis à jour :
- ✅ `src/lib/api.ts` - Nouveau client API créé
- ✅ `src/components/AdminLogin.tsx` - Utilise la nouvelle API
- ✅ `src/components/AdminPanel.tsx` - Logout mis à jour

### Fichiers qui nécessitent une mise à jour :

Tous ces fichiers utilisent encore `supabase` et doivent être migrés pour utiliser `api`:

1. **Components principaux** :
   - `src/components/HeroSection.tsx`
   - `src/components/ServicesSection.tsx`
   - `src/components/ServiceDetail.tsx`
   - `src/components/BlogSection.tsx`
   - `src/components/BlogDetail.tsx`
   - `src/components/ContactSection.tsx`

2. **Components admin** :
   - `src/components/admin/AdminBlog.tsx`
   - `src/components/admin/AdminServices.tsx`
   - `src/components/admin/AdminMessages.tsx`
   - `src/components/admin/AdminSettings.tsx`

## 🔄 Actions nécessaires pour compléter la migration

### Pour chaque fichier frontend :

1. **Remplacer l'import** :
   ```typescript
   // Ancien
   import { supabase } from '../lib/supabase';

   // Nouveau
   import { api } from '../lib/api';
   ```

2. **Mettre à jour les appels** :
   ```typescript
   // Ancien
   const { data } = await supabase.from('services').select('*');

   // Nouveau
   const data = await api.services.getAll();
   ```

3. **Gérer les erreurs** :
   ```typescript
   // Ancien
   const { data, error } = await supabase...
   if (error) { }

   // Nouveau
   try {
     const data = await api...
   } catch (error) {
     console.error(error);
   }
   ```

## 📋 Guide de remplacement rapide

### Services
```typescript
// GET all
supabase.from('services').select('*')
→ api.services.getAll()

// GET by ID
supabase.from('services').select('*').eq('id', id).maybeSingle()
→ api.services.getById(id)

// CREATE
supabase.from('services').insert([data])
→ api.services.create(data)

// UPDATE
supabase.from('services').update(data).eq('id', id)
→ api.services.update(id, data)

// DELETE
supabase.from('services').delete().eq('id', id)
→ api.services.delete(id)
```

### Blog Posts
```typescript
// GET all
supabase.from('blog_posts').select('*')
→ api.blog.getAll()

// GET by ID
supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
→ api.blog.getById(id)

// CREATE
supabase.from('blog_posts').insert([data])
→ api.blog.create(data)

// UPDATE
supabase.from('blog_posts').update(data).eq('id', id)
→ api.blog.update(id, data)

// DELETE
supabase.from('blog_posts').delete().eq('id', id)
→ api.blog.delete(id)
```

### Messages
```typescript
// GET all (admin only)
supabase.from('contact_messages').select('*')
→ api.messages.getAll()

// CREATE (public)
supabase.from('contact_messages').insert([data])
→ api.messages.create(data)

// MARK AS READ
supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
→ api.messages.markAsRead(id)

// DELETE
supabase.from('contact_messages').delete().eq('id', id)
→ api.messages.delete(id)
```

### Settings
```typescript
// GET all
supabase.from('site_settings').select('*')
→ api.settings.getAll()

// GET by key
supabase.from('site_settings').select('*').eq('key', key).maybeSingle()
→ api.settings.getByKey(key)

// UPDATE
supabase.from('site_settings').upsert({ key, value })
→ api.settings.update(key, value)
```

## ⚡ Prochaines étapes

1. Mettre à jour tous les composants listés ci-dessus
2. Supprimer `src/lib/supabase.ts`
3. Désinstaller `@supabase/supabase-js` du package.json
4. Tester localement avec le backend Express
5. Déployer sur Coolify

## 🚀 Pour terminer la migration maintenant

Si vous voulez que je termine la migration de tous les fichiers frontend, dites-le moi et je mettrai à jour tous les composants restants.

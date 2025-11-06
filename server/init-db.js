#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données
 * Usage: node init-db.js <DATABASE_URL>
 * Exemple: node init-db.js "postgresql://user:password@localhost:5432/insectelim"
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Erreur: URL de la base de données manquante');
  console.error('');
  console.error('Usage:');
  console.error('  node init-db.js "postgresql://user:password@host:5432/database"');
  console.error('');
  console.error('Ou définir la variable d\'environnement:');
  console.error('  export DATABASE_URL="postgresql://user:password@host:5432/database"');
  console.error('  node init-db.js');
  process.exit(1);
}

async function initDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Connexion à la base de données...');
    await client.connect();
    console.log('✅ Connecté!');

    console.log('📝 Lecture du script SQL...');
    const sqlScript = readFileSync(join(__dirname, 'init-db.sql'), 'utf8');

    console.log('🚀 Exécution du script d\'initialisation...');
    await client.query(sqlScript);

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Base de données initialisée avec succès!');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('👤 Compte admin créé:');
    console.log('   Email: admin@insectelim.fr');
    console.log('   Mot de passe: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
    console.log('');
    console.log('📊 Données par défaut créées:');
    console.log('   - 3 services (Dératisation, Désinsectisation, Désinfection)');
    console.log('   - 1 article de blog');
    console.log('   - Paramètres du site');
    console.log('');
    console.log('🎉 Vous pouvez maintenant démarrer votre application!');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Erreur lors de l\'initialisation:');
    console.error(error.message);
    console.error('');

    if (error.code === 'ENOTFOUND') {
      console.error('💡 Le serveur de base de données est introuvable.');
      console.error('   Vérifiez l\'URL de connexion et que le serveur est accessible.');
    } else if (error.code === '28P01') {
      console.error('💡 Erreur d\'authentification.');
      console.error('   Vérifiez le nom d\'utilisateur et le mot de passe.');
    } else if (error.code === '3D000') {
      console.error('💡 La base de données n\'existe pas.');
      console.error('   Créez d\'abord la base de données.');
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();

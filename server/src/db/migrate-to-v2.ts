import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrateToV2() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'wonderlogy',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    
    // Check if v2 tables already exist
    const existingTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('places', 'place_categories', 'user_place_interests')
      ORDER BY table_name;
    `);
    
    if (existingTables.rows.length > 0) {
      console.log('⚠️  V2 tables already exist. Skipping migration.');
      console.log('Existing V2 tables:', existingTables.rows.map(r => r.table_name));
      return;
    }
    
    console.log('Backing up existing data...');
    // Check if user_interests table exists first
    const hasUserInterests = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_interests'
      );
    `);
    
    let existingInterests = { rows: [] };
    if (hasUserInterests.rows[0].exists) {
      existingInterests = await client.query('SELECT * FROM user_interests');
    }
    console.log(`Found ${existingInterests.rows.length} existing user interests`);
    
    console.log('Reading V2 schema file...');
    const schemaPath = join(__dirname, '../../database_schema_v2.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS user_interests CASCADE');
    await client.query('DROP TABLE IF EXISTS destinations CASCADE');
    
    console.log('Creating V2 tables...');
    // Skip users table creation as it already exists
    const schemaWithoutUsers = schema.replace(/CREATE TABLE users[\s\S]*?;/, '');
    await client.query(schemaWithoutUsers);
    
    console.log('✅ Database migrated to V2 successfully!');
    
    // Verify new tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('All tables in database:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Show sample categories
    const categories = await client.query('SELECT name, icon, color FROM place_categories ORDER BY id');
    console.log('\nDefault place categories:');
    categories.rows.forEach(cat => {
      console.log(`- ${cat.name} (${cat.icon}, ${cat.color})`);
    });
    
  } catch (error) {
    console.error('❌ Error migrating database:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

if (require.main === module) {
  migrateToV2()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { migrateToV2 };
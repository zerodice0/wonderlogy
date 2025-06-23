import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function createTables() {
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
    
    console.log('Reading schema file...');
    const schemaPath = join(__dirname, '../../database_schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    await client.query(schema);
    
    console.log('✅ Tables created successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Created tables:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { createTables };
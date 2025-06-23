import { Client } from 'pg';

async function migrateToV2Clean() {
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
    
    console.log('Creating new V2 tables...');
    
    // Create destinations table (enhanced version)
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        custom_name VARCHAR(255),
        country VARCHAR(100),
        city VARCHAR(100),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        google_place_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create place categories table
    await client.query(`
      CREATE TABLE place_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create places table
    await client.query(`
      CREATE TABLE places (
        id SERIAL PRIMARY KEY,
        destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES place_categories(id),
        name VARCHAR(255) NOT NULL,
        custom_name VARCHAR(255),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        google_place_id VARCHAR(255),
        address TEXT,
        phone VARCHAR(50),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_place_interests table
    await client.query(`
      CREATE TABLE user_place_interests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
        interest_type VARCHAR(50) DEFAULT 'wishlist',
        reason TEXT,
        priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
        visit_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, place_id)
      );
    `);
    
    // Create user_interests table (destination-level)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_interests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        interest_type VARCHAR(50) DEFAULT 'wishlist',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, destination_id, interest_type)
      );
    `);
    
    console.log('Creating indexes...');
    
    // Create new indexes (skip if already exist)
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_destinations_location_v2 ON destinations(latitude, longitude);',
      'CREATE INDEX IF NOT EXISTS idx_destinations_google_place_id ON destinations(google_place_id);',
      'CREATE INDEX IF NOT EXISTS idx_places_destination_id ON places(destination_id);',
      'CREATE INDEX IF NOT EXISTS idx_places_category_id ON places(category_id);',
      'CREATE INDEX IF NOT EXISTS idx_places_location ON places(latitude, longitude);',
      'CREATE INDEX IF NOT EXISTS idx_places_google_place_id ON places(google_place_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_place_interests_user_id ON user_place_interests(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_place_interests_place_id ON user_place_interests(place_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_place_interests_type ON user_place_interests(interest_type);',
      'CREATE INDEX IF NOT EXISTS idx_user_interests_user_id_v2 ON user_interests(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_interests_destination_id_v2 ON user_interests(destination_id);'
    ];
    
    for (const indexSql of indexes) {
      await client.query(indexSql);
    }
    
    console.log('Creating triggers...');
    
    // Create trigger for user_place_interests
    await client.query(`
      CREATE TRIGGER update_user_place_interests_updated_at 
        BEFORE UPDATE ON user_place_interests 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('Inserting default place categories...');
    
    await client.query(`
      INSERT INTO place_categories (name, icon, color) VALUES
      ('카페', 'coffee', '#8B4513'),
      ('음식점', 'restaurant', '#FF6347'),
      ('관광명소', 'landmark', '#4682B4'),
      ('유원지', 'amusement', '#FF69B4'),
      ('숙박', 'hotel', '#32CD32'),
      ('쇼핑', 'shopping', '#FFD700'),
      ('문화시설', 'museum', '#9370DB'),
      ('자연', 'nature', '#228B22'),
      ('교통', 'transport', '#696969'),
      ('기타', 'other', '#A9A9A9');
    `);
    
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
  migrateToV2Clean()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { migrateToV2Clean };
-- PostgreSQL Database Schema v2 for Wonderlogy Travel Platform
-- Updated: 2025-06-20
-- Enhanced with places, categories, and custom naming support

-- Create users table (unchanged)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create destinations table (enhanced with custom naming and Google Maps integration)
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Original name from Google Maps
    custom_name VARCHAR(255), -- User customized name
    country VARCHAR(100),
    city VARCHAR(100),
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    google_place_id VARCHAR(255), -- Google Maps Place ID for reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create place categories table
CREATE TABLE place_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- '카페', '음식점', '관광명소', '유원지', '숙박', '쇼핑' 등
    icon VARCHAR(50), -- Icon identifier for UI
    color VARCHAR(20), -- Hex color code for category
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create places table (specific locations within destinations)
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES place_categories(id),
    name VARCHAR(255) NOT NULL, -- Original name from Google Maps
    custom_name VARCHAR(255), -- User customized name
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    google_place_id VARCHAR(255), -- Google Maps Place ID
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_place_interests table (detailed place-level interests)
CREATE TABLE user_place_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    interest_type VARCHAR(50) DEFAULT 'wishlist', -- 'wishlist', 'visited', 'favorite'
    reason TEXT, -- Why user wants to visit this place
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10), -- Priority 1-10
    visit_date DATE, -- Planned or actual visit date
    notes TEXT, -- Additional user notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, place_id) -- One interest record per user per place
);

-- Keep user_interests table for destination-level interests (optional)
CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    interest_type VARCHAR(50) DEFAULT 'wishlist', -- 'wishlist', 'visited', 'favorite'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, destination_id, interest_type)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_destinations_location ON destinations(latitude, longitude);
CREATE INDEX idx_destinations_google_place_id ON destinations(google_place_id);
CREATE INDEX idx_places_destination_id ON places(destination_id);
CREATE INDEX idx_places_category_id ON places(category_id);
CREATE INDEX idx_places_location ON places(latitude, longitude);
CREATE INDEX idx_places_google_place_id ON places(google_place_id);
CREATE INDEX idx_user_place_interests_user_id ON user_place_interests(user_id);
CREATE INDEX idx_user_place_interests_place_id ON user_place_interests(place_id);
CREATE INDEX idx_user_place_interests_type ON user_place_interests(interest_type);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_destination_id ON user_interests(destination_id);

-- Add trigger to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_place_interests_updated_at 
    BEFORE UPDATE ON user_place_interests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default place categories
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
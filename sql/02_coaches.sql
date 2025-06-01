-- Coaches table
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    business_name VARCHAR,
    specializations TEXT[],
    years_experience INTEGER,
    certifications TEXT[],
    timezone VARCHAR DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_coaches_business_name ON coaches(business_name); 
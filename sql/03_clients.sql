-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    coach_id INTEGER NOT NULL REFERENCES coaches(id),
    goals TEXT[],
    preferences JSONB,
    engagement_level VARCHAR DEFAULT 'medium',
    last_session_date TIMESTAMP,
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_coach_id ON clients(coach_id);
CREATE INDEX idx_clients_engagement_level ON clients(engagement_level); 
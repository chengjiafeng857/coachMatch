-- Goals table
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    title VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR,
    target_date TIMESTAMP,
    status VARCHAR DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    milestones JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_goals_client_id ON goals(client_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_target_date ON goals(target_date); 
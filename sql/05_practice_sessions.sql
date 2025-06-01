-- Practice sessions table
CREATE TABLE practice_sessions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    scenario VARCHAR NOT NULL,
    difficulty INTEGER NOT NULL,
    duration INTEGER,
    score NUMERIC(5,2),
    skills_assessed TEXT[],
    conversation JSONB,
    improvements TEXT[],
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_practice_sessions_client_id ON practice_sessions(client_id);
CREATE INDEX idx_practice_sessions_scenario ON practice_sessions(scenario);
CREATE INDEX idx_practice_sessions_difficulty ON practice_sessions(difficulty);
CREATE INDEX idx_practice_sessions_completed_at ON practice_sessions(completed_at); 
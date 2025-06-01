-- Check-ins table
CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    type VARCHAR NOT NULL,
    prompt TEXT,
    response TEXT,
    mood VARCHAR,
    goals TEXT[],
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_check_ins_client_id ON check_ins(client_id);
CREATE INDEX idx_check_ins_type ON check_ins(type);
CREATE INDEX idx_check_ins_mood ON check_ins(mood);
CREATE INDEX idx_check_ins_completed_at ON check_ins(completed_at); 
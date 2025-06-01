-- Feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    source VARCHAR NOT NULL,
    content TEXT NOT NULL,
    original_language VARCHAR DEFAULT 'en',
    translated_content TEXT,
    sentiment VARCHAR,
    sentiment_score NUMERIC(3,2),
    is_anonymous BOOLEAN DEFAULT TRUE,
    submitter_type VARCHAR,
    voice_recording_url TEXT,
    is_reviewed BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    coach_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_feedback_client_id ON feedback(client_id);
CREATE INDEX idx_feedback_source ON feedback(source);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX idx_feedback_is_reviewed ON feedback(is_reviewed); 
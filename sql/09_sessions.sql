-- Sessions table (for Replit Auth)
CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_sessions_expire ON sessions(expire); 
-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER NOT NULL REFERENCES coaches(id),
    type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    message TEXT,
    priority VARCHAR DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    related_client_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_coach_id ON notifications(coach_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_related_client_id ON notifications(related_client_id); 
-- Mock data for MirrorMatchCoaching database

-- Users data
INSERT INTO users (id, email, first_name, last_name, profile_image_url, role, created_at) VALUES
('user1', 'john.doe@example.com', 'John', 'Doe', 'https://example.com/profiles/john.jpg', 'coach', NOW()),
('user2', 'jane.smith@example.com', 'Jane', 'Smith', 'https://example.com/profiles/jane.jpg', 'coach', NOW()),
('user3', 'mike.johnson@example.com', 'Mike', 'Johnson', 'https://example.com/profiles/mike.jpg', 'client', NOW()),
('user4', 'sarah.wilson@example.com', 'Sarah', 'Wilson', 'https://example.com/profiles/sarah.jpg', 'client', NOW()),
('user5', 'david.brown@example.com', 'David', 'Brown', 'https://example.com/profiles/david.jpg', 'client', NOW());

-- Coaches data
INSERT INTO coaches (user_id, business_name, specializations, years_experience, certifications, timezone, created_at) VALUES
('user1', 'Doe Coaching', ARRAY['Dating', 'Communication'], 5, ARRAY['Certified Life Coach', 'Dating Expert'], 'America/New_York', NOW()),
('user2', 'Smith Relationship Coaching', ARRAY['Relationships', 'Personal Growth'], 8, ARRAY['Relationship Coach', 'NLP Practitioner'], 'America/Los_Angeles', NOW());

-- Clients data
INSERT INTO clients (user_id, coach_id, goals, preferences, engagement_level, last_session_date, total_sessions, created_at) VALUES
('user3', 1, ARRAY['Improve dating confidence', 'Better conversation skills'], '{"preferred_time": "evening", "communication_style": "direct"}', 'high', NOW() - INTERVAL '2 days', 5, NOW()),
('user4', 1, ARRAY['Find meaningful relationships', 'Overcome social anxiety'], '{"preferred_time": "morning", "communication_style": "gentle"}', 'medium', NOW() - INTERVAL '5 days', 3, NOW()),
('user5', 2, ARRAY['Build self-esteem', 'Improve dating profile'], '{"preferred_time": "afternoon", "communication_style": "balanced"}', 'high', NOW() - INTERVAL '1 day', 4, NOW());

-- Feedback data
INSERT INTO feedback (client_id, source, content, original_language, sentiment, sentiment_score, is_anonymous, submitter_type, is_reviewed, created_at) VALUES
(1, 'practice_session', 'The conversation flow was much better today', 'en', 'positive', 0.85, false, 'client', true, NOW() - INTERVAL '2 days'),
(1, 'date', 'Felt more confident during the date', 'en', 'positive', 0.90, true, 'date_partner', true, NOW() - INTERVAL '3 days'),
(2, 'practice_session', 'Still struggling with eye contact', 'en', 'neutral', 0.50, false, 'client', false, NOW() - INTERVAL '1 day'),
(3, 'friend', 'Noticed improvement in social interactions', 'en', 'positive', 0.75, true, 'friend', true, NOW() - INTERVAL '4 days'),
(2, 'practice_session', 'Great progress with conversation starters', 'en', 'positive', 0.80, false, 'client', true, NOW() - INTERVAL '2 days');

-- Practice sessions data
INSERT INTO practice_sessions (client_id, scenario, difficulty, duration, score, skills_assessed, conversation, improvements, completed_at, created_at) VALUES
(1, 'First Date Conversation', 3, 30, 8.5, ARRAY['Eye Contact', 'Active Listening'], '{"turns": 15, "topics": ["hobbies", "travel"]}', ARRAY['More engaging questions', 'Better follow-up'], NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(1, 'Rejection Handling', 4, 25, 7.5, ARRAY['Emotional Control', 'Confidence'], '{"turns": 12, "scenarios": ["polite rejection"]}', ARRAY['Stay positive', 'Maintain dignity'], NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(2, 'Small Talk Practice', 2, 20, 9.0, ARRAY['Conversation Starters', 'Body Language'], '{"turns": 10, "topics": ["weather", "current events"]}', ARRAY['More natural flow', 'Better topic transitions'], NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(3, 'Deep Conversation', 4, 35, 8.0, ARRAY['Vulnerability', 'Active Listening'], '{"turns": 18, "topics": ["values", "life goals"]}', ARRAY['More personal stories', 'Better emotional expression'], NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(2, 'Conflict Resolution', 3, 30, 7.0, ARRAY['Communication', 'Problem Solving'], '{"turns": 14, "scenarios": ["disagreement"]}', ARRAY['Stay calm', 'Find common ground'], NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- Check-ins data
INSERT INTO check_ins (client_id, type, prompt, response, mood, goals, completed_at, created_at) VALUES
(1, 'automated', 'How are you feeling about your progress?', 'Feeling more confident in social situations', 'good', ARRAY['Continue practice sessions', 'Apply techniques in real life'], NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(1, 'manual', 'What challenges did you face this week?', 'Still nervous about approaching new people', 'neutral', ARRAY['Work on approach anxiety', 'Practice in low-pressure situations'], NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(2, 'automated', 'Rate your current confidence level', 'Feeling better but still room for improvement', 'good', ARRAY['Build on recent successes', 'Maintain momentum'], NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(3, 'goal_update', 'Progress on your main goals?', 'Making good progress with conversation skills', 'excellent', ARRAY['Continue current practice', 'Try more challenging scenarios'], NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(2, 'automated', 'How was your last practice session?', 'Very helpful, especially the feedback', 'good', ARRAY['Implement feedback', 'Schedule more sessions'], NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- Goals data
INSERT INTO goals (client_id, title, description, category, target_date, status, progress, milestones, created_at) VALUES
(1, 'Improve Dating Confidence', 'Build confidence in dating situations', 'confidence', NOW() + INTERVAL '30 days', 'active', 75, '{"milestones": ["First successful approach", "First date completed"]}', NOW()),
(1, 'Better Conversation Skills', 'Develop engaging conversation techniques', 'communication', NOW() + INTERVAL '45 days', 'active', 60, '{"milestones": ["Master small talk", "Handle deep conversations"]}', NOW()),
(2, 'Overcome Social Anxiety', 'Reduce anxiety in social situations', 'personal_growth', NOW() + INTERVAL '60 days', 'active', 40, '{"milestones": ["Attend social events", "Initiate conversations"]}', NOW()),
(3, 'Build Self-Esteem', 'Develop positive self-image', 'personal_growth', NOW() + INTERVAL '90 days', 'active', 50, '{"milestones": ["Daily affirmations", "Positive self-talk"]}', NOW()),
(2, 'Improve Dating Profile', 'Create an attractive dating profile', 'dating_skills', NOW() + INTERVAL '15 days', 'active', 80, '{"milestones": ["Profile photos", "Bio writing"]}', NOW());

-- Notifications data
INSERT INTO notifications (coach_id, type, title, message, priority, is_read, related_client_id, created_at) VALUES
(1, 'feedback_received', 'New Feedback Received', 'Client Mike submitted new feedback', 'medium', false, 1, NOW() - INTERVAL '2 days'),
(1, 'client_inactive', 'Client Inactivity Alert', 'Sarah hasn''t had a session in 5 days', 'high', false, 2, NOW() - INTERVAL '1 day'),
(2, 'goal_achieved', 'Goal Completed', 'David achieved his conversation skills goal', 'medium', true, 3, NOW() - INTERVAL '3 days'),
(1, 'practice_session', 'New Practice Session', 'Mike completed a new practice session', 'low', false, 1, NOW() - INTERVAL '4 days'),
(2, 'check_in', 'Client Check-in', 'David submitted a weekly check-in', 'medium', false, 3, NOW() - INTERVAL '2 days');

-- Sessions data (for Replit Auth)
INSERT INTO sessions (sid, sess, expire) VALUES
('session1', '{"user": "user1", "role": "coach"}', NOW() + INTERVAL '24 hours'),
('session2', '{"user": "user2", "role": "coach"}', NOW() + INTERVAL '24 hours'),
('session3', '{"user": "user3", "role": "client"}', NOW() + INTERVAL '24 hours'),
('session4', '{"user": "user4", "role": "client"}', NOW() + INTERVAL '24 hours'),
('session5', '{"user": "user5", "role": "client"}', NOW() + INTERVAL '24 hours'); 
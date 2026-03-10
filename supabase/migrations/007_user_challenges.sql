-- Add challenges column to users table (stores onboarding pain point selections)
ALTER TABLE users ADD COLUMN IF NOT EXISTS pain_points text[] DEFAULT '{}';

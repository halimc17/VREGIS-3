-- Add unique constraint to teams.token column
-- This should work since all teams already have unique tokens generated

-- First, let's make the token field not null
ALTER TABLE teams ALTER COLUMN token SET NOT NULL;

-- Then add the unique constraint
ALTER TABLE teams ADD CONSTRAINT teams_token_unique UNIQUE (token);
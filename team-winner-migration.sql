-- Add winner_team_id column to challenges table
ALTER TABLE challenges ADD COLUMN winner_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

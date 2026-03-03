-- Add challenge type (solo vs team)
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'solo' CHECK (type IN ('solo', 'team'));

-- RPC: complete a team challenge for all teammates
CREATE OR REPLACE FUNCTION complete_challenge_for_team(p_challenge_id UUID)
RETURNS void AS $$
DECLARE v_team_id UUID;
BEGIN
  SELECT team_id INTO v_team_id FROM team_members WHERE user_id = auth.uid();
  IF v_team_id IS NULL THEN RAISE EXCEPTION 'User is not in a team'; END IF;
  INSERT INTO challenge_completions (challenge_id, user_id)
  SELECT p_challenge_id, tm.user_id FROM team_members tm WHERE tm.team_id = v_team_id
  ON CONFLICT DO NOTHING;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: uncomplete a team challenge for all teammates
CREATE OR REPLACE FUNCTION uncomplete_challenge_for_team(p_challenge_id UUID)
RETURNS void AS $$
DECLARE v_team_id UUID;
BEGIN
  SELECT team_id INTO v_team_id FROM team_members WHERE user_id = auth.uid();
  IF v_team_id IS NULL THEN RAISE EXCEPTION 'User is not in a team'; END IF;
  DELETE FROM challenge_completions
  WHERE challenge_id = p_challenge_id
  AND user_id IN (SELECT user_id FROM team_members WHERE team_id = v_team_id);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

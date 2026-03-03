-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Places: admin can update/delete any
DROP POLICY IF EXISTS "Users can update own places" ON places;
CREATE POLICY "Users can update own places or admin" ON places
  FOR UPDATE TO authenticated USING (auth.uid() = added_by OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own places" ON places;
CREATE POLICY "Users can delete own places or admin" ON places
  FOR DELETE TO authenticated USING (auth.uid() = added_by OR public.is_admin());

-- Challenges: admin can update/delete any
DROP POLICY IF EXISTS "Users can update own challenges" ON challenges;
CREATE POLICY "Users can update own challenges or admin" ON challenges
  FOR UPDATE TO authenticated USING (auth.uid() = created_by OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own challenges" ON challenges;
CREATE POLICY "Users can delete own challenges or admin" ON challenges
  FOR DELETE TO authenticated USING (auth.uid() = created_by OR public.is_admin());

-- Challenge completions: admin can delete any
DROP POLICY IF EXISTS "Users can remove own completions" ON challenge_completions;
CREATE POLICY "Users can remove own completions or admin" ON challenge_completions
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- Photos: admin can delete any
DROP POLICY IF EXISTS "Users can delete own photos" ON photos;
CREATE POLICY "Users can delete own photos or admin" ON photos
  FOR DELETE TO authenticated USING (auth.uid() = uploaded_by OR public.is_admin());

-- Proposals: admin can update/delete any
DROP POLICY IF EXISTS "Users can update own proposals" ON proposals;
CREATE POLICY "Users can update own proposals or admin" ON proposals
  FOR UPDATE TO authenticated USING (auth.uid() = proposed_by OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own proposals" ON proposals;
CREATE POLICY "Users can delete own proposals or admin" ON proposals
  FOR DELETE TO authenticated USING (auth.uid() = proposed_by OR public.is_admin());

-- Place votes: admin can delete any
DROP POLICY IF EXISTS "Users can remove own votes" ON place_votes;
CREATE POLICY "Users can remove own votes or admin" ON place_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- Proposal votes: admin can delete/update any
DROP POLICY IF EXISTS "Users can change own votes" ON proposal_votes;
CREATE POLICY "Users can change own votes or admin" ON proposal_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can remove own votes on proposals" ON proposal_votes;
CREATE POLICY "Users can remove own votes on proposals or admin" ON proposal_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

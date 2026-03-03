-- Bulgaria 2026 Road Trip - Supabase Database Migration
-- Run this in Supabase SQL Editor to set up all tables

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Places to visit
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Place votes (one per user per place)
CREATE TABLE place_votes (
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, user_id)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  points INT DEFAULT 10,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge completions
CREATE TABLE challenge_completions (
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  proof_url TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (challenge_id, user_id)
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  proposed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal votes (upvote +1 / downvote -1)
CREATE TABLE proposal_votes (
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote INT CHECK (vote IN (-1, 1)),
  PRIMARY KEY (proposal_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone authenticated can read, users can insert/update their own
-- Profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Places
CREATE POLICY "Places are viewable by authenticated users" ON places
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can add places" ON places
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = added_by);
CREATE POLICY "Users can update own places" ON places
  FOR UPDATE TO authenticated USING (auth.uid() = added_by);
CREATE POLICY "Users can delete own places" ON places
  FOR DELETE TO authenticated USING (auth.uid() = added_by);

-- Place votes
CREATE POLICY "Place votes are viewable by authenticated users" ON place_votes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can vote" ON place_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own votes" ON place_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Challenges
CREATE POLICY "Challenges are viewable by authenticated users" ON challenges
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can add challenges" ON challenges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own challenges" ON challenges
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own challenges" ON challenges
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Challenge completions
CREATE POLICY "Completions are viewable by authenticated users" ON challenge_completions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can complete challenges" ON challenge_completions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own completions" ON challenge_completions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Photos
CREATE POLICY "Photos are viewable by authenticated users" ON photos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can upload photos" ON photos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own photos" ON photos
  FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);

-- Proposals
CREATE POLICY "Proposals are viewable by authenticated users" ON proposals
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can add proposals" ON proposals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = proposed_by);
CREATE POLICY "Users can update own proposals" ON proposals
  FOR UPDATE TO authenticated USING (auth.uid() = proposed_by);
CREATE POLICY "Users can delete own proposals" ON proposals
  FOR DELETE TO authenticated USING (auth.uid() = proposed_by);

-- Proposal votes
CREATE POLICY "Proposal votes are viewable by authenticated users" ON proposal_votes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can vote on proposals" ON proposal_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change own votes" ON proposal_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can remove own votes on proposals" ON proposal_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

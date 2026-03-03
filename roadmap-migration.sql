-- Add href column to places
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS href TEXT;

-- Roadmap stops table
CREATE TABLE IF NOT EXISTS public.roadmap_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  day INT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '📍',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read roadmap stops"
  ON public.roadmap_stops FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert roadmap stops"
  ON public.roadmap_stops FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update roadmap stops"
  ON public.roadmap_stops FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete roadmap stops"
  ON public.roadmap_stops FOR DELETE
  USING (public.is_admin());


-- Add "angle", "hook", and "notes" text columns to the "assets" table for enhanced tagging/metadata.
ALTER TABLE public.assets
  ADD COLUMN angle TEXT,
  ADD COLUMN hook TEXT,
  ADD COLUMN notes TEXT;

-- (Optional, but best practice for search/filtering) Create a GIN index on tags.
CREATE INDEX IF NOT EXISTS idx_assets_tags ON public.assets USING gin (tags);

-- No changes to RLS needed; standard policy still applies.

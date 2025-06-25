
-- Add a comment column to the activity_log table for admin SOC-2 annotations
ALTER TABLE public.activity_log
  ADD COLUMN comment TEXT;

-- Optional: Add a comment to the new column
COMMENT ON COLUMN public.activity_log.comment IS 'Admin/manager comment or annotation for compliance or SOC-2 traceability.';

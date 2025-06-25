
-- Add 'buyer' and 'creator' roles to the existing app_role type
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'buyer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'creator';

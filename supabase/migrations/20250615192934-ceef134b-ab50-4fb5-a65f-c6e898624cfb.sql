
-- 1. Ensure your user profile is linked to your account and is admin.
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'gavin@bourdain.co.uk';

-- 2. (Optional) If you want, create restrictive policies so only admins can update or delete others (not strictly required until you need to block non-admins via RLS).

-- Currently, no RLS set on table "profiles" -- all access is possible.
-- If you want ONLY admins to be able to update/delete other profiles for the same account, you can let me know and I will add policies for that after!

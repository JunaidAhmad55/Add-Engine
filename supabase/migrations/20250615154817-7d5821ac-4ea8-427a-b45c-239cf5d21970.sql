
-- 1. Create the accounts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'accounts'
  ) THEN
    CREATE TABLE public.accounts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      plan_type text NOT NULL DEFAULT 'free',
      seat_limit integer NOT NULL DEFAULT 10,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );
  END IF;
END$$;

-- 2. Add account_id to profiles if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='profiles' AND column_name='account_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN account_id uuid;
  END IF;
END$$;

-- 3. Insert a default account if none exists
INSERT INTO public.accounts (name, plan_type, seat_limit, created_at, updated_at)
SELECT 'Default Account', 'free', 10, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.accounts);

-- 4. Assign all profiles to the first found account (or the default)
UPDATE public.profiles
SET account_id = (SELECT id FROM public.accounts LIMIT 1)
WHERE account_id IS NULL;


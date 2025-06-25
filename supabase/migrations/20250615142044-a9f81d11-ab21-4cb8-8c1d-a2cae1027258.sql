
-- This function is triggered when a new user signs up.
-- It's being updated to create a personal team for the new user and assign them as an admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_team_id UUID;
  user_full_name TEXT;
BEGIN
  -- Determine the name to use for the team and profile from user metadata or email
  user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.email);

  -- Create a new team for the user
  INSERT INTO public.teams (name, type)
  VALUES (user_full_name || '''s Team', 'personal')
  RETURNING id INTO new_team_id;

  -- Create the user's profile and link it to the new team.
  -- The creator of the team is automatically made an 'admin'.
  INSERT INTO public.profiles (id, email, full_name, team_id, role)
  VALUES (
    new.id,
    new.email,
    user_full_name,
    new_team_id,
    'admin'
  );
  RETURN new;
END;
$function$;

-- This is a one-time script to fix existing users.
-- It finds any users without a team, creates a personal team for them,
-- and assigns them to it as an admin.
DO $$
DECLARE
    user_profile RECORD;
    new_team_id UUID;
BEGIN
    FOR user_profile IN
        SELECT id, full_name, email FROM public.profiles WHERE team_id IS NULL
    LOOP
        -- Create a new team for the user
        INSERT INTO public.teams (name, type)
        VALUES (
            COALESCE(user_profile.full_name, user_profile.email) || '''s Team',
            'personal'
        ) RETURNING id INTO new_team_id;

        -- Update the user's profile with the new team_id and set their role to 'admin'
        UPDATE public.profiles
        SET
            team_id = new_team_id,
            role = 'admin'
        WHERE id = user_profile.id;
    END LOOP;
END $$;

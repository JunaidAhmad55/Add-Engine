
-- This migration updates the handle_new_user function to support team invitations.
-- When a new user signs up, it checks for a 'team_id' and 'role' in their metadata.
-- If found, it adds them to the specified team.
-- Otherwise, it creates a new personal team for them, preserving the original signup flow.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    user_full_name TEXT;
    invited_team_id UUID;
    invited_role app_role;
    new_team_id UUID;
BEGIN
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.email);

    -- Attempt to extract invitation details from user metadata
    BEGIN
        invited_team_id := (new.raw_user_meta_data->>'team_id')::UUID;
        -- The role can also be passed during invitation
        invited_role := (new.raw_user_meta_data->>'role')::app_role;
    EXCEPTION
        -- If metadata is missing or invalid, treat as a direct signup
        WHEN invalid_text_representation THEN
            invited_team_id := NULL;
            invited_role := NULL;
    END;

    -- If user was invited to a team, add them to that team
    IF invited_team_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, full_name, team_id, role)
        VALUES (new.id, new.email, user_full_name, invited_team_id, COALESCE(invited_role, 'user'));
    ELSE
        -- Otherwise, create a new personal team for the user
        INSERT INTO public.teams (name, type)
        VALUES (user_full_name || '''s Team', 'personal')
        RETURNING id INTO new_team_id;

        -- And create their profile as an admin of that new team
        INSERT INTO public.profiles (id, email, full_name, team_id, role)
        VALUES (new.id, new.email, user_full_name, new_team_id, 'admin');
    END IF;

    RETURN new;
END;
$function$

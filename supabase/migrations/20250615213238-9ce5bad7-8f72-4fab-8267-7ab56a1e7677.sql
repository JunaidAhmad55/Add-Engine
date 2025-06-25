
-- Table to securely store Meta Ads API access/refresh tokens by user/team
create table if not exists public.meta_oauth_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  token_type text,
  expires_at timestamptz, -- UTC expiry
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable row-level security
alter table public.meta_oauth_tokens enable row level security;

-- Allow users to insert their own tokens (WITH CHECK only for INSERT)
create policy "insert_own_meta_tokens" on public.meta_oauth_tokens
  for insert
  with check (auth.uid() = user_id);

-- Allow users to select (read) their own tokens
create policy "select_own_meta_tokens" on public.meta_oauth_tokens
  for select using (auth.uid() = user_id);

-- Allow updates only by the owner
create policy "update_own_meta_tokens" on public.meta_oauth_tokens
  for update using (auth.uid() = user_id);

-- Allow deletes only by the owner
create policy "delete_own_meta_tokens" on public.meta_oauth_tokens
  for delete using (auth.uid() = user_id);

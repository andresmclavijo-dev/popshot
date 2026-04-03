-- Entitlements table for Popshot Pro
-- Run this in the Supabase SQL editor for project rumhoaslghadluqhlwzr

create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product text not null,
  plan text not null,
  status text not null default 'active',
  created_at timestamptz default now()
);

alter table entitlements enable row level security;

create policy "Users can read own entitlements"
  on entitlements for select
  using (auth.uid() = user_id);

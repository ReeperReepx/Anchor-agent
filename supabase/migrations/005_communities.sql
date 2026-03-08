-- Communities
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  is_public boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  member_count int not null default 1,
  created_at timestamptz not null default now()
);

-- Community members (create before communities RLS policies that reference it)
create table public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  unique(community_id, user_id)
);

-- Partner queue
create table if not exists public.partner_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  selected_days text[] not null,
  status text not null default 'waiting' check (status in ('waiting', 'matched')),
  joined_at timestamptz not null default now()
);

-- RLS: communities
alter table public.communities enable row level security;

create policy "Anyone can view public communities"
  on public.communities for select
  using (is_public = true);

create policy "Members can view private communities"
  on public.communities for select
  using (
    id in (select public.get_user_community_ids(auth.uid()))
  );

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.uid() = created_by);

create policy "Creator can update community"
  on public.communities for update
  using (auth.uid() = created_by);

-- Helper function to break RLS recursion on community_members
create or replace function public.get_user_community_ids(uid uuid)
returns setof uuid
language sql
security definer
set search_path = ''
as $$
  select community_id from public.community_members where user_id = uid;
$$;

-- RLS: community_members
alter table public.community_members enable row level security;

create policy "Members can view other members"
  on public.community_members for select
  using (
    community_id in (select public.get_user_community_ids(auth.uid()))
  );

create policy "Users can join communities"
  on public.community_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave communities"
  on public.community_members for delete
  using (auth.uid() = user_id);

-- RLS: partner_queue
alter table public.partner_queue enable row level security;

create policy "Users can manage own queue entry"
  on public.partner_queue for all
  using (auth.uid() = user_id);

-- Indexes
create index idx_community_members_user on public.community_members(user_id);
create index idx_community_members_community on public.community_members(community_id);
create index idx_partner_queue_status on public.partner_queue(status);

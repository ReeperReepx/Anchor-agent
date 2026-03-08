-- Communities
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_public boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  member_count int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.communities enable row level security;

create policy "Anyone can view public communities"
  on public.communities for select
  using (is_public = true);

create policy "Members can view private communities"
  on public.communities for select
  using (
    exists (
      select 1 from public.community_members
      where community_id = communities.id
        and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.uid() = created_by);

create policy "Creator can update community"
  on public.communities for update
  using (auth.uid() = created_by);

-- Community members
create table public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz not null default now(),
  unique(community_id, user_id)
);

alter table public.community_members enable row level security;

create policy "Members can view other members"
  on public.community_members for select
  using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_members.community_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Users can join communities"
  on public.community_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave communities"
  on public.community_members for delete
  using (auth.uid() = user_id);

-- Partner queue
create table if not exists public.partner_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  selected_days text[] not null,
  status text not null default 'waiting' check (status in ('waiting', 'matched')),
  joined_at timestamptz not null default now()
);

alter table public.partner_queue enable row level security;

create policy "Users can manage own queue entry"
  on public.partner_queue for all
  using (auth.uid() = user_id);

-- Indexes
create index idx_community_members_user on public.community_members(user_id);
create index idx_community_members_community on public.community_members(community_id);
create index idx_partner_queue_status on public.partner_queue(status);

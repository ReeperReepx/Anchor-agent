-- Users table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  timezone text,
  standup_time text,
  goal_categories text[] default '{}',
  preference text check (preference in ('solo', 'shared', 'both')),
  accountability_style text check (accountability_style in ('gentle', 'direct', 'drill')),
  onboarded_at timestamptz,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Standups table
create table public.standups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('daily', 'weekly')),
  date date not null default current_date,
  transcript text,
  audio_url text,
  duration_seconds integer,
  done_summary text,
  planned_summary text,
  blockers_summary text,
  created_at timestamptz default now()
);

alter table public.standups enable row level security;

create policy "Users can read own standups"
  on public.standups for select
  using (auth.uid() = user_id);

create policy "Users can insert own standups"
  on public.standups for insert
  with check (auth.uid() = user_id);

create policy "Users can update own standups"
  on public.standups for update
  using (auth.uid() = user_id);

create index idx_standups_user_date on public.standups(user_id, date desc);

-- Matches table
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.users(id) on delete cascade,
  user_b_id uuid references public.users(id) on delete cascade,
  goal_category text not null,
  week_of date not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'ended')),
  matched_at timestamptz,
  created_at timestamptz default now()
);

alter table public.matches enable row level security;

create policy "Users can read own matches"
  on public.matches for select
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "Users can insert matches"
  on public.matches for insert
  with check (auth.uid() = user_a_id);

create policy "Users can update own matches"
  on public.matches for update
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create index idx_matches_week on public.matches(week_of, status);

-- Streaks table
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_standup_date date
);

alter table public.streaks enable row level security;

create policy "Users can read own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users can upsert own streak"
  on public.streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.streaks for update
  using (auth.uid() = user_id);

-- Subscriptions table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text not null check (tier in ('standard', 'premium')),
  status text not null default 'trialing' check (status in ('trialing', 'active', 'canceled', 'expired')),
  trial_ends_at timestamptz,
  current_period_end timestamptz
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Messages table (partner chat)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users can read messages in own matches"
  on public.messages for select
  using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
        and (user_a_id = auth.uid() or user_b_id = auth.uid())
    )
  );

create policy "Users can send messages in own matches"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where matches.id = match_id
        and status = 'active'
        and (user_a_id = auth.uid() or user_b_id = auth.uid())
    )
  );

create index idx_messages_match on public.messages(match_id, created_at);

-- Weekly summaries (LLM-generated from daily standups)
create table public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_of date not null,
  summary text not null,
  standup_count integer not null default 0,
  created_at timestamptz default now(),
  unique (user_id, week_of)
);

alter table public.weekly_summaries enable row level security;

create policy "Users can read own summaries"
  on public.weekly_summaries for select
  using (auth.uid() = user_id);

create policy "Users can insert own summaries"
  on public.weekly_summaries for insert
  with check (auth.uid() = user_id);

create index idx_weekly_summaries_user on public.weekly_summaries(user_id, week_of desc);

-- Partner standup visibility: users in an active match can see partner's standups
create policy "Partners can read matched standups"
  on public.standups for select
  using (
    exists (
      select 1 from public.matches
      where status = 'active'
        and (
          (user_a_id = auth.uid() and user_b_id = standups.user_id)
          or (user_b_id = auth.uid() and user_a_id = standups.user_id)
        )
    )
  );

-- Subscriptions table for Stripe billing
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text not null check (tier in ('builder', 'founder')) default 'builder',
  status text not null check (status in ('trialing', 'active', 'canceled', 'expired')) default 'trialing',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now() not null
);

-- Index for fast lookups
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);

-- RLS
alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

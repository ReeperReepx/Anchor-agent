-- Fix infinite recursion in community_members RLS policies
-- Also restrict community creation to Founder tier
-- Safe to run regardless of current state

-- 1. Create helper function (bypasses RLS to break recursion)
create or replace function public.get_user_community_ids(uid uuid)
returns setof uuid
language sql
security definer
set search_path = ''
as $$
  select community_id from public.community_members where user_id = uid;
$$;

-- 2. Drop old recursive policies
drop policy if exists "Members can view other members" on public.community_members;
drop policy if exists "Members can view private communities" on public.communities;

-- 3. Recreate with non-recursive versions
create policy "Members can view other members"
  on public.community_members for select
  using (
    community_id in (select public.get_user_community_ids(auth.uid()))
  );

create policy "Members can view private communities"
  on public.communities for select
  using (
    id in (select public.get_user_community_ids(auth.uid()))
  );

-- 4. Restrict community creation to Founder tier
drop policy if exists "Authenticated users can create communities" on public.communities;

create policy "Founder tier can create communities"
  on public.communities for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.subscriptions
      where user_id = auth.uid()
        and tier = 'founder'
        and status in ('active', 'trialing')
    )
  );

-- Add productivity score to standups table
alter table public.standups
  add column productivity_score smallint check (productivity_score between 1 and 4),
  add column score_reasoning text;

-- Index for heatmap queries (user + date range + score)
create index idx_standups_user_score on public.standups(user_id, date desc)
  where productivity_score is not null;

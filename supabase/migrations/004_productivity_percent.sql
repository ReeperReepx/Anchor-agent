-- Change productivity_score from 1-4 scale to 0-100 percentage
alter table public.standups
  drop constraint if exists standups_productivity_score_check;

alter table public.standups
  add constraint standups_productivity_score_check
    check (productivity_score between 0 and 100);

-- Migrate existing data: convert 1-4 scale to percentage
update public.standups
  set productivity_score = case
    when productivity_score = 1 then 25
    when productivity_score = 2 then 50
    when productivity_score = 3 then 75
    when productivity_score = 4 then 100
    else productivity_score
  end
  where productivity_score is not null
    and productivity_score between 1 and 4;

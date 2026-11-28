-- All-time visitor counter for droolingcatmeme.com.
-- Run the whole file in the Supabase SQL editor (project jgpolvnqzuvtwahecrcn).
-- Safe to run again. The publishable key is enough. No service-role key in the site.
-- Anon can read the total. Anon cannot write the table. count_visit() adds one.

create table if not exists public.visitor_counter (
  id integer primary key,
  total bigint not null default 0,
  constraint visitor_counter_one_row check (id = 1)
);

insert into public.visitor_counter (id, total)
values (1, 0)
on conflict (id) do nothing;

revoke all on table public.visitor_counter from public, anon, authenticated;
grant select on table public.visitor_counter to anon, authenticated;

alter table public.visitor_counter enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'visitor_counter'
      and policyname = 'visitor_counter_read'
  ) then
    execute $policy$
      create policy visitor_counter_read
        on public.visitor_counter
        for select
        to anon, authenticated
        using (true)
    $policy$;
  end if;
end $$;

create or replace function public.count_visit()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_total bigint;
begin
  update public.visitor_counter
    set total = total + 1
    where id = 1
    returning total into new_total;
  return coalesce(new_total, 0);
end;
$$;

revoke all on function public.count_visit() from public, anon, authenticated;
grant execute on function public.count_visit() to anon, authenticated;

notify pgrst, 'reload schema';

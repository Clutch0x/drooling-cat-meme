-- Run this in the Supabase SQL editor for project jgpolvnqzuvtwahecrcn.
-- Replace REPLACE_WITH_OWNER_EMAIL with the inbox that will receive the magic link.
-- Do not put a service-role key anywhere in the site.

create table if not exists public.moderators (
  email text primary key
);

insert into public.moderators (email)
values ('REPLACE_WITH_OWNER_EMAIL')
on conflict (email) do nothing;

alter table public.moderators enable row level security;
revoke all on table public.moderators from anon, authenticated;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.moderators
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_moderator() from public, anon;
grant execute on function public.is_moderator() to authenticated;

-- Extra policies are OR-ed with the ones already on memes.
-- Public visitors keep seeing only approved rows. A signed-in moderator sees every row.
drop policy if exists memes_moderator_select on public.memes;
create policy memes_moderator_select
  on public.memes
  for select
  to authenticated
  using (public.is_moderator());

drop policy if exists memes_moderator_update on public.memes;
create policy memes_moderator_update
  on public.memes
  for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

drop policy if exists memes_moderator_delete on public.memes;
create policy memes_moderator_delete
  on public.memes
  for delete
  to authenticated
  using (public.is_moderator());

-- Let a moderator remove the file from the memes bucket. Does not widen public access.
drop policy if exists memes_moderator_storage_delete on storage.objects;
create policy memes_moderator_storage_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'memes'
    and public.is_moderator()
  );

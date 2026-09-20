create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  node_id text not null,
  bookmarked boolean not null default false,
  completed boolean not null default false,
  last_visited_at timestamptz not null default now(),
  primary key (user_id, node_id)
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_progress to authenticated;

create policy "users_read_own_profile" on public.profiles
for select to authenticated using ((select auth.uid()) = id);

create policy "users_update_own_profile" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "users_read_own_progress" on public.user_progress
for select to authenticated using ((select auth.uid()) = user_id);

create policy "users_insert_own_progress" on public.user_progress
for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "users_update_own_progress" on public.user_progress
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users_delete_own_progress" on public.user_progress
for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

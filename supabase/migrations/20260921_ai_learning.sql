-- AI mentor interactions and adaptive-learning signals.
-- Applied to the connected Supabase project on 2026-09-21.

create table if not exists public.ai_interactions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  page_context text,
  user_message text not null,
  assistant_message text not null,
  source_ids text[] not null default '{}',
  mode text not null default 'rag-fallback',
  created_at timestamptz not null default now()
);

create table if not exists public.learning_signals (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_key text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  wrong integer not null default 0,
  last_result boolean,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_key)
);

create index if not exists ai_interactions_user_created_idx on public.ai_interactions(user_id, created_at desc);
create index if not exists learning_signals_user_updated_idx on public.learning_signals(user_id, updated_at desc);

alter table public.ai_interactions enable row level security;
alter table public.learning_signals enable row level security;

grant select, insert on public.ai_interactions to authenticated;
grant select, insert, update on public.learning_signals to authenticated;

drop policy if exists "users_read_own_ai_interactions" on public.ai_interactions;
create policy "users_read_own_ai_interactions" on public.ai_interactions
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users_insert_own_ai_interactions" on public.ai_interactions;
create policy "users_insert_own_ai_interactions" on public.ai_interactions
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "users_read_own_learning_signals" on public.learning_signals;
create policy "users_read_own_learning_signals" on public.learning_signals
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users_insert_own_learning_signals" on public.learning_signals;
create policy "users_insert_own_learning_signals" on public.learning_signals
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "users_update_own_learning_signals" on public.learning_signals;
create policy "users_update_own_learning_signals" on public.learning_signals
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- BioScope content model.
-- Applied to the connected Supabase project on 2026-09-20.

create table if not exists public.structures (
  id text primary key,
  parent_id text references public.structures(id) on delete set null,
  slug text not null unique,
  name_zh text not null,
  name_en text,
  category text not null default 'structure',
  scale_label text,
  size_m numeric,
  description text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_cards (
  id bigint generated always as identity primary key,
  structure_id text not null references public.structures(id) on delete cascade,
  title text not null,
  summary text,
  body text,
  card_type text not null default 'overview',
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.papers (
  id bigint generated always as identity primary key,
  doi text unique,
  title text not null,
  journal text,
  publication_year integer,
  url text,
  abstract_summary text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.structure_papers (
  structure_id text not null references public.structures(id) on delete cascade,
  paper_id bigint not null references public.papers(id) on delete cascade,
  relation_note text,
  is_primary boolean not null default false,
  primary key (structure_id, paper_id)
);

create table if not exists public.scientists (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  name_zh text,
  birth_year integer,
  death_year integer,
  bio text,
  avatar_key text,
  created_at timestamptz not null default now()
);

create table if not exists public.discoveries (
  id bigint generated always as identity primary key,
  structure_id text references public.structures(id) on delete set null,
  scientist_id bigint references public.scientists(id) on delete set null,
  title text not null,
  discovery_year integer,
  summary text,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.experiments (
  id text primary key,
  structure_id text not null references public.structures(id) on delete cascade,
  title text not null,
  description text,
  experiment_type text not null default 'simulation',
  config jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiment_variables (
  id bigint generated always as identity primary key,
  experiment_id text not null references public.experiments(id) on delete cascade,
  key text not null,
  label text not null,
  unit text,
  value_type text not null default 'number',
  min_value numeric,
  max_value numeric,
  default_value numeric,
  config jsonb not null default '{}'::jsonb,
  unique (experiment_id, key)
);

create table if not exists public.learning_paths (
  id text primary key,
  title text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_path_nodes (
  learning_path_id text not null references public.learning_paths(id) on delete cascade,
  structure_id text not null references public.structures(id) on delete cascade,
  step_order integer not null,
  primary key (learning_path_id, structure_id),
  unique (learning_path_id, step_order)
);

create index if not exists structures_parent_id_idx on public.structures(parent_id);
create index if not exists knowledge_cards_structure_id_idx on public.knowledge_cards(structure_id);
create index if not exists experiments_structure_id_idx on public.experiments(structure_id);
create index if not exists discoveries_structure_id_idx on public.discoveries(structure_id);

alter table public.structures enable row level security;
alter table public.knowledge_cards enable row level security;
alter table public.papers enable row level security;
alter table public.structure_papers enable row level security;
alter table public.scientists enable row level security;
alter table public.discoveries enable row level security;
alter table public.experiments enable row level security;
alter table public.experiment_variables enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_nodes enable row level security;

grant select on public.structures, public.knowledge_cards, public.papers, public.structure_papers,
  public.scientists, public.discoveries, public.experiments, public.experiment_variables,
  public.learning_paths, public.learning_path_nodes to anon, authenticated;

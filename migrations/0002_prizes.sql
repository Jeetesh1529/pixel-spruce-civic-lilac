-- Player progress and prize claims for The Great Hop (Grasshoppers 60)

create table if not exists player_progress (
  user_id text primary key,
  decades_completed text not null default '[]',
  golden_best_hop integer not null default 0,
  golden_completed boolean not null default false,
  best_score integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists game_runs (
  id serial primary key,
  user_id text not null,
  level_id text not null,
  hops integer not null,
  completed boolean not null default false,
  perfects integer not null default 0,
  score integer not null default 0,
  elapsed_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists game_runs_user_id_idx on game_runs (user_id);

create table if not exists prize_claims (
  id serial primary key,
  user_id text not null,
  prize_tier text not null,
  code text not null unique,
  full_name text not null,
  email text not null,
  phone text,
  shoe_style text,
  shoe_size text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, prize_tier)
);

create index if not exists prize_claims_user_id_idx on prize_claims (user_id);

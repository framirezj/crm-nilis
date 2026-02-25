-- ======================
-- CLIENTS TABLE
-- ======================

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz default now()
);

-- ======================
-- JOBS TABLE
-- ======================

create table jobs (
  id uuid primary key default gen_random_uuid(),

  client_id uuid not null references clients(id) on delete cascade,

  title text not null,
  description text,
  -- precio en CLP sin decimales
  price integer not null check (price >= 0)

  created_at timestamptz default now()
);
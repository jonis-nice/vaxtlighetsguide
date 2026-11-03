-- Växtlighetsguide 4.1 – förslag till relationsschema
-- Kräver granskning och anpassning före produktionssättning.
create table if not exists sources (
  id text primary key,
  title text not null,
  publisher text,
  edition text,
  year text,
  source_type text,
  url text,
  isbn text,
  accessed_at date,
  notes text
);

create table if not exists plants (
  id text primary key,
  swedish_name text not null,
  scientific_name text,
  genus text,
  species text,
  subspecies text,
  cultivar text,
  family text,
  plant_group text,
  record_status text not null default 'needs_sources',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists plant_synonyms (
  id bigserial primary key,
  plant_id text not null references plants(id) on delete cascade,
  synonym text not null,
  synonym_type text
);

create table if not exists plant_claims (
  id text primary key,
  plant_id text not null references plants(id) on delete cascade,
  field_key text not null,
  claim_value jsonb not null,
  unit text,
  scope_note text,
  confidence text not null default 'unreviewed',
  verification_status text not null default 'needs_review',
  verified_by text,
  verified_at date,
  created_at timestamptz default now()
);

create table if not exists claim_sources (
  claim_id text not null references plant_claims(id) on delete cascade,
  source_id text not null references sources(id),
  edition text,
  chapter text,
  printed_page text,
  pdf_page text,
  url text,
  quotation_note text,
  primary key (claim_id, source_id)
);

create table if not exists plant_revisions (
  id bigserial primary key,
  plant_id text not null references plants(id) on delete cascade,
  changed_at timestamptz default now(),
  changed_by text,
  change_summary text not null,
  snapshot jsonb not null
);

create index if not exists plant_claims_plant_field_idx on plant_claims(plant_id, field_key);
create index if not exists claim_sources_source_idx on claim_sources(source_id);

-- Rekommenderade statusvärden:
-- plant record_status: needs_sources | in_review | verified | draft
-- claim verification_status: needs_review | supported | contradicted | outdated
-- confidence: unreviewed | high | medium | low
-- Ett växtporträtt ska inte bli 'verified' om kritiska claims saknar stöd.

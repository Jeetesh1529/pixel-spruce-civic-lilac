-- Leverage prize ladder: cash-out % vs risk the next decade

alter table player_progress add column if not exists current_stage text not null default '1966';
alter table player_progress add column if not exists stake_percent integer not null default 0;
alter table player_progress add column if not exists cashed_percent integer not null default 0;
alter table player_progress add column if not exists cashed_out boolean not null default false;
alter table player_progress add column if not exists pending_decision boolean not null default false;

alter table prize_claims add column if not exists discount_percent integer;

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    birth_date DATE NOT NULL,
    dorsal INTEGER NOT NULL,
    file_number TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS referees (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    collegiate_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY,
    club_name TEXT NOT NULL,
    file_number TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teams_players (
    team_id UUID REFERENCES teams(id),
    player_id UUID REFERENCES players(id),
    PRIMARY KEY (team_id, player_id)
);

INSERT INTO players (id, name, surname, birth_date, dorsal, file_number)
SELECT 
    gen_random_uuid(),
    'Jugador ' || i,
    'Apellido ' || i,
    '1990-01-01'::date + (i || ' days')::interval,
    i,
    'F-' || i
FROM generate_series(1, 600) AS s(i)
ON CONFLICT (file_number) DO NOTHING;

INSERT INTO teams (id, club_name, file_number)
SELECT
    gen_random_uuid(),
    'Club ' || i,
    'T-' || i
FROM generate_series(1, 40) AS s(i)
ON CONFLICT (file_number) DO NOTHING;

INSERT INTO teams_players (team_id, player_id)
SELECT t.id, p.id
FROM (
    SELECT id, row_number() OVER () as rn
    FROM teams
) t
JOIN (
    SELECT id, row_number() OVER () as rn
    FROM (SELECT id FROM players ORDER BY file_number LIMIT 600) p
) p ON (p.rn - 1) / 15 + 1 = t.rn
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL CONSTRAINT chk_tournaments_name_length CHECK (length(name) <= 100),
    description TEXT,
    category TEXT NOT NULL CONSTRAINT chk_tournaments_category_length CHECK (length(category) <= 50),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    max_participants INTEGER NOT NULL CONSTRAINT chk_tournaments_max_participants_positive CHECK (max_participants > 0),
    format TEXT NOT NULL CONSTRAINT chk_tournaments_format_values CHECK (format IN ('Eliminación directa', 'Liga', 'Grupos', 'Mixto')),
    rules TEXT NOT NULL CONSTRAINT chk_tournaments_rules_values CHECK (rules IN ('Partido único', 'Ida y vuelta')),
    status TEXT NOT NULL CONSTRAINT chk_tournaments_status_values CHECK (status IN ('Borrador', 'Inscripción Abierta', 'En Curso', 'Finalizado', 'Cancelado')),
    CONSTRAINT chk_tournaments_dates CHECK (start_date < end_date),
    CONSTRAINT chk_tournaments_knockout_even CHECK (format != 'Eliminación directa' OR max_participants % 2 = 0)
);

CREATE TABLE IF NOT EXISTS tournaments_teams (
    tournament_id UUID REFERENCES tournaments(id),
    team_id UUID REFERENCES teams(id),
    PRIMARY KEY (tournament_id, team_id)
);

CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id),
    local_team_id UUID REFERENCES teams(id),
    visitor_team_id UUID REFERENCES teams(id),
    matchday INTEGER NOT NULL,
    local_score INTEGER,
    visitor_score INTEGER,
    status TEXT NOT NULL CONSTRAINT chk_matches_status CHECK (status IN ('Scheduled', 'Finished', 'Postponed', 'Cancelled')),
    CONSTRAINT chk_different_teams CHECK (local_team_id != visitor_team_id)
);

CREATE TABLE IF NOT EXISTS match_reports (
    id UUID PRIMARY KEY,
    match_id UUID REFERENCES matches(id) NOT NULL,
    referee_id UUID NOT NULL,
    status TEXT NOT NULL CONSTRAINT chk_match_reports_status CHECK (status IN ('Draft', 'Submitted')),
    actual_start_time TIMESTAMPTZ,
    assistant_names TEXT,
    extraordinary_incidents TEXT,
    referee_signature TEXT,
    original_document_url TEXT
);

CREATE TABLE IF NOT EXISTS match_lineups (
    match_id UUID REFERENCES matches(id) NOT NULL,
    team_id UUID REFERENCES teams(id) NOT NULL,
    player_file_number TEXT NOT NULL,
    player_role TEXT NOT NULL CONSTRAINT chk_match_lineups_role CHECK (player_role IN ('Starter', 'Substitute', 'Staff')),
    PRIMARY KEY (match_id, team_id, player_file_number)
);

CREATE TABLE IF NOT EXISTS match_incidents (
    id UUID PRIMARY KEY,
    match_id UUID REFERENCES matches(id) NOT NULL,
    type TEXT NOT NULL CONSTRAINT chk_match_incidents_type CHECK (type IN ('Goal', 'Card', 'Substitution')),
    minute INTEGER NOT NULL,
    player_file_number TEXT,
    team_id UUID REFERENCES teams(id) NOT NULL,
    goal_type TEXT CONSTRAINT chk_match_incidents_goal_type CHECK (goal_type IN ('regular', 'penalty', 'autogol')),
    card_color TEXT CONSTRAINT chk_match_incidents_card_color CHECK (card_color IN ('yellow', 'red')),
    card_reason TEXT,
    player_in_file_number TEXT,
    player_out_file_number TEXT
);

INSERT INTO tournaments (id, name, description, category, start_date, end_date, max_participants, format, rules, status)
VALUES 
    (gen_random_uuid(), 'Liga Regional 2026', 'Liga de 8 equipos con ida y vuelta', 'Senior', '2026-08-01 10:00:00+00', '2026-12-20 22:00:00+00', 8, 'Liga', 'Ida y vuelta', 'Inscripción Abierta'),
    (gen_random_uuid(), 'Copa Eliminatoria', 'Torneo de eliminación directa para 16 equipos', 'Senior', '2026-09-15 09:00:00+00', '2026-10-15 20:00:00+00', 16, 'Eliminación directa', 'Partido único', 'Inscripción Abierta')
ON CONFLICT (id) DO NOTHING;

-- Asociar equipos a la Liga Regional 2026 (8 equipos: T-1 a T-8)
INSERT INTO tournaments_teams (tournament_id, team_id)
SELECT 
    (SELECT id FROM tournaments WHERE name = 'Liga Regional 2026' LIMIT 1),
    id
FROM teams
WHERE file_number IN ('T-1', 'T-2', 'T-3', 'T-4', 'T-5', 'T-6', 'T-7', 'T-8')
ON CONFLICT DO NOTHING;

-- Asociar equipos a la Copa Eliminatoria (16 equipos: T-9 a T-24)
INSERT INTO tournaments_teams (tournament_id, team_id)
SELECT 
    (SELECT id FROM tournaments WHERE name = 'Copa Eliminatoria' LIMIT 1),
    id
FROM teams
WHERE file_number IN ('T-9', 'T-10', 'T-11', 'T-12', 'T-13', 'T-14', 'T-15', 'T-16', 'T-17', 'T-18', 'T-19', 'T-20', 'T-21', 'T-22', 'T-23', 'T-24')
ON CONFLICT DO NOTHING;

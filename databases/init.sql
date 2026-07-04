CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    birth_date DATE NOT NULL,
    dorsal INTEGER NOT NULL,
    file_number TEXT NOT NULL UNIQUE
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
FROM generate_series(1, 300) AS s(i)
ON CONFLICT (file_number) DO NOTHING;

INSERT INTO teams (id, club_name, file_number)
SELECT
    gen_random_uuid(),
    'Club ' || i,
    'T-' || i
FROM generate_series(1, 20) AS s(i)
ON CONFLICT (file_number) DO NOTHING;

INSERT INTO teams_players (team_id, player_id)
SELECT t.id, p.id
FROM (
    SELECT id, row_number() OVER () as rn
    FROM teams
) t
JOIN (
    SELECT id, row_number() OVER () as rn
    FROM (SELECT id FROM players ORDER BY file_number LIMIT 300) p
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

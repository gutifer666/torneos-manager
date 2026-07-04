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

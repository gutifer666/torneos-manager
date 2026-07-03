CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    birth_date DATE NOT NULL,
    dorsal INTEGER NOT NULL,
    file_number TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY,
    club_name TEXT NOT NULL,
    file_number TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams_players (
    team_id UUID REFERENCES teams(id),
    player_id UUID REFERENCES players(id),
    PRIMARY KEY (team_id, player_id)
);

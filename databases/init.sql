CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    birth_date DATE NOT NULL,
    dorsal INTEGER NOT NULL,
    file_number TEXT NOT NULL
);

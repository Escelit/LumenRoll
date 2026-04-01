-- Game storage
CREATE TABLE games (
    game_id BIGINT PRIMARY KEY,
    player_address TEXT NOT NULL,
    bet_amount BIGINT NOT NULL,
    player_guess INT NOT NULL,
    player_commit TEXT NOT NULL,
    house_commit TEXT,
    house_secret TEXT, -- Stored encrypted in production
    status TEXT NOT NULL DEFAULT 'waiting_for_house_commit',
    roll INT,
    won BOOLEAN,
    payout BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexing for history queries
CREATE INDEX idx_games_player ON games(player_address);
CREATE INDEX idx_games_status ON games(status);

-- Global stats
CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    total_games BIGINT DEFAULT 0,
    total_volume BIGINT DEFAULT 0,
    house_profit_loss BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO stats (total_games, total_volume, house_profit_loss) VALUES (0, 0, 0);
-- Game storage
CREATE TABLE games (
    game_id BIGINT PRIMARY KEY,
    player_address TEXT NOT NULL,
    bet_amount BIGINT NOT NULL,
    player_guess INT NOT NULL,
    player_commit TEXT NOT NULL,
    house_commit TEXT,
    house_secret TEXT, -- Stored encrypted in production
    status TEXT NOT NULL DEFAULT 'waiting_for_house_commit',
    roll INT,
    won BOOLEAN,
    payout BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexing for history queries
CREATE INDEX idx_games_player ON games(player_address);
CREATE INDEX idx_games_status ON games(status);

-- Global stats
CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    total_games BIGINT DEFAULT 0,
    total_volume BIGINT DEFAULT 0,
    house_profit_loss BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO stats (total_games, total_volume, house_profit_loss) VALUES (0, 0, 0);
// touch 169
// touch 179

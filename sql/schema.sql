CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS sections (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID,
    ord_id          SERIAL,
    user_id         VARCHAR(128),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    region          TEXT            NOT NULL,
    river           TEXT            NOT NULL,
    section         TEXT            NOT NULL,
    difficulty      SMALLINT        NOT NULL,

    upstream_id     VARCHAR(128),
    upstream_data   JSONB
);

ALTER TABLE sections
ADD CONSTRAINT sections_parent_id FOREIGN KEY (parent_id) REFERENCES sections (id)
ON DELETE SET NULL;

CREATE INDEX sections_idx_ord ON sections(ord_id);
CREATE INDEX sections_idx_user ON sections(user_id);
CREATE INDEX sections_idx_created ON sections(created_at);
CREATE INDEX sections_idx_difficulty ON sections(difficulty);

CREATE TRIGGER set_sections_timestamp
BEFORE UPDATE ON sections
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS descents (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID,
    ord_id          SERIAL,
    user_id         VARCHAR(128),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    section_id      UUID            NOT NULL REFERENCES sections(id) ON DELETE CASCADE,

    comment         TEXT,
    started_at      TIMESTAMPTZ     NOT NULL,
    duration        INT,
    level_value     NUMERIC,
    level_unit      VARCHAR(10),
    public          BOOLEAN,

    upstream_data   JSONB
);

-- TODO indexes

ALTER TABLE descents
ADD CONSTRAINT descent_parent_id FOREIGN KEY (parent_id) REFERENCES descents (id)
ON DELETE SET NULL;

CREATE TRIGGER set_descent_timestamp
BEFORE UPDATE ON descents
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

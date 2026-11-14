BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE plants (
    plant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_code TEXT NOT NULL UNIQUE,
    plant_name TEXT NOT NULL,
    timezone_name TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE membrane_trains (
    train_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES plants(plant_id),
    train_code TEXT NOT NULL,
    target_recovery_fraction DOUBLE PRECISION NOT NULL
        CHECK (target_recovery_fraction > 0 AND target_recovery_fraction < 0.85),
    rated_feed_m3_h DOUBLE PRECISION NOT NULL CHECK (rated_feed_m3_h > 0),
    commissioning_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (plant_id, train_code)
);
CREATE TABLE membrane_stages (
    stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES membrane_trains(train_id) ON DELETE CASCADE,
    stage_number SMALLINT NOT NULL CHECK (stage_number BETWEEN 1 AND 8),
    membrane_area_m2 DOUBLE PRECISION NOT NULL CHECK (membrane_area_m2 > 0),
    nominal_permeability_lmh_bar DOUBLE PRECISION NOT NULL
        CHECK (nominal_permeability_lmh_bar > 0),
    nominal_salt_permeability_lmh DOUBLE PRECISION NOT NULL
        CHECK (nominal_salt_permeability_lmh > 0),
    UNIQUE (train_id, stage_number)
);
CREATE INDEX idx_stages_train_number ON membrane_stages(train_id, stage_number);
INSERT INTO plants (plant_code, plant_name)
VALUES ('DEMO-RO', 'Synthetic Estuary Research Facility');
INSERT INTO membrane_trains (plant_id, train_code, target_recovery_fraction,
                            rated_feed_m3_h)
SELECT plant_id, 'RO-01', 0.42, 120.0 FROM plants WHERE plant_code = 'DEMO-RO';
INSERT INTO membrane_stages (train_id, stage_number, membrane_area_m2,
                             nominal_permeability_lmh_bar,
                             nominal_salt_permeability_lmh)
SELECT train_id, 1, 550, 1.15, 0.12 FROM membrane_trains WHERE train_code = 'RO-01';
INSERT INTO membrane_stages (train_id, stage_number, membrane_area_m2,
                             nominal_permeability_lmh_bar,
                             nominal_salt_permeability_lmh)
SELECT train_id, 2, 420, 1.05, 0.14 FROM membrane_trains WHERE train_code = 'RO-01';
COMMIT;

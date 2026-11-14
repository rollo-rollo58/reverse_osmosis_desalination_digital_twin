BEGIN;
CREATE TABLE sensor_channels (
    channel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES membrane_trains(train_id),
    channel_code TEXT NOT NULL,
    measurement_name TEXT NOT NULL,
    engineering_unit TEXT NOT NULL,
    lower_bound DOUBLE PRECISION,
    upper_bound DOUBLE PRECISION,
    UNIQUE (train_id, channel_code),
    CHECK (lower_bound IS NULL OR upper_bound IS NULL OR lower_bound < upper_bound)
);
CREATE TABLE sensor_observations (
    observation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES sensor_channels(channel_id),
    observed_at TIMESTAMPTZ NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    value DOUBLE PRECISION NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('simulated', 'manual', 'sensor')),
    quality_code TEXT NOT NULL DEFAULT 'unverified',
    UNIQUE (channel_id, observed_at, source_type)
);
CREATE INDEX idx_observations_channel_ts
    ON sensor_observations(channel_id, observed_at DESC);
CREATE INDEX idx_observations_recent ON sensor_observations(observed_at DESC);
INSERT INTO sensor_channels (train_id, channel_code, measurement_name,
                             engineering_unit, lower_bound, upper_bound)
SELECT train_id, 'FEED_PRESSURE', 'Feed manifold pressure', 'bar', 0, 85
FROM membrane_trains WHERE train_code = 'RO-01';
INSERT INTO sensor_channels (train_id, channel_code, measurement_name,
                             engineering_unit, lower_bound, upper_bound)
SELECT train_id, 'PERMEATE_COND', 'Permeate conductivity', 'uS/cm', 0, 5000
FROM membrane_trains WHERE train_code = 'RO-01';
COMMIT;

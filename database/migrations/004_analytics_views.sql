BEGIN;
CREATE VIEW latest_sensor_observations AS
SELECT DISTINCT ON (c.channel_id) p.plant_code, t.train_code, c.channel_code,
       o.observed_at, o.value, c.engineering_unit, o.source_type, o.quality_code
FROM sensor_channels c
JOIN membrane_trains t ON t.train_id = c.train_id
JOIN plants p ON p.plant_id = t.plant_id
LEFT JOIN sensor_observations o ON o.channel_id = c.channel_id
ORDER BY c.channel_id, o.observed_at DESC NULLS LAST;
CREATE VIEW hourly_observation_statistics AS
SELECT c.train_id, c.channel_code, date_trunc('hour', o.observed_at) AS hour_utc,
       count(*) AS sample_count,
       min(o.value) AS minimum_value,
       max(o.value) AS maximum_value,
       avg(o.value) AS mean_value,
       stddev_pop(o.value) AS standard_deviation
FROM sensor_observations o
JOIN sensor_channels c ON c.channel_id = o.channel_id
GROUP BY c.train_id, c.channel_code, date_trunc('hour', o.observed_at);
CREATE VIEW daily_simulation_activity AS
SELECT t.train_code, date_trunc('day', r.created_at) AS day_utc,
       count(*) AS run_count,
       count(*) FILTER (WHERE r.is_synthetic) AS synthetic_count
FROM simulation_runs r
JOIN membrane_trains t ON t.train_id = r.train_id
GROUP BY t.train_code, date_trunc('day', r.created_at);
COMMENT ON VIEW hourly_observation_statistics IS
    'Research analytics only; quality flags do not imply sensor calibration.';
COMMIT;

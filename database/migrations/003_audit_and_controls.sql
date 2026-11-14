BEGIN;
CREATE TABLE operator_accounts (
    operator_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_identity TEXT NOT NULL UNIQUE,
    role_name TEXT NOT NULL CHECK (role_name IN ('viewer', 'analyst', 'operator')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE simulation_runs (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES membrane_trains(train_id),
    requested_by UUID REFERENCES operator_accounts(operator_id),
    input_parameters JSONB NOT NULL,
    result_parameters JSONB NOT NULL,
    is_synthetic BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_runs_train_created ON simulation_runs(train_id, created_at DESC);
CREATE TABLE audit_events (
    audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action_name TEXT NOT NULL,
    actor_id UUID REFERENCES operator_accounts(operator_id),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION reject_audit_rewrites()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'Audit rows are append-only';
END;
$$;
CREATE TRIGGER audit_no_update BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION reject_audit_rewrites();
CREATE OR REPLACE FUNCTION log_simulation_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO audit_events (entity_type, entity_id, action_name, metadata)
    VALUES ('simulation_runs', NEW.run_id::text, 'insert',
            jsonb_build_object('is_synthetic', NEW.is_synthetic));
    RETURN NEW;
END;
$$;
CREATE TRIGGER simulation_insert_audit AFTER INSERT ON simulation_runs
FOR EACH ROW EXECUTE FUNCTION log_simulation_insert();
COMMIT;

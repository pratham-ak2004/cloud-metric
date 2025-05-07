-- Active: 1746630830181@@127.0.0.1@5432@cloud-metric-db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE DATABASE "cloud-metric-db";

-- createTable
-- User table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API clients table
CREATE TABLE "Api" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    client_id TEXT UNIQUE NOT NULL,
    client_secret TEXT NOT NULL
);

-- Models table
CREATE TABLE "Model" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model Versions table
CREATE TABLE "ModelVersion" (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES "Model"(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    path TEXT,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Runs table
CREATE TABLE "TrainRun" (
    id SERIAL PRIMARY KEY,
    model_version_id INTEGER REFERENCES "ModelVersion"(id) ON DELETE CASCADE,
    run_name TEXT,
    hyperparameters JSONB,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Epochs table
CREATE TABLE "Epoch" (
    id SERIAL PRIMARY KEY,
    train_run_id INTEGER REFERENCES "TrainRun"(id) ON DELETE CASCADE,
    epoch_no INTEGER NOT NULL,
    type TEXT CHECK (type IN ('train', 'val', 'test')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metrics table
CREATE TABLE "Metric" (
    epoch_id INTEGER REFERENCES "Epoch"(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (epoch_id, key)
);

-- Function to set updatedAt timestamps
CREATE OR REPLACE FUNCTION set_current_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to set updated_at timestamps for all tables
CREATE TRIGGER updated_at_user_trigger
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();

CREATE TRIGGER updated_at_models_trigger
BEFORE UPDATE ON "Model"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();

CREATE TRIGGER updated_at_model_version_trigger
BEFORE UPDATE ON "ModelVersion"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();

CREATE TRIGGER updated_at_train_runs_trigger
BEFORE UPDATE ON "TrainRun"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();

CREATE TRIGGER updated_at_epoch_trigger
BEFORE UPDATE ON "Epoch"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();
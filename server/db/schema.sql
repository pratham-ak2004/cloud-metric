-- Active: 1746630830181@@127.0.0.1@5432@cloud-metric-db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE DATABASE "cloud-metric-db";

-- createTable
-- User table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE "Session" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    sessionToken TEXT UNIQUE NOT NULL,
    refreshToken TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE
);

-- API clients table
CREATE TABLE "Api" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    apiKey TEXT UNIQUE NOT NULL,

    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE
);

-- Models table
CREATE TABLE "Model" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE
);

-- Model Versions table
CREATE TABLE "ModelVersion" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    version TEXT NOT NULL,
    path TEXT,
    config JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    model_id UUID REFERENCES "Model"(id) ON DELETE CASCADE
);

-- Training Runs table
CREATE TABLE "TrainRun" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    run_name TEXT,
    hyperparameters JSONB,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    model_version_id UUID REFERENCES "ModelVersion"(id) ON DELETE CASCADE
);

-- Epochs table
CREATE TABLE "Epoch" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    epoch_no INTEGER NOT NULL,
    type TEXT CHECK (type IN ('train', 'val', 'test')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    train_run_id UUID REFERENCES "TrainRun"(id) ON DELETE CASCADE
);

-- Metrics table
CREATE TABLE "Metric" (
    epoch_id UUID REFERENCES "Epoch"(id) ON DELETE CASCADE,

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

CREATE TRIGGER updated_at_session_trigger
BEFORE UPDATE ON "Session"
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp();
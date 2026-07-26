-- ============================================================
-- MwanaCare Database Schema for Neon PostgreSQL
-- Run this against your Neon database to create all tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Users table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  baby_name VARCHAR(255),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============================================================
-- Growth measurements table
-- ============================================================
CREATE TABLE IF NOT EXISTS growth_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  head_circumference DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON growth_measurements (user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON growth_measurements (user_id, date DESC);

-- ============================================================
-- Vaccine statuses table
-- Stores the status of each vaccine for each user
-- ============================================================
CREATE TABLE IF NOT EXISTS vaccine_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vaccine_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('done', 'pending', 'upcoming')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, vaccine_id)
);

CREATE INDEX IF NOT EXISTS idx_vaccine_statuses_user_id ON vaccine_statuses (user_id);

-- ============================================================
-- Dashboard data table (stores per-user dashboard state)
-- ============================================================
CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_week INTEGER NOT NULL DEFAULT 32,
  baby_weight DECIMAL(5,2) NOT NULL DEFAULT 3.2,
  baby_height DECIMAL(5,2) NOT NULL DEFAULT 49.5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_user_id ON dashboard_data (user_id);

-- ============================================================
-- Function to auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update triggers
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_vaccine_statuses_updated_at
  BEFORE UPDATE ON vaccine_statuses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_dashboard_updated_at
  BEFORE UPDATE ON dashboard_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


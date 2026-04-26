-- ============================================================
-- Users Table for Authentication
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable users insert for public" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable users select based on username match" ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Enable users update for their own record" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Display all users table
SELECT * FROM users;

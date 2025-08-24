/*
  # Fix birth_chart_data table structure

  1. New Columns (if missing)
    - Add missing columns to birth_chart_data table
    - Ensure all required fields exist with proper types
    
  2. Security
    - Enable RLS on birth_chart_data table
    - Add policies for authenticated users to manage their own data
    
  3. Indexes
    - Add performance indexes for common queries
*/

-- First, create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS birth_chart_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  birth_date text NOT NULL,
  birth_time text NOT NULL,
  birth_place text NOT NULL,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  interpretation text,
  raw_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add sun_sign column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'sun_sign'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN sun_sign text;
  END IF;

  -- Check and add moon_sign column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'moon_sign'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN moon_sign text;
  END IF;

  -- Check and add rising_sign column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'rising_sign'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN rising_sign text;
  END IF;

  -- Check and add interpretation column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'interpretation'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN interpretation text;
  END IF;

  -- Check and add raw_response column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'raw_response'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN raw_response text;
  END IF;

  -- Check and add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'birth_chart_data' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE birth_chart_data ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE birth_chart_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own birth chart data" ON birth_chart_data;
DROP POLICY IF EXISTS "Users can insert own birth chart data" ON birth_chart_data;
DROP POLICY IF EXISTS "Users can update own birth chart data" ON birth_chart_data;
DROP POLICY IF EXISTS "Users can delete own birth chart data" ON birth_chart_data;

-- Create RLS policies
CREATE POLICY "Users can read own birth chart data"
  ON birth_chart_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own birth chart data"
  ON birth_chart_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own birth chart data"
  ON birth_chart_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own birth chart data"
  ON birth_chart_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_birth_chart_data_user_id 
  ON birth_chart_data (user_id);

CREATE INDEX IF NOT EXISTS idx_birth_chart_data_created_at 
  ON birth_chart_data (created_at DESC);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_birth_chart_data_updated_at ON birth_chart_data;
CREATE TRIGGER update_birth_chart_data_updated_at
  BEFORE UPDATE ON birth_chart_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
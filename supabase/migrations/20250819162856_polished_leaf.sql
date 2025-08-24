/*
  # Create astrology_interpretations table

  1. New Tables
    - `astrology_interpretations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `sun_sign` (text)
      - `moon_sign` (text)
      - `rising_sign` (text)
      - `interpretation` (text)
      - `raw_response` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `astrology_interpretations` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS astrology_interpretations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  interpretation text,
  raw_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE astrology_interpretations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own astrology interpretations"
  ON astrology_interpretations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own astrology interpretations"
  ON astrology_interpretations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own astrology interpretations"
  ON astrology_interpretations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_astrology_interpretations_user_id 
  ON astrology_interpretations(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_astrology_interpretations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_astrology_interpretations_updated_at
  BEFORE UPDATE ON astrology_interpretations
  FOR EACH ROW
  EXECUTE PROCEDURE update_astrology_interpretations_updated_at();
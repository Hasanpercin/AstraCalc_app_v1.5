/*
  # Add missing horoscope_date column to daily_horoscopes table

  1. Changes
    - Add `horoscope_date` column of type DATE to daily_horoscopes table
    - Set default value to current date
    - Make column NOT NULL with default
    - Add index for better query performance
    - Add unique constraint for user_id + horoscope_date combination
  
  2. Security
    - No RLS changes needed as table already has RLS enabled
*/

-- Add the missing horoscope_date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_horoscopes' AND column_name = 'horoscope_date'
  ) THEN
    ALTER TABLE daily_horoscopes 
    ADD COLUMN horoscope_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Add index for better performance on date queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'daily_horoscopes' AND indexname = 'idx_daily_horoscopes_date'
  ) THEN
    CREATE INDEX idx_daily_horoscopes_date ON daily_horoscopes(horoscope_date);
  END IF;
END $$;

-- Add unique constraint for user_id + horoscope_date to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'daily_horoscopes' 
    AND constraint_name = 'daily_horoscopes_user_date_unique'
  ) THEN
    ALTER TABLE daily_horoscopes 
    ADD CONSTRAINT daily_horoscopes_user_date_unique 
    UNIQUE (user_id, horoscope_date);
  END IF;
END $$;
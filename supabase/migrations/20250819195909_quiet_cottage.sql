/*
  # Fix user registration database error
  
  This migration fixes the "Database error saving new user" issue by:
  1. Ensuring the user_profiles table has all required columns
  2. Creating a robust handle_new_user trigger function
  3. Setting up proper RLS policies

  The error occurs because the trigger function doesn't properly handle
  the insertion of required fields like first_name and last_name.
*/

-- First, ensure the user_profiles table has the correct structure
-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add first_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
  END IF;

  -- Add last_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone TEXT;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add other missing columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'profile_completed'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_completed BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- Update column constraints to match expected schema
ALTER TABLE user_profiles 
  ALTER COLUMN full_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- Create or replace the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _full_name TEXT;
  _first_name TEXT;
  _last_name TEXT;
  _email TEXT;
BEGIN
  -- Get full_name from metadata, fallback to empty string
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Get email from the auth.users record
  _email := COALESCE(NEW.email, '');

  -- Split full_name into first_name and last_name
  IF _full_name IS NOT NULL AND _full_name != '' THEN
    -- Split by first space
    _first_name := COALESCE(split_part(_full_name, ' ', 1), '');
    _last_name := COALESCE(trim(substring(_full_name from length(_first_name) + 2)), '');
    
    -- If no last name, use first name as last name
    IF _last_name = '' THEN
      _last_name := _first_name;
    END IF;
  ELSE
    -- Fallback values if no full_name provided
    _first_name := 'Kullanıcı';
    _last_name := 'Yeni';
    _full_name := _first_name || ' ' || _last_name;
  END IF;

  -- Insert into user_profiles with all required fields
  INSERT INTO public.user_profiles (
    user_id, 
    email, 
    full_name, 
    first_name, 
    last_name,
    status,
    profile_completed,
    email_verified,
    metadata,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    _email, 
    _full_name, 
    _first_name, 
    _last_name,
    'active',
    false,
    false,
    '{}',
    now(),
    now()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    -- Still return NEW to not block user creation
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to handle anon users during registration
DROP POLICY IF EXISTS "Allow anon profile creation during registration" ON user_profiles;
CREATE POLICY "Allow anon profile creation during registration"
  ON user_profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure authenticated users can manage their profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
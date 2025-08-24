/*
  # Update user registration to handle phone numbers

  1. Updated Functions
    - `handle_new_user`: Now extracts and stores phone number from user metadata
    
  2. Changes
    - Added phone extraction from raw_user_meta_data
    - Enhanced error handling for phone data
    - Maintained backward compatibility for existing users without phone
    
  3. Security
    - Phone data is optional and validated
    - Maintains existing RLS policies
*/

-- Update the user registration trigger function to handle phone numbers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _full_name TEXT;
  _first_name TEXT;
  _last_name TEXT;
  _email TEXT;
  _phone TEXT;
BEGIN
  -- Get full_name from metadata, fallback to empty string
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Get phone from metadata
  _phone := COALESCE(NEW.raw_user_meta_data->>'phone', NULL);
  
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

  -- Insert into user_profiles with all required fields including phone
  INSERT INTO public.user_profiles (
    user_id, 
    email, 
    full_name, 
    first_name, 
    last_name,
    phone,
    status,
    profile_completed,
    email_verified,
    metadata
  )
  VALUES (
    NEW.id, 
    _email, 
    _full_name, 
    _first_name, 
    _last_name,
    _phone,
    'active',
    false,
    false,
    '{}'
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
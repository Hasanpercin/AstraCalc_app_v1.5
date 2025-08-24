/*
  # Update upsert_user_profile RPC function to handle phone numbers

  1. Updated Functions
    - `upsert_user_profile`: Now accepts and stores phone number parameter
    
  2. Changes
    - Added p_phone parameter to function signature
    - Updated INSERT and UPDATE operations to include phone field
    - Maintained existing functionality for other fields
    
  3. Security
    - Maintains existing security context and RLS policies
    - Phone validation handled at application layer
*/

-- Update the upsert_user_profile RPC function to handle phone numbers
CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  _full_name TEXT;
  _result JSON;
BEGIN
  -- Construct full name
  _full_name := TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, ''));
  
  -- Upsert user profile
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    full_name,
    email,
    phone,
    avatar_url,
    updated_at
  )
  VALUES (
    p_user_id,
    TRIM(p_first_name),
    TRIM(p_last_name),
    _full_name,
    LOWER(TRIM(p_email)),
    p_phone,
    p_avatar_url,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    first_name = TRIM(p_first_name),
    last_name = TRIM(p_last_name),
    full_name = _full_name,
    email = LOWER(TRIM(p_email)),
    phone = p_phone,
    avatar_url = p_avatar_url,
    updated_at = now();

  -- Return success response
  SELECT json_build_object(
    'success', true,
    'user_id', p_user_id,
    'full_name', _full_name,
    'email', LOWER(TRIM(p_email)),
    'phone', p_phone
  ) INTO _result;

  RETURN _result;
  
EXCEPTION
  WHEN unique_violation THEN
    -- Handle unique constraint violations (e.g., duplicate email)
    SELECT json_build_object(
      'success', false,
      'error', 'CONSTRAINT_VIOLATION',
      'message', 'Duplicate data detected'
    ) INTO _result;
    RETURN _result;
    
  WHEN OTHERS THEN
    -- Handle other errors
    SELECT json_build_object(
      'success', false,
      'error', 'UNKNOWN_ERROR',
      'message', SQLERRM
    ) INTO _result;
    RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
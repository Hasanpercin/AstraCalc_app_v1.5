/*
  # Add RPC function for safe profile updates

  This creates an RPC (Remote Procedure Call) function that can be called
  from the frontend to safely upsert user profile data without unique
  constraint violations.

  ## Usage from Frontend:
  ```javascript
  const { data, error } = await supabase.rpc('upsert_user_profile', {
    profile_data: {
      full_name: 'John Doe',
      email: 'john@example.com'
    }
  });
  ```
*/

-- Create the RPC function for upserting user profiles
CREATE OR REPLACE FUNCTION upsert_user_profile(profile_data jsonb)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  result_record user_profiles;
  full_name_val text;
  email_val text;
  avatar_url_val text;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Extract values from JSON parameter
  full_name_val := profile_data->>'full_name';
  email_val := profile_data->>'email';
  avatar_url_val := profile_data->>'avatar_url';

  -- Validate required fields
  IF full_name_val IS NULL OR full_name_val = '' THEN
    RAISE EXCEPTION 'full_name is required';
  END IF;

  -- Perform upsert using INSERT ... ON CONFLICT
  INSERT INTO user_profiles (
    user_id, 
    full_name, 
    email, 
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    current_user_id,
    full_name_val,
    email_val,
    avatar_url_val,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW()
  RETURNING * INTO result_record;

  -- Return the result as JSON
  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );

EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upsert_user_profile(jsonb) TO authenticated;

-- Also create a simpler version with individual parameters
CREATE OR REPLACE FUNCTION upsert_user_profile_simple(
  p_full_name text,
  p_email text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  current_user_id uuid;
  result_record user_profiles;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Validate required fields
  IF p_full_name IS NULL OR p_full_name = '' THEN
    RAISE EXCEPTION 'full_name is required';
  END IF;

  -- Perform upsert using INSERT ... ON CONFLICT
  INSERT INTO user_profiles (
    user_id, 
    full_name, 
    email, 
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    current_user_id,
    p_full_name,
    p_email,
    p_avatar_url,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW()
  RETURNING * INTO result_record;

  -- Return the result as JSON
  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );

EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upsert_user_profile_simple(text, text, text) TO authenticated;
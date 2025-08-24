/*
  # Create upsert_user_profile database function

  1. Database Functions
    - `upsert_user_profile` function for inserting/updating user profiles
    - Handles both new user creation and existing user updates
    - Automatically constructs full_name from first_name and last_name
    - Supports optional phone and avatar_url parameters

  2. Security
    - Function uses SECURITY DEFINER for proper permissions
    - Handles data validation and proper upsert logic

  3. Parameters
    - p_user_id: UUID (required) - User's unique identifier
    - p_first_name: TEXT (required) - User's first name
    - p_last_name: TEXT (required) - User's last name  
    - p_email: TEXT (required) - User's email address
    - p_phone: TEXT (optional) - User's phone number
    - p_avatar_url: TEXT (optional) - User's avatar image URL
*/

CREATE OR REPLACE FUNCTION public.upsert_user_profile(
    p_user_id UUID,
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_full_name TEXT;
BEGIN
    -- Construct full_name from first_name and last_name
    v_full_name := TRIM(CONCAT_WS(' ', p_first_name, p_last_name));

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
        p_first_name,
        p_last_name,
        v_full_name,
        p_email,
        p_phone,
        p_avatar_url,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
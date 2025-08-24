/*
  # Create automatic user profile creation trigger

  1. Function
    - `handle_new_user()`: Automatically creates user profile when new user registers
    - Extracts full_name from user metadata and email from auth.users
    - Uses SECURITY DEFINER to bypass RLS policies

  2. Trigger
    - `on_auth_user_created`: Triggers after INSERT on auth.users
    - Calls handle_new_user() function for each new user

  This resolves the "Database error saving new user" issue by ensuring
  user_profiles entries are automatically created with required data.
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
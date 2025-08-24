/*
  # Add user registration trigger

  1. New Functions
    - `handle_new_user()` - Creates user profile entry when new user signs up
  
  2. New Triggers
    - `on_auth_user_created` - Automatically runs after new user insertion
  
  3. Purpose
    - Fixes "Database error saving new user" by ensuring user_profiles entry is created
    - Links Supabase Auth users with application user profiles automatically
*/

-- Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires after a new user is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
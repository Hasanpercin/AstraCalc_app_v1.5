-- Drop existing tables if they exist (CASCADE will remove all dependencies)
DROP TABLE IF EXISTS public.zodiac_compatibility CASCADE;
DROP TABLE IF EXISTS public.daily_horoscopes CASCADE;
DROP TABLE IF EXISTS public.zodiac_signs CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop helper functions if they exist
DROP FUNCTION IF EXISTS get_zodiac_sign_by_date(DATE) CASCADE;
DROP FUNCTION IF EXISTS get_todays_horoscope(VARCHAR) CASCADE;

-- Now you can run the 001_create_zodiac_tables.sql migration

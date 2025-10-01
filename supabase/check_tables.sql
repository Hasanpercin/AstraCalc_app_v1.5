-- Check existing zodiac_signs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'zodiac_signs'
ORDER BY ordinal_position;

-- Check existing daily_horoscopes table structure (if exists)
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'daily_horoscopes'
ORDER BY ordinal_position;

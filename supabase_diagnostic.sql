-- Supabase Database Diagnostic - Run this in Supabase SQL Editor
-- This will help identify why updates aren't reflecting

-- Step 1: Check if profiles table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'profiles'
) as profiles_table_exists;

-- Step 2: If profiles table exists, check its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check if there are any users in auth.users table
SELECT count(*) as total_auth_users FROM auth.users;

-- Step 4: Check if bryan@nyuchi.com exists in auth.users
SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'bryan@nyuchi.com';

-- Step 5: Check if profiles table has any data
SELECT count(*) as total_profiles FROM profiles;

-- Step 6: Check if bryan@nyuchi.com has a profile
SELECT id, email, full_name, role, created_at, updated_at
FROM profiles 
WHERE email = 'bryan@nyuchi.com';

-- Step 7: Check all existing profiles and their roles
SELECT email, role, full_name, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Step 8: Check Row Level Security policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 9: Check if the trigger function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';

-- Step 10: Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

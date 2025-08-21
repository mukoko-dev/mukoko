-- Quick setup to grant super_admin role to bryan@nyuchi.com
-- Run this in Supabase SQL Editor after bryan@nyuchi.com has signed up

-- Option 1: If bryan@nyuchi.com already has an account, update their role
UPDATE profiles 
SET role = 'super_admin', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'bryan@nyuchi.com';

-- Option 2: If no profile exists yet, create one (requires knowing the user ID)
-- First find the user ID from auth.users table:
-- SELECT id, email FROM auth.users WHERE email = 'bryan@nyuchi.com';

-- Then insert profile with super_admin role (replace UUID with actual ID):
-- INSERT INTO profiles (id, email, role, full_name, created_at, updated_at)
-- VALUES (
--   'REPLACE_WITH_ACTUAL_UUID_FROM_AUTH_USERS',
--   'bryan@nyuchi.com',
--   'super_admin',
--   'Bryan',
--   timezone('utc'::text, now()),
--   timezone('utc'::text, now())
-- );

-- Verify the setup
SELECT 
  p.id,
  p.email, 
  p.full_name, 
  p.role, 
  p.created_at, 
  p.updated_at,
  u.created_at as auth_created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'bryan@nyuchi.com';

-- Check all admin users
SELECT email, role, full_name, created_at 
FROM profiles 
WHERE role IN ('admin', 'super_admin', 'moderator')
ORDER BY role DESC;

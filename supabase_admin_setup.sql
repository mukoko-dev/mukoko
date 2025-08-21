-- Supabase Super Admin Setup for bryan@nyuchi.com
-- Run these commands in your Supabase SQL Editor

-- Step 1: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'business-creator', 'author', 'admin', 'super_admin', 'moderator', 'analyst', 'content_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security policies if they don't exist
DO $$ 
BEGIN
  -- Public profiles viewable policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Public profiles are viewable by everyone' 
    AND tablename = 'profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true)';
  END IF;
  
  -- Users can insert their own profile policy  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can insert their own profile' 
    AND tablename = 'profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  
  -- Users can update their own profile policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update their own profile' 
    AND tablename = 'profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;

-- Step 4: Create function to handle new user signups with automatic role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.email = 'bryan@nyuchi.com' THEN 'super_admin'
      ELSE 'creator'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: If bryan@nyuchi.com already exists, update their role to super_admin
UPDATE profiles 
SET role = 'super_admin', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'bryan@nyuchi.com';

-- Step 7: Verify the setup
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at, 
  updated_at 
FROM profiles 
WHERE email = 'bryan@nyuchi.com'
ORDER BY created_at DESC;

-- Step 8: Show all users with admin roles for verification
SELECT 
  email, 
  role, 
  full_name,
  created_at
FROM profiles 
WHERE role IN ('admin', 'super_admin', 'moderator')
ORDER BY role DESC, created_at DESC;

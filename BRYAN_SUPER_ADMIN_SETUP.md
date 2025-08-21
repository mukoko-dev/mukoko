# Bryan Super Admin Setup Guide

This guide provides the steps to set up bryan@nyuchi.com with super admin privileges in the Mukoko system.

## Overview
The Mukoko application uses a role-based access system with the following hierarchy (highest to lowest):
- **super_admin** - Complete system control and configuration
- **admin** - Full administrative access to platform
- **moderator** - Content moderation and community management
- **analyst** - Analytics and reporting access
- **content_manager** - Editorial and content management
- **author** - Professional writer with publishing capabilities
- **business-creator** - Business content creator with enhanced features
- **creator** - Individual content creator (default role)

## Database Setup

### Step 1: Ensure profiles table exists
Run this SQL in your Supabase SQL editor to create the profiles table if it doesn't exist:

```sql
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'business-creator', 'author', 'admin', 'super_admin', 'moderator', 'analyst', 'content_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone' AND tablename = 'profiles') THEN
    EXECUTE 'CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'profiles') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles') THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;
```

### Step 2: Set bryan@nyuchi.com as super admin
After bryan@nyuchi.com signs up/in to the system, run this SQL to upgrade their role:

```sql
-- Update bryan@nyuchi.com to super_admin role
UPDATE profiles 
SET role = 'super_admin', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'bryan@nyuchi.com';

-- Verify the update
SELECT id, email, full_name, role, created_at, updated_at 
FROM profiles 
WHERE email = 'bryan@nyuchi.com';
```

### Alternative: Set role during first login
If you want to automatically assign super admin during first login, you can create a function:

```sql
-- Create or replace function to handle new user signup
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

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Verification Steps

1. **Check role assignment**: Verify bryan@nyuchi.com has super_admin role in the profiles table
2. **Test access**: Login as bryan@nyuchi.com and confirm access to admin features
3. **Check admin endpoints**: Verify access to `/api/admin/*` endpoints with proper admin key

## Super Admin Capabilities

With super_admin role, bryan@nyuchi.com will have access to:
- All system features and functionality
- System configuration and database access  
- API management and admin endpoints
- User role management
- Content moderation tools
- Advanced analytics and reporting
- All creator and business features

## Security Notes

- Super admin role should be assigned sparingly
- Regular audit of admin users recommended
- Admin actions are logged for security purposes
- Consider implementing additional MFA for admin accounts

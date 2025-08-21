# Supabase Database Update Troubleshooting Guide

## Issue: Database updates are not reflecting in Supabase

### Step-by-Step Diagnosis

#### 1. **Verify Supabase Project Connection**
- Go to: https://supabase.com/dashboard/projects
- Confirm you're in the correct project: `huilmzajhiqcuzonbaps`
- Your project URL should be: `https://huilmzajhiqcuzonbaps.supabase.co`

#### 2. **Run Diagnostic SQL**
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire content from `supabase_diagnostic.sql`
3. Click **Run** and check the results

#### 3. **Common Issues and Solutions**

##### Issue A: Profiles table doesn't exist
**Symptoms:** `profiles_table_exists` returns `false`
**Solution:** Run the table creation SQL:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'business-creator', 'author', 'admin', 'super_admin', 'moderator', 'analyst', 'content_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

##### Issue B: bryan@nyuchi.com hasn't signed up yet
**Symptoms:** Query for bryan@nyuchi.com returns no results in `auth.users`
**Solution:** 
1. Have bryan@nyuchi.com sign up at your app first
2. Then run the role update SQL

##### Issue C: Profile exists but role update didn't work
**Symptoms:** User exists but role is still 'creator'
**Solution:** Run this update command:
```sql
UPDATE profiles 
SET role = 'super_admin', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'bryan@nyuchi.com';
```

##### Issue D: RLS policies blocking updates
**Symptoms:** Update command runs but no rows affected
**Solution:** Temporarily disable RLS for admin operations:
```sql
-- Run the update with elevated privileges
UPDATE profiles 
SET role = 'super_admin', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'bryan@nyuchi.com';

-- Verify the update worked
SELECT email, role FROM profiles WHERE email = 'bryan@nyuchi.com';
```

#### 4. **Manual Setup Process**

If automated setup isn't working, follow this manual process:

1. **Create the profiles table** (if it doesn't exist):
```sql
-- Run in Supabase SQL Editor
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'business-creator', 'author', 'admin', 'super_admin', 'moderator', 'analyst', 'content_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

2. **Have bryan@nyuchi.com sign up** in your app at: https://app.mukoko.com

3. **Find the user ID**:
```sql
SELECT id, email FROM auth.users WHERE email = 'bryan@nyuchi.com';
```

4. **Create or update the profile**:
```sql
-- If no profile exists, create one (replace YOUR_USER_ID with actual ID from step 3)
INSERT INTO profiles (id, email, role, full_name, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_HERE',
  'bryan@nyuchi.com',
  'super_admin',
  'Bryan',
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET 
  role = 'super_admin',
  updated_at = timezone('utc'::text, now());
```

5. **Verify the setup**:
```sql
SELECT p.email, p.role, p.full_name, p.created_at 
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'bryan@nyuchi.com';
```

#### 5. **Verification Checklist**

✅ Supabase project URL matches your config
✅ Profiles table exists with correct schema
✅ bryan@nyuchi.com has signed up (exists in auth.users)
✅ Profile record exists for bryan@nyuchi.com
✅ Role is set to 'super_admin'
✅ App recognizes the super admin role

#### 6. **Testing in the App**

After successful database setup:
1. Have bryan@nyuchi.com log into https://app.mukoko.com
2. Go to profile page - should show "Super Admin" role
3. Check access to admin features
4. Verify admin dashboard accessibility

#### 7. **Still Having Issues?**

If problems persist, run the diagnostic SQL and provide the results. Common remaining issues:
- Wrong Supabase project
- Cached authentication state
- Browser cache issues
- Environment variable mismatches

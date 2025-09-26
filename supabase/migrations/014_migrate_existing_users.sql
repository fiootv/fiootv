-- Migrate existing users from auth.users to users table
-- This migration will create user profiles for all existing authenticated users

-- Insert all existing auth users into the users table
-- The first user (oldest by created_at) will be made admin, others will be agents
INSERT INTO public.users (auth_user_id, email, full_name, role, created_by, created_at)
SELECT 
  au.id as auth_user_id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    au.raw_user_meta_data->>'name', 
    split_part(au.email, '@', 1)
  ) as full_name,
  CASE 
    WHEN au.created_at = (
      SELECT MIN(created_at) 
      FROM auth.users 
      WHERE email_confirmed_at IS NOT NULL
    ) THEN 'admin'
    ELSE 'agent'
  END as role,
  NULL as created_by, -- No creator for migrated users
  au.created_at
FROM auth.users au
WHERE au.email_confirmed_at IS NOT NULL -- Only confirmed users
  AND au.id NOT IN (
    SELECT auth_user_id 
    FROM public.users 
    WHERE auth_user_id IS NOT NULL
  ) -- Don't duplicate existing users
ORDER BY au.created_at;

-- Update the created_by field for non-admin users to point to the admin user
-- This creates a proper hierarchy for migrated users
UPDATE public.users 
SET created_by = (
  SELECT id 
  FROM public.users 
  WHERE role = 'admin' 
  ORDER BY created_at 
  LIMIT 1
)
WHERE role = 'agent' 
  AND created_by IS NULL;

-- Add a comment to track the migration
COMMENT ON TABLE public.users IS 'User management table with role-based access control. Migrated existing users on creation.';

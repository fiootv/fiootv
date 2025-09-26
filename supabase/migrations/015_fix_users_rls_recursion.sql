-- Fix infinite recursion in users table RLS policies
-- The issue is that policies are checking the users table while trying to access the users table

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Create a function to check if current user is admin without causing recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role of the current authenticated user
  SELECT role INTO user_role
  FROM public.users
  WHERE auth_user_id = auth.uid();
  
  -- Return true if role is admin, false otherwise
  RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies that avoid recursion
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth_user_id = auth.uid());

-- Only admins can view all users (using the function to avoid recursion)
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (public.is_current_user_admin());

-- Only admins can insert new users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (public.is_current_user_admin());

-- Only admins can update users
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (public.is_current_user_admin());

-- Only admins can delete users
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (public.is_current_user_admin());

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

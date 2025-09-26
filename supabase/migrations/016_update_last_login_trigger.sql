-- Create function to update last_login timestamp when user signs in
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the last_login timestamp in the users table
  UPDATE public.users 
  SET last_login = NOW()
  WHERE auth_user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users to update last_login on sign in
-- This triggers when a user signs in (when last_sign_in_at is updated)
CREATE OR REPLACE FUNCTION public.handle_user_signin()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if last_sign_in_at has changed (indicating a new sign in)
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    UPDATE public.users 
    SET last_login = NEW.last_sign_in_at
    WHERE auth_user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_signin ON auth.users;

-- Create the trigger
CREATE TRIGGER on_user_signin
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_signin();

-- Also create a function to manually update last login (for testing or manual updates)
CREATE OR REPLACE FUNCTION public.set_user_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET last_login = NOW()
  WHERE auth_user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_user_signin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_login() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_last_login(UUID) TO authenticated;

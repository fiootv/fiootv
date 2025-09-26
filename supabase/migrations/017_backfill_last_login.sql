-- Backfill last_login data for existing users based on their auth.last_sign_in_at
UPDATE public.users 
SET last_login = au.last_sign_in_at
FROM auth.users au
WHERE public.users.auth_user_id = au.id 
  AND au.last_sign_in_at IS NOT NULL
  AND public.users.last_login IS NULL;

-- Add a comment to track the backfill
COMMENT ON COLUMN public.users.last_login IS 'Last login timestamp, automatically updated on user sign in';

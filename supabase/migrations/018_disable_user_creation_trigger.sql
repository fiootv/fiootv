-- Temporarily disable the user creation trigger to avoid conflicts
-- This allows manual user creation through the API

-- Drop the trigger that automatically creates user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Comment out the function (don't drop it, just disable it)
COMMENT ON FUNCTION public.handle_new_user() IS 'Disabled - user creation now handled by API';

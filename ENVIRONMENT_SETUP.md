# Environment Variables Setup

## Required Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get These Values

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings > API**
3. **Copy the following values:**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Important Notes

- **Service Role Key**: This is required for admin operations like creating users
- **Keep it secret**: Never commit the service role key to version control
- **Admin operations**: The service role key bypasses RLS and has full access

## Current Usage

The service role key is used for:
- Creating new user accounts (admin operations)
- Deleting user accounts (admin operations)
- Bypassing RLS policies for admin functions

## Security

- The service role key is only used in server-side API routes
- It's never exposed to the client
- All admin operations are protected by role checks

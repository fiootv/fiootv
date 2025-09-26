# User Management System

This application now includes a comprehensive user management system with role-based access control.

## Features

### Roles
- **Admin**: Full access to all features including user management
- **Agent**: Limited access to core features (customers, resellers, invoices, etc.)

### User Management
- Create new users with admin or agent roles
- View all users in the system
- Activate/deactivate user accounts
- Delete user accounts
- Role-based access control

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  last_login TIMESTAMP WITH TIME ZONE
);
```

## API Endpoints

### GET /api/users
- Fetches all users (admin only)
- Returns user data with creator information

### POST /api/users
- Creates a new user (admin only)
- Requires: email, password, role, full_name (optional)

### PATCH /api/users/[id]
- Updates user information (admin only)
- Can update: full_name, role, is_active

### DELETE /api/users/[id]
- Deletes a user account (admin only)
- Removes both auth user and user profile

## Components

### UserForm
- Form component for creating new users
- Includes validation and error handling
- Redirects to users list after successful creation

### UsersPage
- Lists all users with their roles and status
- Provides actions to activate/deactivate and delete users
- Protected by AdminGuard

### AdminGuard
- Higher-order component that restricts access to admin users
- Shows access denied message for non-admin users

## Security Features

### Row Level Security (RLS)
- Users can only view their own profile
- Only admins can view, create, update, and delete all users
- Automatic user profile creation on signup

### Role-based Access Control
- Admin users have full access to user management
- Agent users cannot access user management features
- Role information displayed in header

## Usage

1. **First User**: The first user to sign up automatically becomes an admin
2. **Adding Users**: Admins can add new users through the dashboard
3. **Managing Users**: View, activate/deactivate, and delete users from the users page
4. **Role Assignment**: Assign admin or agent roles when creating users

## Navigation

The user management system is accessible through:
- Dashboard → Users → All Users
- Dashboard → Users → Add User

## Migration

Run the database migration to create the users table:
```bash
# The migration file is located at:
# supabase/migrations/013_create_users_table.sql
```

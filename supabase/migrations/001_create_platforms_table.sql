-- Create platforms table
CREATE TABLE platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the name field for better performance
CREATE INDEX idx_platforms_name ON platforms(name);

-- Enable Row Level Security
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this policy based on your specific requirements
CREATE POLICY "Allow all operations for authenticated users" ON platforms
  FOR ALL USING (auth.role() = 'authenticated');

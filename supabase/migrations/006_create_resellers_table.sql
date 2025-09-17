-- Create resellers table
CREATE TABLE resellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Reseller Information
  reseller_for TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  country TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_resellers_platform_id ON resellers(platform_id);
CREATE INDEX idx_resellers_email ON resellers(email);
CREATE INDEX idx_resellers_full_name ON resellers(full_name);
CREATE INDEX idx_resellers_created_at ON resellers(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resellers_updated_at 
    BEFORE UPDATE ON resellers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON resellers
  FOR ALL USING (auth.role() = 'authenticated');

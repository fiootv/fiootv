-- Create absence table
CREATE TABLE absence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Absence Information
  description TEXT NOT NULL,
  date DATE NOT NULL,
  email TEXT NOT NULL,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_absence_email ON absence(email);
CREATE INDEX idx_absence_date ON absence(date);
CREATE INDEX idx_absence_created_at ON absence(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_absence_updated_at 
    BEFORE UPDATE ON absence 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE absence ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON absence
  FOR ALL USING (auth.role() = 'authenticated');

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Customer Information
  customer_from TEXT,
  subscription_status TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  billing_address TEXT,
  shipping_address TEXT,
  currency TEXT,
  
  -- Subscription Information
  subscription_id TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  next_renewal TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10,2),
  
  -- Payment Information
  payment_method TEXT,
  payment_status TEXT,
  payment_gateway TEXT,
  card_details TEXT,
  reference_number TEXT,
  
  -- Trial Information
  has_trial BOOLEAN DEFAULT FALSE,
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  total_hours INTEGER,
  
  -- Device Information
  device_type TEXT, -- MAG Device, Android Box, Fire Stick, etc.
  mac_address TEXT,
  service_type TEXT,
  any_other_device TEXT,
  
  -- File Attachment
  attachment_file_url TEXT,
  attachment_file_name TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_platform_id ON customers(platform_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_subscription_id ON customers(subscription_id);
CREATE INDEX idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

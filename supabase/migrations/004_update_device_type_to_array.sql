-- Update device_type field to support JSON array
ALTER TABLE customers 
ALTER COLUMN device_type TYPE JSONB USING 
  CASE 
    WHEN device_type IS NULL THEN NULL
    WHEN device_type = '' THEN '[]'::jsonb
    ELSE ('["' || device_type || '"]')::jsonb
  END;

-- Add a comment to clarify the field usage
COMMENT ON COLUMN customers.device_type IS 'Array of device types as JSONB, e.g., ["Android Box", "Fire Stick"]';

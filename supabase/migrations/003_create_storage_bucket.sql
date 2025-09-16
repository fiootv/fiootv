-- Create storage bucket for customer files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-files', 'customer-files', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload customer files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'customer-files' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view customer files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'customer-files' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to update files
CREATE POLICY "Allow authenticated users to update customer files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'customer-files' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete customer files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'customer-files' 
  AND auth.role() = 'authenticated'
);

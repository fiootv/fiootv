-- Add payment_notes and document_urls fields to invoices table
ALTER TABLE invoices 
ADD COLUMN payment_notes TEXT,
ADD COLUMN document_urls JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the new fields
COMMENT ON COLUMN invoices.payment_notes IS 'Additional notes or information about the payment';
COMMENT ON COLUMN invoices.document_urls IS 'Array of URLs to uploaded payment documents (checks, bank transfer receipts, etc.)';

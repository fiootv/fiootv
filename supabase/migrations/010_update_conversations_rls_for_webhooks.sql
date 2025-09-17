-- Update RLS policies to allow webhook inserts for inbound messages
-- This allows Twilio webhooks to insert inbound messages without user authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create conversations for their customers" ON conversations;

-- Create new policy that allows both user and webhook inserts
CREATE POLICY "Allow conversation creation" ON conversations
  FOR INSERT WITH CHECK (
    -- Allow if user is authenticated and owns the customer
    (auth.uid() IS NOT NULL AND customer_id IN (
      SELECT id FROM customers WHERE created_by = auth.uid()
    ))
    OR
    -- Allow webhook inserts for inbound messages (no auth required)
    (auth.uid() IS NULL AND direction = 'inbound')
  );

-- Add index for better webhook performance
CREATE INDEX idx_conversations_external_id ON conversations(external_id);
CREATE INDEX idx_conversations_phone_lookup ON conversations ((metadata->>'phone_number'));

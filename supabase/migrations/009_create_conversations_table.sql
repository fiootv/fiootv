-- Create conversations table to store communication history
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('sms', 'email', 'whatsapp')),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  external_id VARCHAR(255), -- Twilio message ID or email message ID
  metadata JSONB, -- Store additional data like phone number, email address, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create index for better performance
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view conversations for their customers" ON conversations
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations for their customers" ON conversations
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update conversations for their customers" ON conversations
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM customers WHERE created_by = auth.uid()
    )
  );

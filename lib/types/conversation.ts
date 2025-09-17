export interface Conversation {
  id: string;
  customer_id: string;
  type: 'sms' | 'email' | 'whatsapp';
  direction: 'inbound' | 'outbound';
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  external_id?: string;
  metadata?: {
    phone_number?: string;
    email_address?: string;
    subject?: string;
    from?: string;
    to?: string;
    message_status?: string;
    direction?: string;
    num_media?: string;
    media_urls?: Array<{ url: string; contentType: string }>;
    [key: string]: unknown;
  };
  created_at: string;
  created_by?: string;
}

export interface ConversationFormData {
  type: 'sms' | 'email' | 'whatsapp';
  message: string;
  phone_number?: string;
  email_address?: string;
  subject?: string;
}

export interface TwilioConfig {
  account_sid: string;
  auth_token: string;
  phone_number: string;
  whatsapp_number?: string;
}

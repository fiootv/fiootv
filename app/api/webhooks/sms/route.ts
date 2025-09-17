import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract Twilio webhook data
    const messageSid = formData.get('MessageSid') as string;
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const body = formData.get('Body') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const direction = formData.get('Direction') as string;

    console.log('SMS Webhook received:', {
      messageSid,
      from,
      to,
      body: body?.substring(0, 100) + '...',
      messageStatus,
      direction
    });

    // Only process inbound messages
    if (direction !== 'inbound') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    if (!messageSid || !from || !body) {
      console.error('Missing required SMS webhook data');
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Clean phone number (remove whatsapp: prefix if present)
    const cleanFrom = from.replace('whatsapp:', '').replace('sms:', '');
    
    // Find customer by phone number
    const supabase = createClient();
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id, full_name, phone, email')
      .or(`phone.eq.${cleanFrom},phone.eq.${from}`)
      .limit(1);

    if (customerError) {
      console.error('Error finding customer:', customerError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // If no customer found, we can still store the message but without customer_id
    // This allows us to track unknown numbers
    let customerId = null;
    if (customers && customers.length > 0) {
      customerId = customers[0].id;
    }

    // Store the inbound message
    const { error: insertError } = await supabase
      .from('conversations')
      .insert([{
        customer_id: customerId,
        type: 'sms',
        direction: 'inbound',
        message: body,
        status: 'delivered', // Inbound messages are considered delivered
        external_id: messageSid,
        metadata: {
          phone_number: cleanFrom,
          from: from,
          to: to,
          message_status: messageStatus,
          direction: direction
        },
        created_by: null // Webhook inserts don't have a user
      }]);

    if (insertError) {
      console.error('Error storing inbound SMS:', insertError);
      return NextResponse.json({ error: 'Failed to store message' }, { status: 500 });
    }

    console.log('Inbound SMS stored successfully');
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('SMS webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

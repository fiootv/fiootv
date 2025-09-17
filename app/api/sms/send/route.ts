import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, message, customerId } = await request.json();

    if (!to || !message || !customerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      return NextResponse.json({ error: 'Twilio configuration missing' }, { status: 500 });
    }

    // Create Twilio client
    const client = twilio(accountSid, authToken);

    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to,
    });

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: result.status,
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

# Communication Setup Guide

This guide explains how to set up SMS, Email, and WhatsApp communication features for the FiooTV customer management system.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

# SMTP Configuration (for email functionality)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

## Twilio Setup

1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for SMS
4. For WhatsApp, enable WhatsApp Sandbox or get approval for production

## SMTP Setup

1. **Choose an SMTP provider** (Gmail, SendGrid, Mailgun, etc.)
2. **Get SMTP credentials**:
   - **Host**: Your SMTP server hostname (e.g., `smtp.gmail.com`, NOT your email address)
   - **Port**: Usually 587 (TLS) or 465 (SSL)
   - **Username**: Your SMTP username (usually your email address)
   - **Password**: Your SMTP password or app password
   - **From**: Your verified sender email address

**⚠️ Important**: The `SMTP_HOST` should be the server hostname (like `smtp.gmail.com`), NOT your email address!

### Popular SMTP Providers

#### Gmail
- Host: `smtp.gmail.com`
- Port: `587`
- Username: Your Gmail address
- Password: App password (not your regular password)

#### SendGrid
- Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: Your SendGrid API key

#### Mailgun
- Host: `smtp.mailgun.org`
- Port: `587`
- Username: Your Mailgun SMTP username
- Password: Your Mailgun SMTP password

## Database Migration

Run the following migration to create the conversations table:

```bash
npx supabase db push
```

## Features Implemented

### SMS Communication
- Send SMS messages to customers
- View conversation history
- Store messages in Supabase
- Real-time message status updates

### Email Communication (Coming Soon)
- Send emails to customers
- Email templates
- Attachment support

### WhatsApp Communication (Coming Soon)
- Send WhatsApp messages
- Rich media support
- Business API integration

## Usage

1. Navigate to any customer's detail page
2. Scroll down to the "Customer Communication" section
3. Use the tabs to switch between SMS, Email, and WhatsApp
4. Send messages and view conversation history

## API Endpoints

- `POST /api/sms/send` - Send SMS via Twilio
- `POST /api/whatsapp/send` - Send WhatsApp message via Twilio
- `POST /api/email/send` - Send email via SMTP
- `POST /api/webhooks/messages` - Receive inbound SMS and WhatsApp messages
- `POST /api/webhooks/sms` - Receive inbound SMS messages (alternative)
- `POST /api/webhooks/whatsapp` - Receive inbound WhatsApp messages (alternative)

## Webhook Configuration

### Twilio Console Setup

1. **Go to Twilio Console** → Phone Numbers → Manage → Active Numbers
2. **Select your phone number** (the one you use for SMS/WhatsApp)
3. **Configure Webhooks**:
   - **A message comes in**: `https://yourdomain.com/api/webhooks/messages`
   - **A message status changes**: `https://yourdomain.com/api/webhooks/messages` (optional)

### WhatsApp Webhook Setup

1. **Go to Twilio Console** → Messaging → Senders → WhatsApp Senders
2. **Select your WhatsApp sender**
3. **Configure Webhook**:
   - **When a message comes in**: `https://yourdomain.com/api/webhooks/messages`
   - **When a message status changes**: `https://yourdomain.com/api/webhooks/messages` (optional)

### Webhook Features

- **Automatic customer matching**: Finds customers by phone number
- **Message storage**: Stores all inbound messages in database
- **Media support**: Handles WhatsApp media messages (images, documents, etc.)
- **Unknown numbers**: Stores messages from unknown numbers for future reference
- **Real-time updates**: Messages appear immediately in the chat interface

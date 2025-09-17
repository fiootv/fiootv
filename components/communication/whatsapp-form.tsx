'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, MessageSquare, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Conversation, ConversationFormData } from '@/lib/types/conversation';
import { toast } from 'sonner';

interface WhatsAppFormProps {
  customerId: string;
  customerPhone?: string;
  conversations: Conversation[];
  onConversationAdded: (conversation: Conversation) => void;
}

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1', example: '1234567890' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1', example: '1234567890' },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91', example: '9876543210' },
];

export default function WhatsAppForm({ customerId, customerPhone, conversations, onConversationAdded }: WhatsAppFormProps) {
  const [formData, setFormData] = useState<ConversationFormData>({
    type: 'whatsapp',
    message: '',
    phone_number: customerPhone || '',
  });
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Phone number validation and formatting based on selected country
  const validateAndFormatPhone = (phone: string, country: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    const countryOption = COUNTRY_OPTIONS.find(c => c.code === country);
    
    if (!countryOption) return null;
    
    // US/Canada: +1 (10 digits)
    if (country === 'US' || country === 'CA') {
      if (digits.startsWith('1') && digits.length === 11) {
        // Phone has 1 country code, format as +1
        return `+1${digits.substring(1)}`;
      } else if (digits.length === 10) {
        // Phone is 10 digits, add +1
        return `+1${digits}`;
      }
    }
    
    // India: +91 (10 digits)
    else if (country === 'IN') {
      if (digits.startsWith('91') && digits.length === 12) {
        // Phone has 91 country code, format as +91
        return `+91${digits.substring(2)}`;
      } else if (digits.length === 10 && (digits.startsWith('6') || digits.startsWith('7') || digits.startsWith('8') || digits.startsWith('9'))) {
        // Phone is 10 digits starting with Indian mobile prefixes, add +91
        return `+91${digits}`;
      }
    }
    
    // Invalid format
    return null;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneError('');
    
    // Allow only digits, +, -, (, ), and spaces
    const cleaned = value.replace(/[^\d+\-() ]/g, '');
    
    setFormData(prev => ({ ...prev, phone_number: cleaned }));
    
    // Validate if user has finished typing (more than 10 characters)
    if (cleaned.length >= 10) {
      const formatted = validateAndFormatPhone(cleaned, selectedCountry);
      if (!formatted) {
        const countryOption = COUNTRY_OPTIONS.find(c => c.code === selectedCountry);
        setPhoneError(`Please enter a valid 10-digit phone number for ${countryOption?.name}`);
      }
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setPhoneError(''); // Clear any existing phone errors when country changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!formData.phone_number?.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (formData.message.length > 4096) {
      toast.error('Message is too long. Please keep it under 4096 characters.');
      return;
    }

    // Validate and format phone number
    const formattedPhone = validateAndFormatPhone(formData.phone_number, selectedCountry);
    if (!formattedPhone) {
      const countryOption = COUNTRY_OPTIONS.find(c => c.code === selectedCountry);
      setPhoneError(`Please enter a valid 10-digit phone number for ${countryOption?.name}`);
      toast.error('Invalid phone number format');
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to send messages');
        return;
      }

      // Send WhatsApp message via Twilio (API route)
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone,
          message: formData.message,
          customerId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send WhatsApp message');
      }

      // Store conversation in database
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert([{
          customer_id: customerId,
          type: 'whatsapp',
          direction: 'outbound',
          message: formData.message,
          status: 'sent',
          external_id: result.messageId,
          metadata: {
            phone_number: formattedPhone,
          },
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving conversation:', error);
        toast.error('Message sent but failed to save to history');
        return;
      }

      toast.success('WhatsApp message sent successfully');
      onConversationAdded(conversation);
      setFormData(prev => ({ ...prev, message: '' }));
      
      // Clear the message input
      const messageInput = document.getElementById('message') as HTMLTextAreaElement;
      if (messageInput) {
        messageInput.focus();
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast.error('Failed to send WhatsApp message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    return today.toDateString() === messageDate.toDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* WhatsApp Form - Top Right */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Send WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              {/* Phone Number Input with Country Code */}
              <div>
                <Label htmlFor="phone" className="text-slate-300 text-sm font-medium">
                  Phone Number
                </Label>
                <div className="flex space-x-2 mt-1">
                  {/* Country Code Dropdown */}
                  <div className="w-auto">
                    <Select value={selectedCountry} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-10">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {COUNTRY_OPTIONS.map((country) => (
                          <SelectItem 
                            key={country.code} 
                            value={country.code} 
                            className="text-white hover:bg-slate-700"
                          >
                            <span className="flex items-center space-x-2">
                              <span>{country.flag}</span>
                              <span className="text-sm">{country.prefix}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder={`Enter phone number (e.g., ${COUNTRY_OPTIONS.find(c => c.code === selectedCountry)?.example})`}
                      className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        phoneError ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                )}
                <p className="text-slate-500 text-xs mt-1">
                  {(() => {
                    const country = COUNTRY_OPTIONS.find(c => c.code === selectedCountry);
                    if (country?.code === 'IN') {
                      return `Enter 10 digits starting with 6-9 (e.g., ${country.example}) → ${country.prefix}${country.example}`;
                    } else {
                      return `Enter 10 digits (e.g., ${country?.example}) → ${country?.prefix}${country?.example}`;
                    }
                  })()}
                </p>
              </div>
              
              {/* Message Input - Chat Style */}
              <div className="flex-1 flex flex-col">
                <Label htmlFor="message" className="text-slate-300 text-sm font-medium">Message</Label>
                <div className="mt-1 relative flex-1 flex flex-col">
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Type your WhatsApp message here... (Press Enter to send)"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none rounded-2xl pr-12 flex-1"
                    required
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className={`text-xs ${
                      formData.message.length > 4096 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {formData.message.length}/4096
                    </span>
                    <Button
                      type="submit"
                      disabled={loading || !formData.message.trim() || !formData.phone_number?.trim() || !!phoneError}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Send WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface - Left Side */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800 border-slate-700 h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp Chat History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            {conversations.length === 0 ? (
              <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">No WhatsApp messages yet</p>
                <p className="text-slate-500 text-sm mt-1">Start a conversation by sending a WhatsApp message</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-300px)]">
                {conversations.map((conversation, index) => {
                  const isOutbound = conversation.direction === 'outbound';
                  const showDate = index === 0 || 
                    !isToday(conversation.created_at) && 
                    (index === 0 || !isToday(conversations[index - 1].created_at));
                  
                  return (
                    <div key={conversation.id}>
                      {/* Date Separator */}
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-slate-700 px-3 py-1 rounded-full">
                            <span className="text-xs text-slate-400">
                              {isToday(conversation.created_at) ? 'Today' : formatDate(conversation.created_at)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                       {/* Message Bubble */}
                       <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] px-4 py-3 rounded-2xl break-words ${
                           isOutbound 
                             ? 'bg-green-600 text-white rounded-br-md' 
                             : 'bg-slate-700 text-white rounded-bl-md'
                         }`}>
                          <p className="text-sm leading-relaxed">{conversation.message}</p>
                          <div className={`flex items-center justify-end mt-2 space-x-1 ${
                            isOutbound ? 'text-green-100' : 'text-slate-400'
                          }`}>
                            <span className="text-xs">
                              {formatTime(conversation.created_at)}
                            </span>
                            {isOutbound && (
                              <div className="flex items-center space-x-1">
                                {conversation.status === 'sent' && (
                                  <div className="w-1 h-1 bg-green-300 rounded-full" />
                                )}
                                {conversation.status === 'delivered' && (
                                  <div className="flex space-x-0.5">
                                    <div className="w-1 h-1 bg-green-300 rounded-full" />
                                    <div className="w-1 h-1 bg-green-300 rounded-full" />
                                  </div>
                                )}
                                {conversation.status === 'failed' && (
                                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

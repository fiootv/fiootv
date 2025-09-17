'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Conversation, ConversationFormData } from '@/lib/types/conversation';
import { toast } from 'sonner';

interface EmailFormProps {
  customerId: string;
  customerEmail?: string;
  conversations: Conversation[];
  onConversationAdded: (conversation: Conversation) => void;
}

export default function EmailForm({ customerId, customerEmail, conversations, onConversationAdded }: EmailFormProps) {
  const [formData, setFormData] = useState<ConversationFormData>({
    type: 'email',
    message: '',
    email_address: customerEmail || '',
    subject: '',
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmailError('');
    setFormData(prev => ({ ...prev, email_address: value }));
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!formData.email_address?.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!formData.subject?.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!validateEmail(formData.email_address)) {
      setEmailError('Please enter a valid email address');
      toast.error('Invalid email address');
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to send emails');
        return;
      }

      // Send email via SMTP (API route)
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email_address,
          subject: formData.subject,
          message: formData.message,
          customerId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      // Store conversation in database
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert([{
          customer_id: customerId,
          type: 'email',
          direction: 'outbound',
          message: formData.message,
          status: 'sent',
          external_id: result.messageId,
          metadata: {
            email_address: formData.email_address,
            subject: formData.subject,
          },
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving conversation:', error);
        toast.error('Email sent but failed to save to history');
        return;
      }

      toast.success('Email sent successfully');
      onConversationAdded(conversation);
      setFormData(prev => ({ ...prev, message: '', subject: '' }));
      
      // Clear the message input
      const messageInput = document.getElementById('message') as HTMLTextAreaElement;
      if (messageInput) {
        messageInput.focus();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Email Form - Top Right */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              {/* Email Address Input */}
              <div>
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email_address}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Enter email address (e.g., customer@example.com)"
                    className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      emailError ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-red-400 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <Label htmlFor="subject" className="text-slate-300 text-sm font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
                    placeholder="Type your email message here... (Press Enter to send)"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none rounded-2xl pr-12 flex-1"
                    required
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {formData.message.length} characters
                    </span>
                    <Button
                      type="submit"
                      disabled={loading || !formData.message.trim() || !formData.email_address?.trim() || !formData.subject?.trim() || !!emailError}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Send Email
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
              <Mail className="w-5 h-5 mr-2" />
              Email History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full ">
            {conversations.length === 0 ? (
              <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">No emails yet</p>
                <p className="text-slate-500 text-sm mt-1">Start a conversation by sending an email</p>
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
                             ? 'bg-blue-600 text-white rounded-br-md' 
                             : 'bg-slate-700 text-white rounded-bl-md'
                         }`}>
                          {/* Email Subject */}
                          {conversation.metadata?.subject && (
                            <div className="font-medium text-sm mb-2 border-b border-white/20 pb-1">
                              {conversation.metadata.subject}
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{conversation.message}</p>
                          <div className={`flex items-center justify-end mt-2 space-x-1 ${
                            isOutbound ? 'text-blue-100' : 'text-slate-400'
                          }`}>
                            <span className="text-xs">
                              {formatTime(conversation.created_at)}
                            </span>
                            {isOutbound && (
                              <div className="flex items-center space-x-1">
                                {conversation.status === 'sent' && (
                                  <div className="w-1 h-1 bg-blue-300 rounded-full" />
                                )}
                                {conversation.status === 'delivered' && (
                                  <div className="flex space-x-0.5">
                                    <div className="w-1 h-1 bg-blue-300 rounded-full" />
                                    <div className="w-1 h-1 bg-blue-300 rounded-full" />
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

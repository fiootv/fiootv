'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mail, Smartphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Conversation } from '@/lib/types/conversation';
import SMSForm from './sms-form';
import WhatsAppForm from './whatsapp-form';
import EmailForm from './email-form';

interface CommunicationTabsProps {
  customerId: string;
  customerPhone?: string;
  customerEmail?: string;
}

export default function CommunicationTabs({ customerId, customerPhone, customerEmail }: CommunicationTabsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sms');
  const supabase = createClient();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, customerId]);

  const handleConversationAdded = (conversation: Conversation) => {
    setConversations(prev => [conversation, ...prev]);
  };

  const smsConversations = conversations.filter(c => c.type === 'sms');
  const emailConversations = conversations.filter(c => c.type === 'email');
  const whatsappConversations = conversations.filter(c => c.type === 'whatsapp');

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Customer Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger 
                value="sms" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                SMS
              </TabsTrigger>
              <TabsTrigger 
                value="email"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="whatsapp"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sms" className="mt-6">
              <SMSForm
                customerId={customerId}
                customerPhone={customerPhone}
                conversations={smsConversations}
                onConversationAdded={handleConversationAdded}
              />
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <EmailForm
                customerId={customerId}
                customerEmail={customerEmail}
                conversations={emailConversations}
                onConversationAdded={handleConversationAdded}
              />
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-6">
              <WhatsAppForm
                customerId={customerId}
                customerPhone={customerPhone}
                conversations={whatsappConversations}
                onConversationAdded={handleConversationAdded}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

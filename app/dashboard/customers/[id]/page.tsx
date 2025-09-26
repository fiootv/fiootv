'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Download, User, MessageSquare, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Customer } from '@/lib/types/customer';
import { toast } from 'sonner';
import CommunicationTabs from '@/components/communication/communication-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttachmentPreview from '@/components/attachment-preview';

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [previewOpen, setPreviewOpen] = useState(false);
  const supabase = createClient();

  const fetchCustomer = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          platforms(name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching customer:', error);
        toast.error('Customer not found');
        router.push('/dashboard/customers');
        return;
      }

      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('An error occurred while fetching customer');
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    if (params.id) {
      fetchCustomer(params.id as string);
    }
  }, [params.id, fetchCustomer]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'communication') {
      setActiveTab('communication');
    }
  }, [searchParams]);

  const handleDelete = async () => {
    if (!customer || !confirm('Are you sure you want to delete this customer?')) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);

      if (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to delete customer');
        return;
      }

      toast.success('Customer deleted successfully');
      router.push('/dashboard/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting the customer');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'inactive':
        return 'bg-red-500';
      case 'in_trial':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/customers')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{customer.full_name}</h1>
            <p className="text-slate-400 mt-1">{customer.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/dashboard/customers/${customer.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Customer
          </Button>
          <Button
            onClick={handleDelete}
            disabled={actionLoading}
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700">
          <TabsTrigger 
            value="info" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Customer Info
          </TabsTrigger>
          <TabsTrigger 
            value="communication"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Communication
          </TabsTrigger>
        </TabsList>

        {/* Customer Information Tab */}
        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Full Name</label>
                  <p className="text-white">{customer.full_name}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Email</label>
                  <p className="text-white">{customer.email}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Phone</label>
                  <p className="text-white">{customer.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Subscription Status</label>
                  <Badge className={`text-xs ${getStatusColor(customer.subscription_status)}`}>
                    {customer.subscription_status}
                  </Badge>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Billing Address</label>
                  <p className="text-white">{customer.billing_address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Shipping Address</label>
                  <p className="text-white">{customer.shipping_address || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Plan Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Plan</label>
                  <p className="text-white">{customer.plan_id}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Subscription ID</label>
                  <p className="text-white font-mono text-sm">{customer.subscription_id}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Price</label>
                  <p className="text-white">{customer.price ? formatCurrency(customer.price) : 'Not set'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Currency</label>
                  <p className="text-white">{customer.currency || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Start Date</label>
                  <p className="text-white">
                    {customer.subscription_start_date ? formatDate(customer.subscription_start_date) : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">End Date</label>
                  <p className="text-white">
                    {customer.subscription_end_date ? formatDate(customer.subscription_end_date) : 'Not set'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Payment Method</label>
                  <p className="text-white">{customer.payment_method || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Payment Status</label>
                  <p className="text-white">{customer.payment_status || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Payment Gateway</label>
                  <p className="text-white">{customer.payment_gateway || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Card Details</label>
                  <p className="text-white">{customer.card_details || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Reference Number</label>
                  <p className="text-white">{customer.reference_number || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Device Type</label>
                  <p className="text-white">
                    {(() => {
                      if (!customer.device_type) return 'Not specified';
                      if (Array.isArray(customer.device_type)) return customer.device_type.join(', ');
                      if (typeof customer.device_type === 'string') {
                        try {
                          const parsed = JSON.parse(customer.device_type);
                          return Array.isArray(parsed) ? parsed.join(', ') : customer.device_type;
                        } catch {
                          return customer.device_type;
                        }
                      }
                      return 'Not specified';
                    })()}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">MAC Address</label>
                  <p className="text-white font-mono text-sm">{customer.mac_address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Service Type</label>
                  <p className="text-white">{customer.service_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Trial Details</label>
                  <p className="text-white">
                    {customer.has_trial ? 'Yes' : 'No'}
                    {customer.has_trial && customer.trial_start_date && (
                      <span className="block text-sm text-slate-400">
                        {formatDate(customer.trial_start_date)} - {customer.trial_end_date ? formatDate(customer.trial_end_date) : 'Ongoing'}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Created</label>
                  <p className="text-white">{formatDate(customer.created_at)}</p>
                </div>
                {customer.attachment_file_url && (
                  <div>
                    <label className="text-slate-400 text-sm">Attachment</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-white">{customer.attachment_file_name}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewOpen(true)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(customer.attachment_file_url, '_blank')}
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="mt-6">
          <CommunicationTabs
            customerId={customer.id}
            customerPhone={customer.phone}
            customerEmail={customer.email}
          />
        </TabsContent>
      </Tabs>

      {/* Attachment Preview Modal */}
      {customer?.attachment_file_url && (
        <AttachmentPreview
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          attachmentUrl={customer.attachment_file_url}
          attachmentName={customer.attachment_file_name || 'Attachment'}
        />
      )}
    </div>
  );
}

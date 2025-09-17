'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomerForm from '@/components/customer-form';
import { CustomerFormData } from '@/lib/types/customer';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [initialData, setInitialData] = useState<CustomerFormData | null>(null);
  const supabase = createClient();

  const fetchCustomer = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching customer:', error);
        toast.error('Customer not found');
        router.push('/dashboard/customers');
        return;
      }

      // Convert customer data to form data format
      const formData: CustomerFormData = {
        customer_from: data.customer_from || '',
        subscription_status: data.subscription_status || '',
        full_name: data.full_name || '',
        phone: data.phone || '',
        email: data.email || '',
        billing_address: data.billing_address || '',
        shipping_address: data.shipping_address || '',
        currency: data.currency || '',
        subscription_id: data.subscription_id || '',
        plan_id: data.plan_id || '',
        subscription_start_date: data.subscription_start_date ? new Date(data.subscription_start_date).toISOString().slice(0, 16) : '',
        subscription_end_date: data.subscription_end_date ? new Date(data.subscription_end_date).toISOString().slice(0, 16) : '',
        price: data.price || 0,
        payment_method: data.payment_method || '',
        payment_status: data.payment_status || '',
        payment_gateway: data.payment_gateway || '',
        card_details: data.card_details || '',
        reference_number: data.reference_number || '',
        has_trial: data.has_trial || false,
        trial_start_date: data.trial_start_date ? new Date(data.trial_start_date).toISOString().slice(0, 16) : '',
        trial_end_date: data.trial_end_date ? new Date(data.trial_end_date).toISOString().slice(0, 16) : '',
        total_hours: data.total_hours || 0,
        device_type: (() => {
          if (!data.device_type) return [];
          if (Array.isArray(data.device_type)) return data.device_type;
          if (typeof data.device_type === 'string') {
            try {
              const parsed = JSON.parse(data.device_type);
              return Array.isArray(parsed) ? parsed : [data.device_type];
            } catch {
              return [data.device_type];
            }
          }
          return [];
        })(),
        mac_address: data.mac_address || '',
        service_type: data.service_type || '',
        any_other_device: data.any_other_device || '',
      };

      setInitialData(formData);
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

  const handleSubmit = async (data: CustomerFormData) => {
    setFormLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to edit a customer');
        return;
      }

      // Handle file upload if present
      let attachmentFileUrl: string | undefined = undefined;
      let attachmentFileName: string | undefined = undefined;

      if (data.attachment_file) {
        const fileExt = data.attachment_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `customer-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('customer-files')
          .upload(filePath, data.attachment_file);

        if (uploadError) {
          toast.error('Failed to upload file');
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('customer-files')
          .getPublicUrl(filePath);

        attachmentFileUrl = publicUrl;
        attachmentFileName = data.attachment_file.name;
      }

      // Prepare customer data for update
      const customerData = {
        customer_from: data.customer_from,
        subscription_status: data.subscription_status,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        billing_address: data.billing_address,
        shipping_address: data.shipping_address,
        currency: data.currency,
        subscription_id: data.subscription_id,
        plan_id: data.plan_id,
        subscription_start_date: data.subscription_start_date ? new Date(data.subscription_start_date).toISOString() : null,
        subscription_end_date: data.subscription_end_date ? new Date(data.subscription_end_date).toISOString() : null,
        price: data.price,
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        payment_gateway: data.payment_gateway,
        card_details: data.card_details,
        reference_number: data.reference_number,
        has_trial: data.has_trial,
        trial_start_date: data.trial_start_date ? new Date(data.trial_start_date).toISOString() : null,
        trial_end_date: data.trial_end_date ? new Date(data.trial_end_date).toISOString() : null,
        total_hours: data.total_hours,
        device_type: data.device_type,
        mac_address: data.mac_address,
        service_type: data.service_type,
        any_other_device: data.any_other_device,
        ...(attachmentFileUrl ? { attachment_file_url: attachmentFileUrl } : {}),
        ...(attachmentFileName ? { attachment_file_name: attachmentFileName } : {}),
        updated_at: new Date().toISOString(),
      };

      // Update customer
      const { error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating customer:', error);
        toast.error('Failed to update customer');
        return;
      }

      toast.success('Customer updated successfully');
      router.push(`/dashboard/customers/${params.id}`);
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('An error occurred while updating the customer');
    } finally {
      setFormLoading(false);
    }
  };

  const handleReset = () => {
    // Reset form to initial data
    if (initialData) {
      // This would reset the form to initial values
      // The CustomerForm component should handle this
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading customer data...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
     
      </div>

      <CustomerForm 
        onSubmit={handleSubmit} 
        onReset={handleReset} 
        loading={formLoading}
        initialData={initialData}
      />
    </div>
  );
}
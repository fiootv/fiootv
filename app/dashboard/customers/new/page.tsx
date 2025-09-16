'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/customer-form';
import { CustomerFormData } from '@/lib/types/customer';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create a customer');
        return;
      }

      // Get the first platform (you might want to make this selectable)
      const { data: platforms } = await supabase
        .from('platforms')
        .select('id')
        .limit(1);

      if (!platforms || platforms.length === 0) {
        toast.error('No platform found. Please create a platform first.');
        return;
      }

      // Handle file upload if present
      let attachmentFileUrl = null;
      let attachmentFileName = null;

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

      // Prepare customer data
      const customerData = {
        platform_id: platforms[0].id,
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
        attachment_file_url: attachmentFileUrl,
        attachment_file_name: attachmentFileName,
        created_by: user.id,
      };

      // Insert customer
      const { error } = await supabase
        .from('customers')
        .insert([customerData]);

      if (error) {
        console.error('Error creating customer:', error);
        toast.error('Failed to create customer');
        return;
      }

      toast.success('Customer created successfully');
      router.push('/dashboard/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('An error occurred while creating the customer');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Form reset is handled by the CustomerForm component
  };

  return (
    <div className="min-h-screen">
      <CustomerForm 
        onSubmit={handleSubmit} 
        onReset={handleReset} 
        loading={loading} 
      />
    </div>
  );
}

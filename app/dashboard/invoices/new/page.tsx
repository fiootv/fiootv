'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvoiceFormData } from '@/lib/types/invoice';
import { createClient } from '@/lib/supabase/client';
import InvoiceForm from '@/components/invoice-form';

export default function NewInvoicePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (formData: InvoiceFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate invoice number if not provided
      let invoiceNumber = formData.invoice_number;
      if (!invoiceNumber) {
        const { data: generatedNumber, error: generateError } = await supabase.rpc('generate_invoice_number');
        if (generateError) throw generateError;
        invoiceNumber = generatedNumber;
      }

      const { error } = await supabase
        .from('invoices')
        .insert([{
          ...formData,
          invoice_number: invoiceNumber,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    router.push('/dashboard/invoices');
  };

  return (
    <InvoiceForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      loading={loading}
    />
  );
}

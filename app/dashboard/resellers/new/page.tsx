'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResellerFormData } from '@/lib/types/reseller';
import { createClient } from '@/lib/supabase/client';
import ResellerForm from '@/components/reseller-form';

export default function NewResellerPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (formData: ResellerFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('resellers')
        .insert([{
          ...formData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      router.push('/dashboard/resellers');
    } catch (error) {
      console.error('Error creating reseller:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    router.push('/dashboard/resellers');
  };

  return (
    <ResellerForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      loading={loading}
    />
  );
}
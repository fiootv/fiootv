'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AbsenceFormData } from '@/lib/types/absence';
import { createClient } from '@/lib/supabase/client';
import AbsenceForm from '@/components/absence-form';

export default function NewAbsencePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (formData: AbsenceFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('absence')
        .insert([{
          ...formData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      router.push('/dashboard/absence');
    } catch (error) {
      console.error('Error creating absence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    router.push('/dashboard/absence');
  };

  return (
    <AbsenceForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      loading={loading}
    />
  );
}

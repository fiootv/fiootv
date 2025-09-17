'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoteFormData } from '@/lib/types/note';
import { createClient } from '@/lib/supabase/client';
import NotesForm from '@/components/notes-form';

export default function NewNotePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (formData: NoteFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert([{
          ...formData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      router.push('/dashboard/notes');
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    router.push('/dashboard/notes');
  };

  return (
    <NotesForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      loading={loading}
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Absence, AbsenceFormData } from '@/lib/types/absence';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Filter, Edit, Trash2, Calendar, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AbsencePage() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('absence')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAbsences(data || []);
    } catch (error) {
      console.error('Error fetching absences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAbsence = async (formData: AbsenceFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('absence')
        .insert([{
          ...formData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setAbsences(prev => [data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating absence:', error);
    }
  };

  const handleUpdateAbsence = async (formData: AbsenceFormData) => {
    if (!editingAbsence) return;

    try {
      const { data, error } = await supabase
        .from('absence')
        .update(formData)
        .eq('id', editingAbsence.id)
        .select()
        .single();

      if (error) throw error;
      
      setAbsences(prev => prev.map(absence => absence.id === editingAbsence.id ? data : absence));
      setEditingAbsence(null);
    } catch (error) {
      console.error('Error updating absence:', error);
    }
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    if (!confirm('Are you sure you want to delete this absence record?')) return;

    try {
      const { error } = await supabase
        .from('absence')
        .delete()
        .eq('id', absenceId);

      if (error) throw error;
      
      setAbsences(prev => prev.filter(absence => absence.id !== absenceId));
    } catch (error) {
      console.error('Error deleting absence:', error);
    }
  };

  const filteredAbsences = absences.filter(absence => {
    const matchesSearch = absence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingAbsence(null);
  };

  if (showForm || editingAbsence) {
    const AbsenceForm = require('@/components/absence-form').default;
    return (
      <AbsenceForm
        onSubmit={editingAbsence ? handleUpdateAbsence : handleCreateAbsence}
        onReset={resetForm}
        initialData={editingAbsence ? {
          description: editingAbsence.description,
          date: editingAbsence.date,
          email: editingAbsence.email,
        } : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Absence</h1>
          <p className="text-slate-400 mt-1">Manage absence records and tracking</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Absence
        </Button>
      </div>

      {/* Search Filter */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search absences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Absences List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Absence Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">Loading absences...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAbsences.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="text-slate-400">No absences found</div>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Record Absence
                    </Button>
                  )}
                </div>
              ) : (
                filteredAbsences.map((absence) => (
                  <div key={absence.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{absence.description}</h3>
                        <p className="text-slate-400 text-sm">{absence.email}</p>
                        <p className="text-slate-500 text-xs">
                          Date: {format(new Date(absence.date), 'MMM d, yyyy')} • 
                          Recorded {format(new Date(absence.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAbsence(absence)}
                        className="text-slate-400 hover:text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAbsence(absence.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

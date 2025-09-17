'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Note, NoteFormData, Platform, Customer } from '@/lib/types/note';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Filter, Edit, Trash2, Calendar, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import NotesForm from '@/components/notes-form';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchNotes();
    fetchPlatforms();
    fetchCustomers();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          platforms(name),
          customers(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCreateNote = async (formData: NoteFormData) => {
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
      
      setNotes(prev => [data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (formData: NoteFormData) => {
    if (!editingNote) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .update(formData)
        .eq('id', editingNote.id)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(note => note.id === editingNote.id ? data : note));
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || !platformFilter || note.platform_id === platformFilter;
    const matchesCustomer = customerFilter === 'all' || !customerFilter || note.customer_id === customerFilter;
    
    return matchesSearch && matchesPlatform && matchesCustomer;
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  if (showForm || editingNote) {
    return (
      <NotesForm
        onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        onReset={resetForm}
        initialData={editingNote ? {
          title: editingNote.title,
          description: editingNote.description,
          platform_id: editingNote.platform_id,
          customer_id: editingNote.customer_id,
        } : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Notes</h1>
          <p className="text-slate-400 mt-1">Manage your notes and documentation</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id} className="text-white hover:bg-slate-700">
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Filter by customer" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id} className="text-white hover:bg-slate-700">
                    {customer.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPlatformFilter('all');
                setCustomerFilter('all');
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-slate-400">Loading notes...</p>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || platformFilter || customerFilter 
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first note.'
              }
            </p>
            {!searchTerm && !platformFilter && !customerFilter && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-white line-clamp-2">
                    {note.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNote(note)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div 
                  className="text-slate-300 text-sm line-clamp-3 mb-4 prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.description }}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  
                  {note.platforms && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Building2 className="h-3 w-3" />
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {note.platforms.name}
                      </Badge>
                    </div>
                  )}
                  
                  {note.customers && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User className="h-3 w-3" />
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {note.customers.full_name}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

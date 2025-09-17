'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reseller, ResellerFormData, Platform } from '@/lib/types/reseller';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ResellerForm from '@/components/reseller-form';

export default function ResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const supabase = createClient();

  const fetchResellers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resellers')
        .select(`
          *,
          platforms(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched resellers data:', data);
      
      // If platforms data is not properly joined, fetch it separately
      const resellersWithPlatforms = await Promise.all(
        (data || []).map(async (reseller) => {
          if (!reseller.platforms) {
            const { data: platformData } = await supabase
              .from('platforms')
              .select('name')
              .eq('id', reseller.platform_id)
              .single();
            return { ...reseller, platforms: platformData };
          }
          return reseller;
        })
      );
      
      setResellers(resellersWithPlatforms);
    } catch (error) {
      console.error('Error fetching resellers:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchPlatforms = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchResellers();
    fetchPlatforms();
  }, [fetchResellers, fetchPlatforms]);

  const handleCreateReseller = async (formData: ResellerFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Form data being submitted:', formData);

      const insertData = {
        ...formData,
        created_by: user.id,
      };

      console.log('Data being inserted:', insertData);

      const { data, error } = await supabase
        .from('resellers')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setResellers(prev => [data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating reseller:', error);
    }
  };

  const handleUpdateReseller = async (formData: ResellerFormData) => {
    if (!editingReseller) return;

    try {
      const { data, error } = await supabase
        .from('resellers')
        .update(formData)
        .eq('id', editingReseller.id)
        .select()
        .single();

      if (error) throw error;
      
      setResellers(prev => prev.map(reseller => reseller.id === editingReseller.id ? data : reseller));
      setEditingReseller(null);
    } catch (error) {
      console.error('Error updating reseller:', error);
    }
  };

  const handleDeleteReseller = async (resellerId: string) => {
    if (!confirm('Are you sure you want to delete this reseller?')) return;

    try {
      const { error } = await supabase
        .from('resellers')
        .delete()
        .eq('id', resellerId);

      if (error) throw error;
      
      setResellers(prev => prev.filter(reseller => reseller.id !== resellerId));
    } catch (error) {
      console.error('Error deleting reseller:', error);
    }
  };

  const filteredResellers = resellers.filter(reseller => {
    const matchesSearch = reseller.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reseller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reseller.reseller_for.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || reseller.platform_id === platformFilter;
    
    return matchesSearch && matchesPlatform;
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingReseller(null);
  };

  if (showForm || editingReseller) {
    return (
      <ResellerForm
        onSubmit={editingReseller ? handleUpdateReseller : handleCreateReseller}
        onReset={resetForm}
        initialData={editingReseller ? {
          platform_id: editingReseller.platform_id,
          reseller_for: editingReseller.reseller_for,
          full_name: editingReseller.full_name,
          email: editingReseller.email,
          phone: editingReseller.phone,
          street_address: editingReseller.street_address,
          city: editingReseller.city,
          country: editingReseller.country,
        } : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Resellers</h1>
          <p className="text-slate-400 mt-1">Manage resellers and their platform associations</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reseller
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search resellers..."
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

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPlatformFilter('all');
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          </CardContent>
        </Card>

      {/* Resellers List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Reseller Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">Loading resellers...</div>
            </div>
          ) : (
          <div className="space-y-4">
              {filteredResellers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-slate-400">No resellers found</div>
                  {!searchTerm && platformFilter === 'all' && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Reseller
                    </Button>
                  )}
                </div>
              ) : (
                filteredResellers.map((reseller) => (
                  <div key={reseller.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {reseller.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                  </div>
                  <div>
                        <h3 className="text-white font-medium">{reseller.full_name}</h3>
                    <p className="text-slate-400 text-sm">{reseller.email}</p>
                        <p className="text-slate-500 text-xs">
                          {reseller.reseller_for} • {reseller.platforms?.name || 'Unknown Platform'} • 
                          Joined {format(new Date(reseller.created_at), 'MMM d, yyyy')}
                        </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingReseller(reseller)}
                        className="text-slate-400 hover:text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                    </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReseller(reseller.id)}
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
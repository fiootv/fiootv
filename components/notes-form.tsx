'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { NoteFormData, Platform, Customer } from '@/lib/types/note';
import { createClient } from '@/lib/supabase/client';

interface NotesFormProps {
  onSubmit: (data: NoteFormData) => void;
  onReset: () => void;
  loading?: boolean;
  initialData?: NoteFormData;
}

export default function NotesForm({ onSubmit, onReset, loading = false, initialData }: NotesFormProps) {
  const [formData, setFormData] = useState<NoteFormData>(initialData || {
    title: '',
    description: '',
    platform_id: undefined,
    customer_id: undefined,
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPlatforms();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const fetchPlatforms = async () => {
    setLoadingPlatforms(true);
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setLoadingPlatforms(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleInputChange = (field: keyof NoteFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      platform_id: undefined,
      customer_id: undefined,
    });
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Note' : 'Add Note'}
          </h1>
          <p className="text-slate-400 mt-1">
            {initialData ? 'Update your note details.' : 'Create a new note with optional platform and customer linking.'}
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter note title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => handleInputChange('description', content)}
                placeholder="Start writing your note description..."
                className="min-h-[300px]"
              />
            </div>

            {/* Optional Linking Section */}
            <div className="space-y-6">
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Optional Linking</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Link this note to a platform and/or customer for better organization.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="platform_id" className="text-white">
                      Platform
                    </Label>
                    <Select
                      value={formData.platform_id || "none"}
                      onValueChange={(value) => handleInputChange('platform_id', value === "none" ? "" : value)}
                      disabled={loadingPlatforms}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select a platform"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="none" className="text-white hover:bg-slate-700">
                          No platform
                        </SelectItem>
                        {platforms.map((platform) => (
                          <SelectItem 
                            key={platform.id} 
                            value={platform.id}
                            className="text-white hover:bg-slate-700"
                          >
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="customer_id" className="text-white">
                      Customer
                    </Label>
                    <Select
                      value={formData.customer_id || "none"}
                      onValueChange={(value) => handleInputChange('customer_id', value === "none" ? "" : value)}
                      disabled={loadingCustomers}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select a customer"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="none" className="text-white hover:bg-slate-700">
                          No customer
                        </SelectItem>
                        {customers.map((customer) => (
                          <SelectItem 
                            key={customer.id} 
                            value={customer.id}
                            className="text-white hover:bg-slate-700"
                          >
                            {customer.full_name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.description.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Note' : 'Create Note')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-2"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

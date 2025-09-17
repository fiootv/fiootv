'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResellerFormData, Platform } from '@/lib/types/reseller';
import { createClient } from '@/lib/supabase/client';

interface ResellerFormProps {
  onSubmit: (data: ResellerFormData) => void;
  onReset: () => void;
  loading?: boolean;
  initialData?: ResellerFormData;
}

export default function ResellerForm({ onSubmit, onReset, loading = false, initialData }: ResellerFormProps) {
  const [formData, setFormData] = useState<ResellerFormData>(initialData || {
    platform_id: '',
    reseller_for: '',
    full_name: '',
    email: '',
    phone: undefined,
    street_address: undefined,
    city: undefined,
    country: undefined,
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const supabase = createClient();

  const fetchPlatforms = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ResellerFormData, value: string) => {
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
      platform_id: '',
      reseller_for: '',
      full_name: '',
      email: '',
      phone: undefined,
      street_address: undefined,
      city: undefined,
      country: undefined,
    });
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Reseller' : 'Add Reseller'}
          </h1>
          <p className="text-slate-400 mt-1">
            {initialData ? 'Update reseller information and platform linking.' : 'Create a new reseller and link them to a platform.'}
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Reseller Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Selection - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="platform_id" className="text-white">
                Platform *
              </Label>
              <Select
                value={formData.platform_id}
                onValueChange={(value) => handleInputChange('platform_id', value)}
                disabled={loadingPlatforms}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select a platform"} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
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

            {/* Two Column Layout for Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reseller For */}
              <div className="space-y-2">
                <Label htmlFor="reseller_for" className="text-white">
                  Reseller For *
                </Label>
                <Input
                  id="reseller_for"
                  type="text"
                  placeholder="Enter reseller for (e.g., Company Name, Individual)"
                  value={formData.reseller_for}
                  onChange={(e) => handleInputChange('reseller_for', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number (e.g., +1234567890)"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers, +, -, (, ), and spaces
                    const phoneRegex = /^[\d\s\+\-\(\)]*$/;
                    if (phoneRegex.test(value) || value === '') {
                      handleInputChange('phone', value);
                    }
                  }}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
                {formData.phone && formData.phone.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {formData.phone.length < 10 ? 'Phone number seems too short' : 'Valid phone format'}
                  </p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Optional address details for the reseller.
                </p>
                
                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="space-y-2">
                    <Label htmlFor="street_address" className="text-white">
                      Street Address
                    </Label>
                    <Input
                      id="street_address"
                      type="text"
                      placeholder="Enter street address"
                      value={formData.street_address || ''}
                      onChange={(e) => handleInputChange('street_address', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* City and Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Enter city"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-white">
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="Enter country"
                        value={formData.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || !formData.platform_id || !formData.reseller_for.trim() || !formData.full_name.trim() || !formData.email.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Reseller' : 'Create Reseller')}
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

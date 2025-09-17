'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AbsenceFormData } from '@/lib/types/absence';

interface AbsenceFormProps {
  onSubmit: (data: AbsenceFormData) => void;
  onReset: () => void;
  loading?: boolean;
  initialData?: AbsenceFormData;
}

export default function AbsenceForm({ onSubmit, onReset, loading = false, initialData }: AbsenceFormProps) {
  const [formData, setFormData] = useState<AbsenceFormData>(initialData || {
    description: '',
    date: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof AbsenceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      description: '',
      date: '',
      email: '',
    });
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Absence' : 'Add Absence'}
          </h1>
          <p className="text-slate-400 mt-1">
            {initialData ? 'Update absence information.' : 'Record a new absence entry.'}
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Absence Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Enter absence description (e.g., sick leave, personal time, vacation)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={4}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || !formData.description.trim() || !formData.date || !formData.email.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Absence' : 'Create Absence')}
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

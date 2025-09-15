"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlatforms(data || []);
    } catch (err) {
      console.error('Error fetching platforms:', err);
      setError('Failed to fetch platforms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleAddNew = () => {
    setEditingPlatform(null);
    setFormData({ name: "" });
    setIsFormOpen(true);
    setError(null);
  };

  const handleEdit = (platform: Platform) => {
    setEditingPlatform(platform);
    setFormData({ name: platform.name });
    setIsFormOpen(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPlatform(null);
    setFormData({ name: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingPlatform) {
        // Update existing platform
        const { error } = await supabase
          .from('platforms')
          .update({ 
            name: formData.name.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPlatform.id);

        if (error) throw error;
      } else {
        // Create new platform
        const { error } = await supabase
          .from('platforms')
          .insert({ name: formData.name.trim() });

        if (error) throw error;
      }

      await fetchPlatforms();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (platformId: string) => {
    if (!confirm('Are you sure you want to delete this platform?')) return;

    try {
      const { error } = await supabase
        .from('platforms')
        .delete()
        .eq('id', platformId);

      if (error) throw error;
      await fetchPlatforms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete platform');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platforms</h1>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platforms</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your streaming platforms
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Platform
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              {editingPlatform 
                ? 'Update the platform information below.' 
                : 'Fill in the details to create a new platform.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Platform Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Enter platform name"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : (editingPlatform ? 'Update Platform' : 'Create Platform')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Platforms List */}
      {platforms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Card key={platform.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <Badge variant="secondary">
                    {new Date(platform.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription>
                  Created {new Date(platform.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(platform)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(platform.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No platforms yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get started by creating your first platform.
                </p>
              </div>
              <Button onClick={handleAddNew} className="flex items-center gap-2 flex justify-center mx-auto">
                <Plus className="w-4 h-4" />
                Add Platform
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceFormData, Platform, Customer, CURRENCIES, PAYMENT_METHODS } from '@/lib/types/invoice';
import { createClient } from '@/lib/supabase/client';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
  onReset: () => void;
  loading?: boolean;
  initialData?: InvoiceFormData;
}

export default function InvoiceForm({ onSubmit, onReset, loading = false, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialData || {
    platform_id: '',
    customer_id: '',
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    total_amount: 0,
    currency: 'USD',
    description: '',
    payment_method: undefined,
    paid_date: '',
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [autoGenerateNumber, setAutoGenerateNumber] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPlatforms();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setAutoGenerateNumber(!initialData.invoice_number);
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

  const generateInvoiceNumber = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      if (error) throw error;
      setFormData(prev => ({ ...prev, invoice_number: data }));
    } catch (error) {
      console.error('Error generating invoice number:', error);
    }
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty strings to undefined for optional fields
    const cleanedData = {
      ...formData,
      description: formData.description || undefined,
      payment_method: formData.payment_method || undefined,
      paid_date: formData.paid_date || undefined,
      invoice_number: autoGenerateNumber ? undefined : formData.invoice_number,
    };
    
    onSubmit(cleanedData);
  };

  const handleReset = () => {
    setFormData({
      platform_id: '',
      customer_id: '',
      invoice_number: '',
      invoice_date: '',
      due_date: '',
      total_amount: 0,
      currency: 'USD',
      description: '',
      payment_method: undefined,
      paid_date: '',
    });
    setAutoGenerateNumber(true);
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-slate-400 mt-1">
            {initialData ? 'Update invoice information and details.' : 'Create a new invoice for a customer and platform.'}
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform and Customer Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Selection */}
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

              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer_id" className="text-white">
                  Customer *
                </Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => handleInputChange('customer_id', value)}
                  disabled={loadingCustomers}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select a customer"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
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

            {/* Invoice Number */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="invoice_number" className="text-white">
                  Invoice Number
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto_generate"
                    checked={autoGenerateNumber}
                    onChange={(e) => {
                      setAutoGenerateNumber(e.target.checked);
                      if (e.target.checked) {
                        generateInvoiceNumber();
                      }
                    }}
                    className="rounded border-slate-600 bg-slate-800 text-blue-600"
                  />
                  <Label htmlFor="auto_generate" className="text-sm text-slate-400">
                    Auto-generate
                  </Label>
                </div>
              </div>
              <Input
                id="invoice_number"
                type="text"
                placeholder="Enter invoice number or leave blank for auto-generation"
                value={formData.invoice_number}
                onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                disabled={autoGenerateNumber}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice Date */}
              <div className="space-y-2">
                <Label htmlFor="invoice_date" className="text-white">
                  Invoice Date *
                </Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-white">
                  Due Date *
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Amount */}
              <div className="space-y-2">
                <Label htmlFor="total_amount" className="text-white">
                  Total Amount *
                </Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.total_amount || ''}
                  onChange={(e) => handleInputChange('total_amount', parseFloat(e.target.value) || 0)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-white">
                  Currency *
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {CURRENCIES.map((currency) => (
                      <SelectItem 
                        key={currency} 
                        value={currency}
                        className="text-white hover:bg-slate-700"
                      >
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter invoice description or notes"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Optional payment details for the invoice.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label htmlFor="payment_method" className="text-white">
                      Payment Method
                    </Label>
                    <Select
                      value={formData.payment_method || "none"}
                      onValueChange={(value) => handleInputChange('payment_method', value === "none" ? "" : value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="none" className="text-white hover:bg-slate-700">
                          No payment method
                        </SelectItem>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem 
                            key={method} 
                            value={method}
                            className="text-white hover:bg-slate-700"
                          >
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Paid Date */}
                  <div className="space-y-2">
                    <Label htmlFor="paid_date" className="text-white">
                      Paid Date
                    </Label>
                    <Input
                      id="paid_date"
                      type="date"
                      value={formData.paid_date || ''}
                      onChange={(e) => handleInputChange('paid_date', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || !formData.platform_id || !formData.customer_id || !formData.invoice_date || !formData.due_date || formData.total_amount <= 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? 'Saving...' : (initialData ? 'Update Invoice' : 'Create Invoice')}
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

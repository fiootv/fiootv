'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Invoice, InvoiceWithRelations, InvoiceFormData, Platform, Customer } from '@/lib/types/invoice';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Filter, Edit, Trash2, FileText, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import InvoiceForm from '@/components/invoice-form';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithRelations | null>(null);
  const supabase = createClient();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          platforms(name),
          customers(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
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

  const fetchCustomers = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchInvoices();
    fetchPlatforms();
    fetchCustomers();
  }, [fetchInvoices, fetchPlatforms, fetchCustomers]);

  const handleCreateInvoice = async (formData: InvoiceFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate invoice number if not provided
      let invoiceNumber = formData.invoice_number;
      if (!invoiceNumber) {
        const { data: generatedNumber, error: generateError } = await supabase.rpc('generate_invoice_number');
        if (generateError) throw generateError;
        invoiceNumber = generatedNumber;
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          ...formData,
          invoice_number: invoiceNumber,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setInvoices(prev => [data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleUpdateInvoice = async (formData: InvoiceFormData) => {
    if (!editingInvoice) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(formData)
        .eq('id', editingInvoice.id)
        .select()
        .single();

      if (error) throw error;
      
      setInvoices(prev => prev.map(invoice => invoice.id === editingInvoice.id ? data : invoice));
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.platforms?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customers?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || invoice.platform_id === platformFilter;
    const matchesCustomer = customerFilter === 'all' || invoice.customer_id === customerFilter;
    
    return matchesSearch && matchesPlatform && matchesCustomer;
  });

  const getStatusBadge = (invoice: Invoice) => {
    if (invoice.paid_date) {
      return <Badge className="bg-green-500 text-white">Paid</Badge>;
    }
    
    const dueDate = new Date(invoice.due_date);
    const today = new Date();
    const isOverdue = dueDate < today;
    
    if (isOverdue) {
      return <Badge className="bg-red-500 text-white">Overdue</Badge>;
    }
    
    return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  if (showForm || editingInvoice) {
    return (
      <InvoiceForm
        onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
        onReset={resetForm}
        initialData={editingInvoice ? {
          platform_id: editingInvoice.platform_id,
          customer_id: editingInvoice.customer_id,
          invoice_number: editingInvoice.invoice_number,
          invoice_date: editingInvoice.invoice_date,
          due_date: editingInvoice.due_date,
          total_amount: editingInvoice.total_amount,
          currency: editingInvoice.currency,
          description: editingInvoice.description,
          payment_method: editingInvoice.payment_method,
          paid_date: editingInvoice.paid_date,
          payment_notes: editingInvoice.payment_notes,
          document_urls: editingInvoice.document_urls,
        } : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-slate-400 mt-1">Manage invoices and billing records</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
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

      {/* Invoices List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Invoice Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">Loading invoices...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-slate-400">No invoices found</div>
                  {!searchTerm && platformFilter === 'all' && customerFilter === 'all' && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  )}
                </div>
              ) : (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{invoice.invoice_number}</h3>
                        <p className="text-slate-400 text-sm">
                          {invoice.platforms?.name} • {invoice.customers?.full_name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {format(new Date(invoice.invoice_date), 'MMM d, yyyy')} • 
                          Due {format(new Date(invoice.due_date), 'MMM d, yyyy')} • 
                          {invoice.currency} {invoice.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(invoice)}
                      {invoice.document_urls && invoice.document_urls.length > 0 && (
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-xs">
                            {invoice.document_urls.length} Document{invoice.document_urls.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingInvoice(invoice)}
                        className="text-slate-400 hover:text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
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
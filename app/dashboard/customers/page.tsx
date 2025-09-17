'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  CreditCard,
  Filter,
  MessageSquare
} from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { Customer } from '@/lib/types/customer';
import { toast } from 'sonner';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [platforms, setPlatforms] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  });
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
    fetchPlatforms();
  }, [fetchCustomers, fetchPlatforms]);

  const fetchCustomers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          platforms(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to fetch customers');
        return;
      }

      setCustomers(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('An error occurred while fetching customers');
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

  const calculateStats = (customerData: Customer[]) => {
    const totalCustomers = customerData.length;
    const activeSubscriptions = customerData.filter(c => c.subscription_status === 'active').length;
    const monthlyRevenue = customerData
      .filter(c => c.subscription_status === 'active' && c.price)
      .reduce((sum, c) => sum + (c.price || 0), 0);
    const conversionRate = totalCustomers > 0 ? (activeSubscriptions / totalCustomers) * 100 : 0;

    setStats({
      totalCustomers,
      activeSubscriptions,
      monthlyRevenue,
      conversionRate: parseFloat(conversionRate.toFixed(1))
    });
  };

  const handleView = (customer: Customer) => {
    // Navigate to customer details page
    router.push(`/dashboard/customers/${customer.id}`);
  };

  const handleEdit = (customer: Customer) => {
    // Navigate to edit customer page
    router.push(`/dashboard/customers/${customer.id}/edit`);
  };

  const handleChat = (customer: Customer) => {
    // Navigate to customer details page with communication tab
    router.push(`/dashboard/customers/${customer.id}?tab=communication`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to delete customer');
        return;
      }

      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting the customer');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.subscription_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || customer.platform_id === platformFilter;
    const matchesStatus = statusFilter === 'all' || customer.subscription_status === statusFilter;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'inactive':
        return 'bg-red-500';
      case 'in_trial':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-slate-400 mt-1">Manage your FiooTV customers and their subscriptions.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/dashboard/customers/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
            <p className="text-xs text-slate-400">All time customers</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
            <p className="text-xs text-slate-400">{stats.conversionRate}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-slate-400">From active subscriptions</p>
          </CardContent>
        </Card>
    
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All statuses</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-slate-700">Pending</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-slate-700">Cancelled</SelectItem>
                <SelectItem value="expired" className="text-white hover:bg-slate-700">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPlatformFilter('all');
                setStatusFilter('all');
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">Loading customers...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400">No customers found</div>
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {customer.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{customer.full_name}</h3>
                        <p className="text-slate-400 text-sm">{customer.email}</p>
                        <p className="text-slate-500 text-xs">
                          Joined {formatDate(customer.created_at)} • {customer.plan_id} Plan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {customer.price ? formatCurrency(customer.price) : 'N/A'}
                        </p>
                        <p className="text-slate-400 text-xs">Monthly</p>
                      </div>
                      <Badge 
                        className={`text-xs ${getStatusColor(customer.subscription_status)}`}
                      >
                        {customer.subscription_status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-white"
                          onClick={() => handleView(customer)}
                          title="View customer details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-blue-500"
                          onClick={() => handleChat(customer)}
                          title="Start conversation"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-white"
                          onClick={() => handleEdit(customer)}
                          title="Edit customer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => handleDelete(customer.id)}
                          disabled={actionLoading === customer.id}
                          title="Delete customer"
                        >
                          {actionLoading === customer.id ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  StickyNote,
  Building2,
  Calendar
} from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { Customer } from '@/lib/types/customer';
import { Invoice } from '@/lib/types/invoice';
import { Note } from '@/lib/types/note';
import { Reseller } from '@/lib/types/reseller';
import { Absence } from '@/lib/types/absence';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    totalInvoices: 0,
    totalNotes: 0,
    totalResellers: 0,
    totalAbsences: 0
  });
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentResellers, setRecentResellers] = useState<Reseller[]>([]);
  const [recentAbsences, setRecentAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch customers data
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (customersError) throw customersError;

      // Fetch invoices data
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (invoicesError) throw invoicesError;

      // Fetch notes data
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (notesError) throw notesError;

      // Fetch resellers data
      const { data: resellers, error: resellersError } = await supabase
        .from('resellers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (resellersError) throw resellersError;

      // Fetch absence data
      const { data: absences, error: absencesError } = await supabase
        .from('absence')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (absencesError) throw absencesError;

      // Calculate stats
      const totalCustomers = customers?.length || 0;
      const activeSubscriptions = customers?.filter(c => c.subscription_status === 'active').length || 0;
      const monthlyRevenue = customers
        ?.filter(c => c.subscription_status === 'active' && c.price)
        .reduce((sum, c) => sum + (c.price || 0), 0) || 0;
      const conversionRate = totalCustomers > 0 ? (activeSubscriptions / totalCustomers) * 100 : 0;

      setStats({
        totalCustomers,
        activeSubscriptions,
        monthlyRevenue,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        totalInvoices: invoices?.length || 0,
        totalNotes: notes?.length || 0,
        totalResellers: resellers?.length || 0,
        totalAbsences: absences?.length || 0
      });

      setRecentCustomers(customers || []);
      setRecentInvoices(invoices || []);
      setRecentNotes(notes || []);
      setRecentResellers(resellers || []);
      setRecentAbsences(absences || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  const getInvoiceStatusBadge = (invoice: Invoice) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with FiooTV.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard/customers/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
            <p className="text-xs text-slate-400">{stats.conversionRate}% of total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-slate-400">From active subscriptions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalInvoices}</div>
            <p className="text-xs text-slate-400">All time invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Customers</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest customer registrations
                </CardDescription>
              </div>
              <Link href="/dashboard/customers">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-slate-400">Loading customers...</div>
              </div>
            ) : recentCustomers.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-slate-400">No customers found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {customer.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.full_name}</p>
                        <p className="text-slate-400 text-sm">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${getStatusColor(customer.subscription_status)}`}
                      >
                        {customer.subscription_status}
                      </Badge>
                      <span className="text-slate-400 text-sm">{customer.plan_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Invoices</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest invoice records
                </CardDescription>
              </div>
              <Link href="/dashboard/invoices">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-slate-400">Loading invoices...</div>
              </div>
            ) : recentInvoices.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-slate-400">No invoices found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{invoice.invoice_number}</p>
                        <p className="text-slate-400 text-sm">
                          {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getInvoiceStatusBadge(invoice)}
                      <span className="text-slate-400 text-sm">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notes */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Notes</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest documentation
                </CardDescription>
              </div>
              <Link href="/dashboard/notes">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-slate-400">Loading notes...</div>
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-slate-400">No notes found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3 mb-2">
                      <StickyNote className="h-4 w-4 text-yellow-500" />
                      <p className="text-white font-medium text-sm line-clamp-1">{note.title}</p>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2" 
                       dangerouslySetInnerHTML={{ __html: note.description }} />
                    <p className="text-slate-500 text-xs mt-2">
                      {format(new Date(note.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Resellers */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Resellers</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest reseller registrations
                </CardDescription>
              </div>
              <Link href="/dashboard/resellers">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-slate-400">Loading resellers...</div>
              </div>
            ) : recentResellers.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-slate-400">No resellers found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentResellers.map((reseller) => (
                  <div key={reseller.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{reseller.full_name}</p>
                        <p className="text-slate-400 text-sm">{reseller.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">{reseller.reseller_for}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Absences */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Absences</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest absence records
                </CardDescription>
              </div>
              <Link href="/dashboard/absence">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-slate-400">Loading absences...</div>
              </div>
            ) : recentAbsences.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-slate-400">No absences found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAbsences.map((absence) => (
                  <div key={absence.id} className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <p className="text-white font-medium text-sm line-clamp-1">{absence.description}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{absence.email}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {format(new Date(absence.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/customers/new">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
                <UserCheck className="h-6 w-6" />
                <span>Add Customer</span>
              </Button>
            </Link>
            <Link href="/dashboard/invoices/new">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
                <FileText className="h-6 w-6" />
                <span>Create Invoice</span>
              </Button>
            </Link>
            <Link href="/dashboard/notes/new">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
                <StickyNote className="h-6 w-6" />
                <span>Add Note</span>
              </Button>
            </Link>
            <Link href="/dashboard/resellers/new">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
                <Building2 className="h-6 w-6" />
                <span>Add Reseller</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

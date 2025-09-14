import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  CreditCard
} from "lucide-react";

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "John Smith", email: "john@example.com", plan: "Premium", status: "active", joinDate: "2024-01-15", revenue: "$99.99" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", plan: "Basic", status: "active", joinDate: "2024-01-14", revenue: "$29.99" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", plan: "Premium", status: "pending", joinDate: "2024-01-13", revenue: "$99.99" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", plan: "Standard", status: "active", joinDate: "2024-01-12", revenue: "$59.99" },
    { id: 5, name: "David Brown", email: "david@example.com", plan: "Premium", status: "inactive", joinDate: "2024-01-11", revenue: "$99.99" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-slate-400 mt-1">Manage your FiooTV customers and their subscriptions.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,847</div>
            <p className="text-xs text-slate-400">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,923</div>
            <p className="text-xs text-slate-400">67.5% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,320</div>
            <p className="text-xs text-slate-400">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3.2%</div>
            <p className="text-xs text-slate-400">-2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Customers</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{customer.name}</h3>
                    <p className="text-slate-400 text-sm">{customer.email}</p>
                    <p className="text-slate-500 text-xs">Joined {customer.joinDate} • {customer.plan} Plan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white font-medium">{customer.revenue}</p>
                    <p className="text-slate-400 text-xs">Monthly</p>
                  </div>
                  <Badge 
                    variant={customer.status === 'active' ? 'default' : customer.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {customer.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

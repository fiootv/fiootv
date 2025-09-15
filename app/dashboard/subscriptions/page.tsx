import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CreditCard,
  Calendar,
  DollarSign
} from "lucide-react";

export default function SubscriptionsPage() {
  const subscriptions = [
    { id: 1, customer: "John Smith", plan: "Premium", status: "active", amount: "$99.99", nextBilling: "2024-02-15", startDate: "2024-01-15" },
    { id: 2, customer: "Sarah Johnson", plan: "Basic", status: "active", amount: "$29.99", nextBilling: "2024-02-14", startDate: "2024-01-14" },
    { id: 3, customer: "Mike Wilson", plan: "Premium", status: "pending", amount: "$99.99", nextBilling: "2024-02-13", startDate: "2024-01-13" },
    { id: 4, customer: "Emily Davis", plan: "Standard", status: "active", amount: "$59.99", nextBilling: "2024-02-12", startDate: "2024-01-12" },
    { id: 5, customer: "David Brown", plan: "Premium", status: "cancelled", amount: "$99.99", nextBilling: "N/A", startDate: "2024-01-11" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          <p className="text-slate-400 mt-1">Manage FiooTV subscriptions and billing cycles.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,923</div>
            <p className="text-xs text-slate-400">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,456</div>
            <p className="text-xs text-slate-400">75.7% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,320</div>
            <p className="text-xs text-slate-400">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Renewal Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87.2%</div>
            <p className="text-xs text-slate-400">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Subscriptions</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{subscription.customer}</h3>
                    <p className="text-slate-400 text-sm">{subscription.plan} Plan • Started {subscription.startDate}</p>
                    <p className="text-slate-500 text-xs">Next billing: {subscription.nextBilling}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white font-medium">{subscription.amount}</p>
                    <p className="text-slate-400 text-xs">Monthly</p>
                  </div>
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : subscription.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {subscription.status}
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

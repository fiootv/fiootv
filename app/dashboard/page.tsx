import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MoreHorizontal
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Total Customers",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      description: "Since last month"
    },
    {
      title: "Active Subscriptions",
      value: "1,923",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      description: "Since last month"
    },
    {
      title: "Monthly Revenue",
      value: "$45,320",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      description: "Since last month"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      description: "Since last month"
    }
  ];

  const recentCustomers = [
    { id: 1, name: "John Smith", email: "john@example.com", plan: "Premium", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", plan: "Basic", status: "active", joinDate: "2024-01-14" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", plan: "Premium", status: "pending", joinDate: "2024-01-13" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", plan: "Standard", status: "active", joinDate: "2024-01-12" },
    { id: 5, name: "David Brown", email: "david@example.com", plan: "Premium", status: "inactive", joinDate: "2024-01-11" },
  ];

  const topSellingPlans = [
    { name: "Premium Plan", sales: 45, revenue: "$12,450" },
    { name: "Standard Plan", sales: 32, revenue: "$8,960" },
    { name: "Basic Plan", sales: 28, revenue: "$4,200" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with FiooTV.</p>
        </div>
        <div className="flex space-x-3">
        
          <a href="/dashboard/customers/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add Customer
          </Button>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 hidden">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-gray-400">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 hidden">
        {/* Recent Customers */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Customers</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest customer registrations
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-sm">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={customer.status === 'active' ? 'default' : customer.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {customer.status}
                    </Badge>
                    <span className="text-gray-400 text-sm">{customer.plan}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Plans */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Selling Plans</CardTitle>
            <CardDescription className="text-gray-400">
              This month&apos;s best performers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingPlans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{plan.name}</p>
                    <p className="text-gray-400 text-sm">{plan.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{plan.revenue}</p>
                    <div className="w-16 bg-gray-800 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(plan.sales / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800 hidden">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <UserCheck className="h-6 w-6" />
              <span>Add Customer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <CreditCard className="h-6 w-6" />
              <span>Create Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <DollarSign className="h-6 w-6" />
              <span>Add Transaction</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <Eye className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

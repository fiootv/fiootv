import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  DollarSign
} from "lucide-react";

export default function ResellersPage() {
  const resellers = [
    { id: 1, name: "Tech Solutions Inc", email: "contact@techsolutions.com", status: "active", customers: 156, revenue: "$15,600", joinDate: "2024-01-15" },
    { id: 2, name: "Media Partners LLC", email: "info@mediapartners.com", status: "active", customers: 89, revenue: "$8,900", joinDate: "2024-01-10" },
    { id: 3, name: "Digital Ventures", email: "hello@digitalventures.com", status: "pending", customers: 23, revenue: "$2,300", joinDate: "2024-01-05" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reseller Management</h1>
          <p className="text-slate-400 mt-1">Manage your FiooTV reseller partners and their performance.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Reseller
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Resellers</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-slate-400">+1 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Resellers</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-slate-400">66.7% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">268</div>
            <p className="text-xs text-slate-400">Across all resellers</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$26,800</div>
            <p className="text-xs text-slate-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Resellers List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Resellers</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search resellers..."
                  className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resellers.map((reseller) => (
              <div key={reseller.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{reseller.name}</h3>
                    <p className="text-slate-400 text-sm">{reseller.email}</p>
                    <p className="text-slate-500 text-xs">Joined {reseller.joinDate} • {reseller.customers} customers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white font-medium">{reseller.revenue}</p>
                    <p className="text-slate-400 text-xs">Monthly Revenue</p>
                  </div>
                  <Badge 
                    variant={reseller.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {reseller.status}
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

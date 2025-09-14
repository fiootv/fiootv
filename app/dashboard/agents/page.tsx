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
  Users
} from "lucide-react";

export default function AgentsPage() {
  const agents = [
    { id: 1, name: "John Smith", email: "john@fiootv.com", role: "Senior Agent", status: "active", customers: 45, joinDate: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@fiootv.com", role: "Agent", status: "active", customers: 32, joinDate: "2024-01-10" },
    { id: 3, name: "Mike Wilson", email: "mike@fiootv.com", role: "Junior Agent", status: "inactive", customers: 18, joinDate: "2024-01-05" },
    { id: 4, name: "Emily Davis", email: "emily@fiootv.com", role: "Agent", status: "active", customers: 28, joinDate: "2024-01-01" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Management</h1>
          <p className="text-slate-400 mt-1">Manage your team of customer service agents.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-slate-400">+1 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-slate-400">75% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">123</div>
            <p className="text-xs text-slate-400">Across all agents</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Avg. per Agent</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">31</div>
            <p className="text-xs text-slate-400">Customers per agent</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Agents</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search agents..."
                  className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{agent.name}</h3>
                    <p className="text-slate-400 text-sm">{agent.email}</p>
                    <p className="text-slate-500 text-xs">{agent.role} • {agent.customers} customers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {agent.status}
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

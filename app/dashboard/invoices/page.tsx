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
  FileText,
  Download,
  DollarSign
} from "lucide-react";

export default function InvoicesPage() {
  const invoices = [
    { id: "INV-001", customer: "John Smith", amount: "$99.99", status: "paid", dueDate: "2024-02-15", issueDate: "2024-01-15" },
    { id: "INV-002", customer: "Sarah Johnson", amount: "$29.99", status: "pending", dueDate: "2024-02-14", issueDate: "2024-01-14" },
    { id: "INV-003", customer: "Mike Wilson", amount: "$99.99", status: "overdue", dueDate: "2024-01-30", issueDate: "2024-01-01" },
    { id: "INV-004", customer: "Emily Davis", amount: "$59.99", status: "paid", dueDate: "2024-02-12", issueDate: "2024-01-12" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoice Management</h1>
          <p className="text-slate-400 mt-1">Manage FiooTV invoices and billing documents.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-slate-400">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Paid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,089</div>
            <p className="text-xs text-slate-400">87.3% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$8,450</div>
            <p className="text-xs text-slate-400">Outstanding payments</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Overdue</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-slate-400">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Invoices</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{invoice.id}</h3>
                    <p className="text-slate-400 text-sm">{invoice.customer}</p>
                    <p className="text-slate-500 text-xs">Issued: {invoice.issueDate} • Due: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white font-medium">{invoice.amount}</p>
                    <p className="text-slate-400 text-xs">Amount</p>
                  </div>
                  <Badge 
                    variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {invoice.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Customer</h1>
          <p className="text-slate-400 mt-1">Create a new customer account for FiooTV services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Customer Information</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the customer's personal and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter first name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter last name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="customer@example.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+1-555-123-4567"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-slate-300">Address</Label>
              <Input 
                id="address" 
                placeholder="123 Main St, City, State 12345"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Subscription Details</CardTitle>
            <CardDescription className="text-slate-400">
              Select the customer's subscription plan and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plan" className="text-slate-300">Subscription Plan</Label>
              <Input 
                id="plan" 
                placeholder="e.g., Premium, Standard, Basic"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="billingCycle" className="text-slate-300">Billing Cycle</Label>
              <Input 
                id="billingCycle" 
                placeholder="Monthly, Quarterly, Yearly"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-slate-300">Price</Label>
              <Input 
                id="price" 
                placeholder="$99.99"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Customer Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

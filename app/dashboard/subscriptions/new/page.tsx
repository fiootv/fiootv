import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/subscriptions">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscriptions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Subscription</h1>
          <p className="text-slate-400 mt-1">Create a new subscription for a FiooTV customer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Subscription Details</CardTitle>
            <CardDescription className="text-slate-400">
              Configure the subscription plan and billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="customer" className="text-slate-300">Customer</Label>
              <Input 
                id="customer" 
                placeholder="Select customer"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="plan" className="text-slate-300">Subscription Plan</Label>
              <Input 
                id="plan" 
                placeholder="e.g., Premium, Standard, Basic"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-slate-300">Amount</Label>
                <Input 
                  id="amount" 
                  placeholder="$99.99"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-slate-300">End Date (Optional)</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Configure payment method and billing preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod" className="text-slate-300">Payment Method</Label>
              <Input 
                id="paymentMethod" 
                placeholder="Credit Card, PayPal, Bank Transfer"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="autoRenew" className="text-slate-300">Auto Renewal</Label>
              <Input 
                id="autoRenew" 
                placeholder="Yes, No"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-slate-300">Status</Label>
              <Input 
                id="status" 
                placeholder="Active, Pending, Cancelled"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

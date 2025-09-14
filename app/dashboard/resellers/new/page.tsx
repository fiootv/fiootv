import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewResellerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/resellers">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resellers
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Reseller</h1>
          <p className="text-slate-400 mt-1">Create a new reseller partnership for FiooTV services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Company Information</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the reseller company details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="companyName" className="text-slate-300">Company Name</Label>
              <Input 
                id="companyName" 
                placeholder="Enter company name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="text-slate-300">Contact Email</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                placeholder="contact@company.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-slate-300">Contact Phone</Label>
              <Input 
                id="contactPhone" 
                placeholder="+1-555-123-4567"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-slate-300">Business Address</Label>
              <Input 
                id="address" 
                placeholder="123 Business St, City, State 12345"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-slate-300">Website</Label>
              <Input 
                id="website" 
                placeholder="https://company.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Partnership Details</CardTitle>
            <CardDescription className="text-slate-400">
              Configure the reseller partnership terms and commission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commissionRate" className="text-slate-300">Commission Rate (%)</Label>
              <Input 
                id="commissionRate" 
                placeholder="15"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="contractStart" className="text-slate-300">Contract Start Date</Label>
              <Input 
                id="contractStart" 
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="contractEnd" className="text-slate-300">Contract End Date</Label>
              <Input 
                id="contractEnd" 
                type="date"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Reseller Partnership
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

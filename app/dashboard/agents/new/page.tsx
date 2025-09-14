import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/agents">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Agent</h1>
          <p className="text-slate-400 mt-1">Create a new agent account for your team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Agent Information</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the agent's personal and contact details.
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
                placeholder="agent@fiootv.com"
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
              <Label htmlFor="role" className="text-slate-300">Role</Label>
              <Input 
                id="role" 
                placeholder="e.g., Senior Agent, Agent, Junior Agent"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-slate-300">Department</Label>
              <Input 
                id="department" 
                placeholder="e.g., Customer Support, Sales"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Configure the agent's account access and permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input 
                id="username" 
                placeholder="agent_username"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Temporary Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter temporary password"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm password"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Agent Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

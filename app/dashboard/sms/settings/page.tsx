import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SMSSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">SMS Settings</h1>
        <p className="text-slate-400 mt-1">Configure SMS service settings for FiooTV notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">SMS Provider Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Configure your SMS service provider settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="provider" className="text-slate-300">SMS Provider</Label>
              <Input 
                id="provider" 
                placeholder="Twilio, AWS SNS, etc."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="apiKey" className="text-slate-300">API Key</Label>
              <Input 
                id="apiKey" 
                type="password"
                placeholder="Enter API key"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="apiSecret" className="text-slate-300">API Secret</Label>
              <Input 
                id="apiSecret" 
                type="password"
                placeholder="Enter API secret"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-slate-300">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                placeholder="+1-555-123-4567"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Test SMS
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">SMS Templates</CardTitle>
            <CardDescription className="text-slate-400">
              Manage your SMS message templates and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="senderId" className="text-slate-300">Sender ID</Label>
              <Input 
                id="senderId" 
                placeholder="FiooTV"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="maxLength" className="text-slate-300">Max Message Length</Label>
              <Input 
                id="maxLength" 
                placeholder="160"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="rateLimit" className="text-slate-300">Rate Limit (per minute)</Label>
              <Input 
                id="rateLimit" 
                placeholder="60"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

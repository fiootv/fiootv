import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Email Settings</h1>
        <p className="text-slate-400 mt-1">Configure email service settings for FiooTV communications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">SMTP Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Configure your SMTP server settings for sending emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost" className="text-slate-300">SMTP Host</Label>
              <Input 
                id="smtpHost" 
                placeholder="smtp.gmail.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort" className="text-slate-300">SMTP Port</Label>
              <Input 
                id="smtpPort" 
                placeholder="587"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="smtpUser" className="text-slate-300">Username</Label>
              <Input 
                id="smtpUser" 
                placeholder="your-email@fiootv.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="smtpPass" className="text-slate-300">Password</Label>
              <Input 
                id="smtpPass" 
                type="password"
                placeholder="Enter password"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Test Connection
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Email Templates</CardTitle>
            <CardDescription className="text-slate-400">
              Manage your email templates and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromName" className="text-slate-300">From Name</Label>
              <Input 
                id="fromName" 
                placeholder="FiooTV Support"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="fromEmail" className="text-slate-300">From Email</Label>
              <Input 
                id="fromEmail" 
                placeholder="support@fiootv.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="replyTo" className="text-slate-300">Reply-To Email</Label>
              <Input 
                id="replyTo" 
                placeholder="noreply@fiootv.com"
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

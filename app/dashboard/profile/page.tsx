import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
            <CardDescription className="text-gray-400">
              Update your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue="Admin" 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue="User" 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="admin@fiootv.com" 
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-300">Phone</Label>
              <Input 
                id="phone" 
                defaultValue="+1-855-561-4578" 
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Profile Picture</CardTitle>
            <CardDescription className="text-slate-400">
              Update your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AU</span>
              </div>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Change Picture
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

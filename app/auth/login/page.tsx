import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-slate-1000 text-white flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* FiooTV Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.fiootv.com/wp-content/themes/mindelo/images/logo.png" 
              alt="FiooTV Logo" 
              className="h-12 object-contain invert"
            />
          </div>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}

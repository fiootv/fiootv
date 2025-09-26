import { UserForm } from "@/components/user-form";
import { AdminGuard } from "@/components/admin-guard";

export default function NewUserPage() {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Agent</h1>
          <p className="text-gray-400 mt-2">Create a new agent account</p>
        </div>
        
        <UserForm />
      </div>
    </AdminGuard>
  );
}

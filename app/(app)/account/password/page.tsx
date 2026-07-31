import ChangePasswordForm from "@/components/ChangePasswordForm"

export default function ChangePasswordPage() {
  return (
    <div className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  )
}

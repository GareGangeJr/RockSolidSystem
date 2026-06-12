import { AddEmployeeForm } from "@/components/employees/AddEmployeeForm"
import { BackButton } from "@/components/BackButton"
export default function AddEmployeePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Add Employee</h1>
          <BackButton href="/employees" />        </div>

        <AddEmployeeForm />
      </div>
    </div>
  )
}

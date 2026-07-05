import { EmployeeForm } from "@/components/employees/EmployeeForm"

export default function AddEmployeePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add Employee</h1>
        </div>

        <EmployeeForm mode="add" />
      </div>
    </div>
  )
}

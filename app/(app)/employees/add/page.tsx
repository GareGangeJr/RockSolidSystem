import { addEmployee } from "../actions"
import { BackButton } from "@/components/BackButton"
import { EmployeeFormFields } from "@/components/employees/EmployeeFormFields"

export default async function AddEmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Add Employee</h1>
        <BackButton href="/employees" />
      </div>

      {error && message && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
      )}

      <form action={addEmployee} className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="space-y-6 p-6">
          <EmployeeFormFields />

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Employee
          </button>
        </div>
      </form>
    </div>
  )
}

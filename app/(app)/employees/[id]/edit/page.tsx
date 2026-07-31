import { createSupabaseServer } from "@/lib/supabase/server"
import { updateEmployee } from "../../actions"
import { BackButton } from "@/components/BackButton"
import { EmployeeFormFields } from "@/components/employees/EmployeeFormFields"
import type { Employee } from "@/types/entities"

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId))
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <BackButton href="/employees" />
      </div>
    )

  const { data, error } = await supabase.from("employees").select("*").eq("id", numericId).maybeSingle()

  if (error || !data)
    return (
      <div className="p-6">
        <p className="text-red-500">Employee not found</p>
        <BackButton href="/employees" />
      </div>
    )

  const employee = data as Employee

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Employee</h1>
          <BackButton href="/employees" />
        </div>

        <form action={updateEmployee} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={numericId} />
          <div className="space-y-6 p-6">
            <EmployeeFormFields data={employee} />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

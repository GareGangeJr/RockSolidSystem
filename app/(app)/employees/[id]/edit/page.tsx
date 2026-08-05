import { createSupabaseServer } from "@/lib/supabase/server"
import { updateEmployee } from "../../actions"
import { BackButton } from "@/components/BackButton"
import { EmployeeFormFields } from "@/components/employees/EmployeeFormFields"
import type { Employee } from "@/types/entities"

export default async function EditEmployeePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const { error: queryError, message } = await searchParams
  const numericId = Number(id)

  if (Number.isNaN(numericId))
    return (
      <div>
        <p className="text-red-500">Invalid ID</p>
        <BackButton href="/employees" />
      </div>
    )

  const { data, error } = await supabase.from("employees").select("*").eq("id", numericId).maybeSingle()

  if (error || !data)
    return (
      <div>
        <p className="text-red-500">Employee not found</p>
        <BackButton href="/employees" />
      </div>
    )

  const employee = data as Employee

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
        <BackButton href="/employees" />
      </div>

      {queryError && message && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
      )}

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
  )
}

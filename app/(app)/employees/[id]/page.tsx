import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { ViewPageActions } from "@/components/shared/ViewPageActions"
import { EmployeeDetailsView } from "@/components/employees/EmployeeDetailsView"

export default async function ViewEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id: idParam } = await params
  const id = Number(idParam)

  if (Number.isNaN(id))
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Invalid employee ID</p>
        <BackButton href="/employees" />
      </div>
    )

  const { data, error } = await supabase.from("employees").select("*").eq("id", id).maybeSingle()

  if (error || !data)
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Employee not found</p>
        <BackButton href="/employees" />
      </div>
    )

  const employee = data as Record<string, unknown>
  const isArchived = Boolean(employee.archived_at)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Employee</h1>
          {isArchived ? (
            <BackButton href="/archive" />
          ) : (
            <ViewPageActions editHref={`/employees/${id}/edit`} backHref="/employees" />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <EmployeeDetailsView employee={employee} />
          </div>
        </div>
      </div>
    </div>
  )
}

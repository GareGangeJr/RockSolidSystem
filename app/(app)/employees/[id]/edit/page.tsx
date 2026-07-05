import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { EmployeeForm } from "@/components/employees/EmployeeForm"
import type { Employee } from "@/types/entities"

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const numericId = Number(id)

  if (Number.isNaN(numericId)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <BackButton href="/employees" />
      </div>
    )
  }

  const { data, error } = await supabase.from("employees").select("*").eq("id", numericId).maybeSingle()

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Employee not found</p>
        <BackButton href="/employees" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
          <BackButton href="/employees" />
        </div>

        <EmployeeForm mode="edit" employee={data as Employee} />
      </div>
    </div>
  )
}

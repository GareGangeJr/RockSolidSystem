import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { EmployeeTable } from "@/components/employees/EmployeeTable"

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { success } = await searchParams
  const supabase = await createSupabaseServer()

  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading employees</div>
  }

  const list = (employees ?? []).map((e) => ({
    id: e.id,
    employee_number: e.employee_number ?? null,
    first_name: e.first_name ?? null,
    middle_name: e.middle_name ?? null,
    last_name: e.last_name ?? null,
    position: e.position ?? null,
    department: e.department ?? null,
    employment_status: e.employment_status ?? null,
    contact_number: e.contact_number ?? null,
    email: e.email ?? null,
    date_hired: e.date_hired ?? null,
    auth_user_id: e.auth_user_id ?? null,
  }))

  return (
    <div className="p-6">
      {success === "added" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">Employee saved successfully.</div>
      )}
      {success === "updated" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">Employee updated successfully.</div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <Link
          href="/employees/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Employee
        </Link>
      </div>
      <EmployeeTable employees={list} />
    </div>
  )
}   
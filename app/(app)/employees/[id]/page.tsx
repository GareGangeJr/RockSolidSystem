import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

const v = (x: unknown) => (x != null && x !== "" ? String(x) : "—")
const d = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "—")

export default async function ViewEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id: idParam } = await params
  const id = Number(idParam)

  if (Number.isNaN(id)) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Invalid employee ID</p>
      <Link href="/employees" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const { data, error } = await supabase.from("employees").select("*").eq("id", id).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Employee not found</p>
      <Link href="/employees" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const e = data as Record<string, unknown>

  const labelClass = "block text-xs font-medium text-gray-500"
  const valueClass = "mt-0.5 text-sm text-gray-900"
  const sectionClass = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridClass = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Employee</h1>
          <Link href="/employees" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            
            <div>
              <h2 className={sectionClass}>Employment Information</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>Employee Number</span><p className={valueClass}>{v(e.employee_number)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Position</span><p className={valueClass}>{v(e.position)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Department</span><p className={valueClass}>{v(e.department)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Date Hired</span><p className={valueClass}>{d(e.date_hired)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Employment Status</span><p className={valueClass}>{v(e.employment_status)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Employment Type</span><p className={valueClass}>{v(e.employment_type)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Personal Information</h2>
              <div className={gridClass}>
                <div className="col-span-4"><span className={labelClass}>Last Name</span><p className={valueClass}>{v(e.last_name)}</p></div>
                <div className="col-span-4"><span className={labelClass}>First Name</span><p className={valueClass}>{v(e.first_name)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Middle Name</span><p className={valueClass}>{v(e.middle_name)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Date of Birth</span><p className={valueClass}>{d(e.date_of_birth)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Gender</span><p className={valueClass}>{v(e.gender)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Civil Status</span><p className={valueClass}>{v(e.civil_status)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Contact Number</span><p className={valueClass}>{v(e.contact_number)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Email</span><p className={valueClass}>{v(e.email)}</p></div>
                <div className="col-span-12"><span className={labelClass}>Current Address</span><p className={valueClass}>{v(e.current_address)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Government IDs</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>SSS Number</span><p className={valueClass}>{v(e.sss_number)}</p></div>
                <div className="col-span-6"><span className={labelClass}>PhilHealth Number</span><p className={valueClass}>{v(e.philhealth_number)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Pag-IBIG Number</span><p className={valueClass}>{v(e.pagibig_number)}</p></div>
                <div className="col-span-6"><span className={labelClass}>TIN Number</span><p className={valueClass}>{v(e.tin_number)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Compensation</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>Basic Salary</span><p className={valueClass}>{v(e.basic_salary)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Allowances</span><p className={valueClass}>{v(e.allowances)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className={gridClass}>
                <div className="col-span-5"><span className={labelClass}>Name</span><p className={valueClass}>{v(e.emergency_contact_name)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Relationship</span><p className={valueClass}>{v(e.emergency_contact_relationship)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Contact Number</span><p className={valueClass}>{v(e.emergency_contact_number)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Contract Details</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>Contract Start Date</span><p className={valueClass}>{d(e.contract_start_date)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Contract End Date</span><p className={valueClass}>{d(e.contract_end_date)}</p></div>
                <div className="col-span-12"><span className={labelClass}>Notes/Remarks</span><p className={valueClass}>{v(e.notes)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "—")
const formatDate = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "—")

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

  const employee = data as Record<string, unknown>

  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

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
              <h2 className={sectionHeaderStyles}>Employment Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>Employee Number</span><p className={valueStyles}>{formatValue(employee.employee_number)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Position</span><p className={valueStyles}>{formatValue(employee.position)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Department</span><p className={valueStyles}>{formatValue(employee.department)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Date Hired</span><p className={valueStyles}>{formatDate(employee.date_hired)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Employment Status</span><p className={valueStyles}>{formatValue(employee.employment_status)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Employment Type</span><p className={valueStyles}>{formatValue(employee.employment_type)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Personal Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-4"><span className={labelStyles}>Last Name</span><p className={valueStyles}>{formatValue(employee.last_name)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>First Name</span><p className={valueStyles}>{formatValue(employee.first_name)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Middle Name</span><p className={valueStyles}>{formatValue(employee.middle_name)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Date of Birth</span><p className={valueStyles}>{formatDate(employee.date_of_birth)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Gender</span><p className={valueStyles}>{formatValue(employee.gender)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Civil Status</span><p className={valueStyles}>{formatValue(employee.civil_status)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(employee.contact_number)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Email</span><p className={valueStyles}>{formatValue(employee.email)}</p></div>
                <div className="col-span-12"><span className={labelStyles}>Current Address</span><p className={valueStyles}>{formatValue(employee.current_address)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Government IDs</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>SSS Number</span><p className={valueStyles}>{formatValue(employee.sss_number)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>PhilHealth Number</span><p className={valueStyles}>{formatValue(employee.philhealth_number)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Pag-IBIG Number</span><p className={valueStyles}>{formatValue(employee.pagibig_number)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>TIN Number</span><p className={valueStyles}>{formatValue(employee.tin_number)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Compensation</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>Basic Salary</span><p className={valueStyles}>{formatValue(employee.basic_salary)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Allowances</span><p className={valueStyles}>{formatValue(employee.allowances)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-5"><span className={labelStyles}>Name</span><p className={valueStyles}>{formatValue(employee.emergency_contact_name)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(employee.emergency_contact_relationship)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(employee.emergency_contact_number)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Contract Details</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>Contract Start Date</span><p className={valueStyles}>{formatDate(employee.contract_start_date)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Contract End Date</span><p className={valueStyles}>{formatDate(employee.contract_end_date)}</p></div>
                <div className="col-span-12"><span className={labelStyles}>Notes/Remarks</span><p className={valueStyles}>{formatValue(employee.notes)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

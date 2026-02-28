import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateEmployee } from "../../actions"

const v = (x: unknown): string => (x != null && x !== "" ? String(x) : "")

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const n = Number(id)

  if (Number.isNaN(n)) return (
    <div className="p-6">
      <p className="text-red-500">Invalid ID</p>
      <Link href="/employees" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const { data, error } = await supabase.from("employees").select("*").eq("id", n).maybeSingle()

  if (error || !data) return (
    <div className="p-6">
      <p className="text-red-500">Employee not found</p>
      <Link href="/employees" className="text-blue-600 hover:underline">Back</Link>
    </div>
  )

  const e = data as Record<string, unknown>

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"
  const sectionClass = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Employee</h1>
          <Link href="/employees" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={updateEmployee} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={n} />
          <div className="space-y-6 p-6">
            
            <div>
              <h2 className={sectionClass}>Employment Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Employee Number</label>
                  <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    {v(e.employee_number) || "Auto-generated"}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Position/Job Title</label>
                  <input name="position" defaultValue={v(e.position)} className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Department</label>
                  <input name="department" defaultValue={v(e.department)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Date Hired</label>
                  <input name="date_hired" type="date" defaultValue={v(e.date_hired)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Employment Status</label>
                  <select name="employment_status" defaultValue={v(e.employment_status) || "Active"} className={inputClass}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Employment Type</label>
                  <select name="employment_type" defaultValue={v(e.employment_type)} className={inputClass}>
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Personal Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Last Name</label>
                  <input name="last_name" defaultValue={v(e.last_name)} className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>First Name</label>
                  <input name="first_name" defaultValue={v(e.first_name)} className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Middle Name</label>
                  <input name="middle_name" defaultValue={v(e.middle_name)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Date of Birth</label>
                  <input name="date_of_birth" type="date" defaultValue={v(e.date_of_birth)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Gender</label>
                  <select name="gender" defaultValue={v(e.gender)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Civil Status</label>
                  <select name="civil_status" defaultValue={v(e.civil_status)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Contact Number</label>
                  <input name="contact_number" defaultValue={v(e.contact_number)} className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Email</label>
                  <input name="email" type="email" defaultValue={v(e.email)} className={inputClass} required />
                </div>
                <div className="col-span-12">
                  <label className={labelClass}>Current Address</label>
                  <input name="current_address" defaultValue={v(e.current_address)} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Government IDs</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>SSS Number</label>
                  <input name="sss_number" defaultValue={v(e.sss_number)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>PhilHealth Number</label>
                  <input name="philhealth_number" defaultValue={v(e.philhealth_number)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Pag-IBIG Number</label>
                  <input name="pagibig_number" defaultValue={v(e.pagibig_number)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>TIN Number</label>
                  <input name="tin_number" defaultValue={v(e.tin_number)} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Compensation</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Basic Salary</label>
                  <input name="basic_salary" defaultValue={v(e.basic_salary)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Allowances</label>
                  <input name="allowances" defaultValue={v(e.allowances)} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Name</label>
                  <input name="emergency_contact_name" defaultValue={v(e.emergency_contact_name)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Relationship</label>
                  <input name="emergency_contact_relationship" defaultValue={v(e.emergency_contact_relationship)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Contact Number</label>
                  <input name="emergency_contact_number" defaultValue={v(e.emergency_contact_number)} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Contract Details</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Contract Start Date</label>
                  <input name="contract_start_date" type="date" defaultValue={v(e.contract_start_date)} className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Contract End Date</label>
                  <input name="contract_end_date" type="date" defaultValue={v(e.contract_end_date)} className={inputClass} />
                </div>
                <div className="col-span-12">
                  <label className={labelClass}>Notes/Remarks</label>
                  <textarea name="notes" rows={3} defaultValue={v(e.notes)} className={inputClass}></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
            <Link
              href="/employees"
              className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

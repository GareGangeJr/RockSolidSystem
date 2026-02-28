"use client"

import Link from "next/link"
import { addEmployee } from "../actions"
import { useState } from "react"

export default function AddEmployeePage() {
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    const result = await addEmployee(formData)
    if (result?.error) {
      setError(result.error)
      alert("❌ Error: " + result.error)
    }
  }

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"
  const sectionClass = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Employee</h1>
          <Link href="/employees" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form action={handleSubmit} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            
            <div>
              <h2 className={sectionClass}>Employment Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Position/Job Title</label>
                  <input name="position" className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Department</label>
                  <input name="department" className={inputClass} placeholder="e.g. HR, Operations" />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Date Hired</label>
                  <input name="date_hired" type="date" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Employment Status</label>
                  <select name="employment_status" className={inputClass} defaultValue="Active">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Employment Type</label>
                  <select name="employment_type" className={inputClass}>
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
                  <input name="last_name" className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>First Name</label>
                  <input name="first_name" className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Middle Name</label>
                  <input name="middle_name" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Date of Birth</label>
                  <input name="date_of_birth" type="date" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Gender</label>
                  <select name="gender" className={inputClass}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Civil Status</label>
                  <select name="civil_status" className={inputClass}>
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Contact Number</label>
                  <input name="contact_number" className={inputClass} required />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Email</label>
                  <input name="email" type="email" className={inputClass} required />
                </div>
                <div className="col-span-12">
                  <label className={labelClass}>Current Address</label>
                  <input name="current_address" className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Government IDs</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>SSS Number</label>
                  <input name="sss_number" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>PhilHealth Number</label>
                  <input name="philhealth_number" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Pag-IBIG Number</label>
                  <input name="pagibig_number" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>TIN Number</label>
                  <input name="tin_number" className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Compensation</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Basic Salary</label>
                  <input name="basic_salary" className={inputClass} placeholder="e.g. 25,000 PHP" />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Allowances</label>
                  <input name="allowances" className={inputClass} placeholder="e.g. Transportation, Housing" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Name</label>
                  <input name="emergency_contact_name" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Relationship</label>
                  <input name="emergency_contact_relationship" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Contact Number</label>
                  <input name="emergency_contact_number" className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Contract Details</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Contract Start Date</label>
                  <input name="contract_start_date" type="date" className={inputClass} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Contract End Date</label>
                  <input name="contract_end_date" type="date" className={inputClass} />
                </div>
                <div className="col-span-12">
                  <label className={labelClass}>Notes/Remarks</label>
                  <textarea name="notes" rows={3} className={inputClass}></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Employee
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

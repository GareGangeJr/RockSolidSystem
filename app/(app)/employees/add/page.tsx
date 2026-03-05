"use client"

import Link from "next/link"
import { addEmployee } from "../actions"
import { useState } from "react"

export default function AddEmployeePage() {
  const [error, setError] = useState("")

  const onSubmitForm = async (formData: FormData) => {
    const result = await addEmployee(formData)
    if (result?.error) {
      setError(result.error)
      alert("❌ Error: " + result.error)
    }
  }

  const inputFieldStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelStyles = "block text-sm font-medium text-gray-700"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

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

        <form action={onSubmitForm} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            
            <div>
              <h2 className={sectionHeaderStyles}>Employment Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Position/Job Title</label>
                  <input name="position" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Department</label>
                  <input name="department" className={inputFieldStyles} placeholder="Ex: HR, Operations" />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Date Hired</label>
                  <input name="date_hired" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Employment Status</label>
                  <select name="employment_status" className={inputFieldStyles} defaultValue="Active">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Employment Type</label>
                  <select name="employment_type" className={inputFieldStyles}>
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
              <h2 className={sectionHeaderStyles}>Personal Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Last Name</label>
                  <input name="last_name" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>First Name</label>
                  <input name="first_name" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Middle Name</label>
                  <input name="middle_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Date of Birth</label>
                  <input name="date_of_birth" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Gender</label>
                  <select name="gender" className={inputFieldStyles}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Civil Status</label>
                  <select name="civil_status" className={inputFieldStyles}>
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Contact Number</label>
                  <input name="contact_number" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Email</label>
                  <input name="email" type="email" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12">
                  <label className={labelStyles}>Current Address</label>
                  <input name="current_address" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Government IDs</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>SSS Number</label>
                  <input name="sss_number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>PhilHealth Number</label>
                  <input name="philhealth_number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Pag-IBIG Number</label>
                  <input name="pagibig_number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>TIN Number</label>
                  <input name="tin_number" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Compensation</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Basic Salary</label>
                  <input name="basic_salary" className={inputFieldStyles} placeholder="Ex: 25,000 PHP" />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Allowances</label>
                  <input name="allowances" className={inputFieldStyles} placeholder="Ex: Transportation, Housing" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Name</label>
                  <input name="emergency_contact_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Relationship</label>
                  <input name="emergency_contact_relationship" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Contact Number</label>
                  <input name="emergency_contact_number" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Contract Details</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Contract Start Date</label>
                  <input name="contract_start_date" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Contract End Date</label>
                  <input name="contract_end_date" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12">
                  <label className={labelStyles}>Notes/Remarks</label>
                  <textarea name="notes" rows={3} className={inputFieldStyles}></textarea>
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

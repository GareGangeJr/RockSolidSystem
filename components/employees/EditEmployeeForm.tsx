"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { updateEmployee } from "@/app/(app)/employees/actions"
import {
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  DEFAULT_EMPLOYMENT_STATUS,
  DEFAULT_EMPLOYMENT_TYPE,
  DEFAULT_GENDER,
  DEFAULT_CIVIL_STATUS,
} from "@/lib/status-options"

const STEPS = [
  "Employment",
  "Personal Info",
  "Government IDs",
  "Pay & Contract",
] as const

const inputFieldStyles =
  "mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-base font-medium text-gray-700"
const sectionHeaderStyles =
  "mb-4 border-b border-gray-100 pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500"

const formatValue = (x: unknown): string => (x != null && x !== "" ? String(x) : "")
const formatDate = (x: unknown): string => formatValue(x)?.slice(0, 10) ?? ""

type EditEmployeeFormProps = {
  employee: Record<string, unknown>
}

export function EditEmployeeForm({ employee }: EditEmployeeFormProps) {
  const [step, setStep] = useState(0)
  const [submitReady, setSubmitReady] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const goToStep = (nextStep: number) => {
    if (nextStep === STEPS.length - 1) {
      setSubmitReady(false)
      setTimeout(() => setSubmitReady(true), 200)
    }
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const validateCurrentStep = () => {
    const panel = stepRefs.current[step]
    if (!panel) return true

    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input[required], select[required], textarea[required]"
    )
    for (const field of fields) {
      if (!field.reportValidity()) return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    goToStep(Math.min(step + 1, STEPS.length - 1))
  }

  const handleBack = () => goToStep(Math.max(step - 1, 0))

  const handleSave = () => {
    if (!submitReady || !validateCurrentStep()) return
    formRef.current?.requestSubmit()
  }

  const stepPanelClass = (index: number) => (step === index ? "space-y-6" : "hidden")

  return (
    <form
      ref={formRef}
      action={updateEmployee}
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      onSubmit={(e) => {
        if (step !== STEPS.length - 1 || !submitReady) e.preventDefault()
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" || step === STEPS.length - 1) return
        const target = e.target
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
          e.preventDefault()
          handleNext()
        }
      }}
    >
      <input type="hidden" name="id" value={Number(employee.id)} />

      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
          Step {step + 1} of {STEPS.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, index) => {
            const isActive = index === step
            const isDone = index < step
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (index < step) goToStep(index)
                }}
                disabled={index > step}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDone
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}. {label}
              </button>
            )
          })}
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        <div ref={(el) => { stepRefs.current[0] = el }} className={stepPanelClass(0)}>
          <h2 className={sectionHeaderStyles}>Employment Information</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Employee Number</label>
              <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-500">
                {formatValue(employee.employee_number) || "Auto-generated"}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Position/Job Title</label>
              <input name="position" defaultValue={formatValue(employee.position)} className={inputFieldStyles} required />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Department</label>
              <input name="department" defaultValue={formatValue(employee.department)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Date Hired</label>
              <input name="date_hired" type="date" defaultValue={formatDate(employee.date_hired)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Employment Status</label>
              <select
                name="employment_status"
                defaultValue={formatValue(employee.employment_status) || DEFAULT_EMPLOYMENT_STATUS}
                className={inputFieldStyles}
              >
                {EMPLOYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Employment Type</label>
              <select
                name="employment_type"
                defaultValue={formatValue(employee.employment_type) || DEFAULT_EMPLOYMENT_TYPE}
                className={inputFieldStyles}
              >
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[1] = el }} className={stepPanelClass(1)}>
          <h2 className={sectionHeaderStyles}>Personal Information</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Last Name</label>
              <input name="last_name" defaultValue={formatValue(employee.last_name)} className={inputFieldStyles} required />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>First Name</label>
              <input name="first_name" defaultValue={formatValue(employee.first_name)} className={inputFieldStyles} required />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Middle Name</label>
              <input name="middle_name" defaultValue={formatValue(employee.middle_name)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Date of Birth</label>
              <input name="date_of_birth" type="date" defaultValue={formatDate(employee.date_of_birth)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Gender</label>
              <select name="gender" defaultValue={formatValue(employee.gender) || DEFAULT_GENDER} className={inputFieldStyles}>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Civil Status</label>
              <select
                name="civil_status"
                defaultValue={formatValue(employee.civil_status) || DEFAULT_CIVIL_STATUS}
                className={inputFieldStyles}
              >
                {CIVIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Contact Number</label>
              <input name="contact_number" defaultValue={formatValue(employee.contact_number)} className={inputFieldStyles} required />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Email</label>
              <input name="email" type="email" defaultValue={formatValue(employee.email)} className={inputFieldStyles} required />
            </div>
            <div className="col-span-12">
              <label className={labelStyles}>Current Address</label>
              <input name="current_address" defaultValue={formatValue(employee.current_address)} className={inputFieldStyles} />
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[2] = el }} className={stepPanelClass(2)}>
          <h2 className={sectionHeaderStyles}>Government IDs</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>SSS Number</label>
              <input name="sss_number" defaultValue={formatValue(employee.sss_number)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>PhilHealth Number</label>
              <input name="philhealth_number" defaultValue={formatValue(employee.philhealth_number)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Pag-IBIG Number</label>
              <input name="pagibig_number" defaultValue={formatValue(employee.pagibig_number)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>TIN Number</label>
              <input name="tin_number" defaultValue={formatValue(employee.tin_number)} className={inputFieldStyles} />
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[3] = el }} className={stepPanelClass(3)}>
          <h2 className={sectionHeaderStyles}>Compensation</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Basic Salary</label>
              <input name="basic_salary" defaultValue={formatValue(employee.basic_salary)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Allowances</label>
              <input name="allowances" defaultValue={formatValue(employee.allowances)} className={inputFieldStyles} />
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Name</label>
              <input name="emergency_contact_name" defaultValue={formatValue(employee.emergency_contact_name)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Relationship</label>
              <input
                name="emergency_contact_relationship"
                defaultValue={formatValue(employee.emergency_contact_relationship)}
                className={inputFieldStyles}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Contact Number</label>
              <input name="emergency_contact_number" defaultValue={formatValue(employee.emergency_contact_number)} className={inputFieldStyles} />
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Contract Details</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Contract Start Date</label>
              <input name="contract_start_date" type="date" defaultValue={formatDate(employee.contract_start_date)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Contract End Date</label>
              <input name="contract_end_date" type="date" defaultValue={formatDate(employee.contract_end_date)} className={inputFieldStyles} />
            </div>
            <div className="col-span-12">
              <label className={labelStyles}>Notes/Remarks</label>
              <textarea name="notes" rows={4} defaultValue={formatValue(employee.notes)} className={inputFieldStyles} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
        <div>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href="/employees"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!submitReady}
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

"use client"

import { addEmployee, updateEmployee } from "@/app/(app)/employees/actions"
import { MultiStepForm } from "@/components/shared/MultiStepForm"
import {
  displayDate,
  displayValue,
  fieldClass,
  labelClass,
  sectionTitleClass,
} from "@/lib/form-ui"
import {
  CIVIL_STATUS_OPTIONS,
  DEFAULT_CIVIL_STATUS,
  DEFAULT_EMPLOYMENT_STATUS,
  DEFAULT_EMPLOYMENT_TYPE,
  DEFAULT_GENDER,
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/status-options"
import type { Employee } from "@/types/entities"

const STEPS = ["Employment", "Personal Info", "Government IDs", "Pay & Contract"] as const

type EmployeeFormProps =
  | { mode: "add" }
  | { mode: "edit"; employee: Employee }

export function EmployeeForm(props: EmployeeFormProps) {
  const isEdit = props.mode === "edit"
  const employee = isEdit ? props.employee : null

  async function handleSubmit(formData: FormData) {
    if (isEdit) return updateEmployee(formData)
    return addEmployee(formData)
  }

  return (
    <MultiStepForm
      steps={STEPS}
      submitLabel={isEdit ? "Save Changes" : "Save Employee"}
      cancelHref={isEdit ? "/employees" : undefined}
      onSubmit={handleSubmit}
      hiddenFields={isEdit ? <input type="hidden" name="id" value={employee!.id} /> : undefined}
    >
      <section>
        <h2 className={sectionTitleClass}>Employment Information</h2>
        <div className="grid grid-cols-12 gap-6">
          {isEdit && (
            <div className="col-span-12 md:col-span-6">
              <label className={labelClass}>Employee Number</label>
              <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-500">
                {displayValue(employee!.employee_number) || "Auto-generated"}
              </div>
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Position / Job Title</label>
            <input
              name="position"
              defaultValue={displayValue(employee?.position)}
              className={fieldClass}
              required
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Department</label>
            <input
              name="department"
              defaultValue={displayValue(employee?.department)}
              className={fieldClass}
              placeholder="Ex: HR, Operations"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Date Hired</label>
            <input
              name="date_hired"
              type="date"
              defaultValue={displayDate(employee?.date_hired)}
              className={fieldClass}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Employment Status</label>
            <select
              name="employment_status"
              defaultValue={displayValue(employee?.employment_status) || DEFAULT_EMPLOYMENT_STATUS}
              className={fieldClass}
            >
              {EMPLOYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Employment Type</label>
            <select
              name="employment_type"
              defaultValue={displayValue(employee?.employment_type) || DEFAULT_EMPLOYMENT_TYPE}
              className={fieldClass}
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className={sectionTitleClass}>Personal Information</h2>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Last Name</label>
            <input name="last_name" defaultValue={displayValue(employee?.last_name)} className={fieldClass} required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>First Name</label>
            <input name="first_name" defaultValue={displayValue(employee?.first_name)} className={fieldClass} required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Middle Name</label>
            <input name="middle_name" defaultValue={displayValue(employee?.middle_name)} className={fieldClass} />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className={labelClass}>Date of Birth</label>
            <input
              name="date_of_birth"
              type="date"
              defaultValue={displayDate(employee?.date_of_birth)}
              className={fieldClass}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className={labelClass}>Gender</label>
            <select name="gender" defaultValue={displayValue(employee?.gender) || DEFAULT_GENDER} className={fieldClass}>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className={labelClass}>Civil Status</label>
            <select
              name="civil_status"
              defaultValue={displayValue(employee?.civil_status) || DEFAULT_CIVIL_STATUS}
              className={fieldClass}
            >
              {CIVIL_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className={labelClass}>Contact Number</label>
            <input
              name="contact_number"
              defaultValue={displayValue(employee?.contact_number)}
              className={fieldClass}
              required
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              defaultValue={displayValue(employee?.email)}
              className={fieldClass}
              required
            />
          </div>
          <div className="col-span-12">
            <label className={labelClass}>Current Address</label>
            <input name="current_address" defaultValue={displayValue(employee?.current_address)} className={fieldClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className={sectionTitleClass}>Government IDs</h2>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>SSS Number</label>
            <input name="sss_number" defaultValue={displayValue(employee?.sss_number)} className={fieldClass} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>PhilHealth Number</label>
            <input name="philhealth_number" defaultValue={displayValue(employee?.philhealth_number)} className={fieldClass} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Pag-IBIG Number</label>
            <input name="pagibig_number" defaultValue={displayValue(employee?.pagibig_number)} className={fieldClass} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>TIN Number</label>
            <input name="tin_number" defaultValue={displayValue(employee?.tin_number)} className={fieldClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className={sectionTitleClass}>Compensation</h2>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Basic Salary</label>
            <input name="basic_salary" defaultValue={displayValue(employee?.basic_salary)} className={fieldClass} placeholder="Ex: 25,000 PHP" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Allowances</label>
            <input name="allowances" defaultValue={displayValue(employee?.allowances)} className={fieldClass} placeholder="Ex: Transportation, Housing" />
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className={sectionTitleClass}>Emergency Contact</h2>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <label className={labelClass}>Name</label>
            <input name="emergency_contact_name" defaultValue={displayValue(employee?.emergency_contact_name)} className={fieldClass} />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className={labelClass}>Relationship</label>
            <input
              name="emergency_contact_relationship"
              defaultValue={displayValue(employee?.emergency_contact_relationship)}
              className={fieldClass}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Contact Number</label>
            <input name="emergency_contact_number" defaultValue={displayValue(employee?.emergency_contact_number)} className={fieldClass} />
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className={sectionTitleClass}>Contract Details</h2>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Contract Start Date</label>
            <input
              name="contract_start_date"
              type="date"
              defaultValue={displayDate(employee?.contract_start_date)}
              className={fieldClass}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className={labelClass}>Contract End Date</label>
            <input
              name="contract_end_date"
              type="date"
              defaultValue={displayDate(employee?.contract_end_date)}
              className={fieldClass}
            />
          </div>
          <div className="col-span-12">
            <label className={labelClass}>Notes / Remarks</label>
            <textarea name="notes" rows={4} defaultValue={displayValue(employee?.notes)} className={fieldClass} />
          </div>
        </div>
      </section>
    </MultiStepForm>
  )
}

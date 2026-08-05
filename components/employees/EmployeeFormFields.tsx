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
import { displayDate, displayValue, fieldClassSm, formGridClass, labelClassSm, sectionTitleClassSm } from "@/lib/form-ui"
import { NumericInput } from "@/components/shared/NumericInput"
import type { Employee } from "@/types/entities"

type Props = {
  data?: Partial<Employee>
}

export function EmployeeFormFields({ data }: Props) {
  const val = (field: unknown) => displayValue(field)
  const dat = (field: unknown) => displayDate(field)

  return (
    <div className="space-y-6">
      <div>
        <h2 className={sectionTitleClassSm}>Employment Information</h2>
        <div className={formGridClass}>
          {data?.employee_number != null && (
            <div>
              <label className={labelClassSm}>Employee Number</label>
              <div className={`${fieldClassSm} cursor-not-allowed bg-gray-50 text-gray-600`}>
                {val(data.employee_number) || "Auto-generated"}
              </div>
            </div>
          )}
          <div>
            <label className={labelClassSm}>Position / Job Title</label>
            <input name="position" defaultValue={val(data?.position)} className={fieldClassSm} required />
          </div>
          <div>
            <label className={labelClassSm}>Department</label>
            <input
              name="department"
              defaultValue={val(data?.department)}
              className={fieldClassSm}
              placeholder="Ex: HR, Operations"
            />
          </div>
          <div>
            <label className={labelClassSm}>Date Hired</label>
            <input name="date_hired" type="date" defaultValue={dat(data?.date_hired)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Employment Status</label>
            <select
              name="employment_status"
              defaultValue={val(data?.employment_status) || DEFAULT_EMPLOYMENT_STATUS}
              className={fieldClassSm}
            >
              {EMPLOYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassSm}>Employment Type</label>
            <select
              name="employment_type"
              defaultValue={val(data?.employment_type) || DEFAULT_EMPLOYMENT_TYPE}
              className={fieldClassSm}
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

      <div>
        <h2 className={sectionTitleClassSm}>Personal Information</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Last Name</label>
            <input name="last_name" defaultValue={val(data?.last_name)} className={fieldClassSm} required />
          </div>
          <div>
            <label className={labelClassSm}>First Name</label>
            <input name="first_name" defaultValue={val(data?.first_name)} className={fieldClassSm} required />
          </div>
          <div>
            <label className={labelClassSm}>Middle Name</label>
            <input name="middle_name" defaultValue={val(data?.middle_name)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Date of Birth</label>
            <input name="date_of_birth" type="date" defaultValue={dat(data?.date_of_birth)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Gender</label>
            <select name="gender" defaultValue={val(data?.gender) || DEFAULT_GENDER} className={fieldClassSm}>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassSm}>Civil Status</label>
            <select
              name="civil_status"
              defaultValue={val(data?.civil_status) || DEFAULT_CIVIL_STATUS}
              className={fieldClassSm}
            >
              {CIVIL_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassSm}>Contact Number</label>
            <NumericInput name="contact_number" defaultValue={val(data?.contact_number)} className={fieldClassSm} required />
          </div>
          <div>
            <label className={labelClassSm}>Email</label>
            <input name="email" type="email" defaultValue={val(data?.email)} className={fieldClassSm} required />
          </div>
          <div className="col-span-full">
            <label className={labelClassSm}>Current Address</label>
            <input name="current_address" defaultValue={val(data?.current_address)} className={fieldClassSm} />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Government IDs</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>SSS Number</label>
            <NumericInput name="sss_number" defaultValue={val(data?.sss_number)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>PhilHealth Number</label>
            <NumericInput name="philhealth_number" defaultValue={val(data?.philhealth_number)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Pag-IBIG Number</label>
            <NumericInput name="pagibig_number" defaultValue={val(data?.pagibig_number)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>TIN Number</label>
            <NumericInput name="tin_number" defaultValue={val(data?.tin_number)} className={fieldClassSm} />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Compensation</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Basic Salary</label>
            <NumericInput
              name="basic_salary"
              allowDecimal
              defaultValue={val(data?.basic_salary)}
              className={fieldClassSm}
              placeholder="Ex: 25000"
            />
          </div>
          <div>
            <label className={labelClassSm}>Allowances</label>
            <input
              name="allowances"
              defaultValue={val(data?.allowances)}
              className={fieldClassSm}
              placeholder="Ex: Transportation, Housing"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Emergency Contact</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Name</label>
            <input name="emergency_contact_name" defaultValue={val(data?.emergency_contact_name)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Relationship</label>
            <input
              name="emergency_contact_relationship"
              defaultValue={val(data?.emergency_contact_relationship)}
              className={fieldClassSm}
            />
          </div>
          <div>
            <label className={labelClassSm}>Contact Number</label>
            <NumericInput
              name="emergency_contact_number"
              defaultValue={val(data?.emergency_contact_number)}
              className={fieldClassSm}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Contract Details</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Contract Start Date</label>
            <input
              name="contract_start_date"
              type="date"
              defaultValue={dat(data?.contract_start_date)}
              className={fieldClassSm}
            />
          </div>
          <div>
            <label className={labelClassSm}>Contract End Date</label>
            <input
              name="contract_end_date"
              type="date"
              defaultValue={dat(data?.contract_end_date)}
              className={fieldClassSm}
            />
          </div>
          <div className="col-span-full">
            <label className={labelClassSm}>Notes / Remarks</label>
            <textarea name="notes" rows={4} defaultValue={val(data?.notes)} className={fieldClassSm} />
          </div>
        </div>
      </div>
    </div>
  )
}

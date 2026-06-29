import {
  DEFAULT_JOB_ORDER_GENDER,
  DEFAULT_JOB_ORDER_STATUS,
  JOB_ORDER_GENDER_OPTIONS,
  JOB_ORDER_STATUS_OPTIONS,
} from "@/lib/status-options"
import {
  formatDateForInput,
  JOB_ORDER_BENEFITS_PLACEHOLDER,
  type JobOrderFormValues,
} from "@/lib/job-order-fields"

const inputFieldStyles =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-sm font-medium text-gray-700"
const sectionHeaderStyles =
  "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
const gridLayoutStyles = "grid grid-cols-12 gap-4"

type Props = {
  data?: Partial<JobOrderFormValues> & { id?: number }
}

function fieldValue(value: unknown) {
  return value != null && value !== "" ? String(value) : ""
}

export function JobOrderFormFields({ data }: Props) {
  return (
    <>
      <div>
        <h2 className={sectionHeaderStyles}>Job Order Details</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Company Name</label>
            <input name="company" defaultValue={fieldValue(data?.company)} className={inputFieldStyles} required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Country</label>
            <input name="country" type="text" defaultValue={fieldValue(data?.country)} className={inputFieldStyles} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Job Title</label>
            <input name="job_title" defaultValue={fieldValue(data?.job_title)} className={inputFieldStyles} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Status</label>
            <select
              name="status"
              defaultValue={fieldValue(data?.status) || DEFAULT_JOB_ORDER_STATUS}
              className={inputFieldStyles}
            >
              {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Job Order Date</label>
            <input
              name="job_order_date"
              type="date"
              defaultValue={formatDateForInput(data?.job_order_date)}
              className={inputFieldStyles}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Employer Information</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Commercial Registration (C.R.) No.</label>
            <input
              name="commercial_registration"
              defaultValue={fieldValue(data?.commercial_registration)}
              className={inputFieldStyles}
              placeholder="Ex: 7034264627"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Company Contact</label>
            <input
              name="company_contact"
              defaultValue={fieldValue(data?.company_contact)}
              className={inputFieldStyles}
              placeholder="Ex: 0563313305"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Company Address</label>
            <input
              name="company_address"
              defaultValue={fieldValue(data?.company_address)}
              className={inputFieldStyles}
              placeholder="Ex: Al-Dammam, Saudi Arabia"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Visa Information</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Work Visa Number</label>
            <input name="visa_number" defaultValue={fieldValue(data?.visa_number)} className={inputFieldStyles} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Work Visa Date</label>
            <input
              name="visa_date"
              type="date"
              defaultValue={formatDateForInput(data?.visa_date)}
              className={inputFieldStyles}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Visa Category</label>
            <input
              name="visa_category"
              defaultValue={fieldValue(data?.visa_category)}
              className={inputFieldStyles}
              placeholder="Ex: Waiter"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Requirements</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Sex</label>
            <select
              name="gender"
              defaultValue={fieldValue(data?.gender) || DEFAULT_JOB_ORDER_GENDER}
              className={inputFieldStyles}
            >
              {JOB_ORDER_GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Number of Workers</label>
            <input
              name="no_workers"
              type="number"
              defaultValue={data?.no_workers ?? 1}
              min={1}
              className={inputFieldStyles}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Years Experience Required</label>
            <input
              name="years_exp_required"
              type="number"
              defaultValue={data?.years_exp_required ?? 0}
              min={0}
              className={inputFieldStyles}
            />
          </div>
          <div className="col-span-12">
            <label className={labelStyles}>Skills Required</label>
            <input
              name="skills_required"
              defaultValue={fieldValue(data?.skills_required)}
              className={inputFieldStyles}
              placeholder="Ex: Cooking, Cleaning"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Compensation</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-6">
            <label className={labelStyles}>Basic Salary</label>
            <input
              name="salary"
              defaultValue={fieldValue(data?.salary)}
              className={inputFieldStyles}
              placeholder="Ex: 1700 SAR"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Terms & Benefits</h2>
        <div className={gridLayoutStyles}>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Contract Period</label>
            <input
              name="contract_period"
              defaultValue={fieldValue(data?.contract_period)}
              className={inputFieldStyles}
              placeholder="Ex: 2 years"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Place of Work</label>
            <input
              name="work_site"
              defaultValue={fieldValue(data?.work_site)}
              className={inputFieldStyles}
              placeholder="Ex: Dammam, Saudi Arabia"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelStyles}>Working Hours</label>
            <input
              name="working_hours"
              defaultValue={fieldValue(data?.working_hours)}
              className={inputFieldStyles}
              placeholder="Ex: 8 hours/day, 6 days/week"
            />
          </div>
          <div className="col-span-12">
            <label className={labelStyles}>Benefits & Other Terms</label>
            <textarea
              name="benefits_and_terms"
              rows={8}
              defaultValue={fieldValue(data?.benefits_and_terms)}
              className={inputFieldStyles}
              placeholder={JOB_ORDER_BENEFITS_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </>
  )
}

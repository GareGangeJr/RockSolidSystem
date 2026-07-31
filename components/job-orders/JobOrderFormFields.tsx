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
import { CountrySelect } from "@/components/shared/CountrySelect"
import { fieldClassSm, formGridClass, labelClassSm, sectionTitleClassSm } from "@/lib/form-ui"

type Props = {
  data?: Partial<JobOrderFormValues> & { id?: number }
}

function fieldValue(value: unknown) {
  return value != null && value !== "" ? String(value) : ""
}

export function JobOrderFormFields({ data }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={sectionTitleClassSm}>Job Order Details</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Company Name</label>
            <input name="company" defaultValue={fieldValue(data?.company)} className={fieldClassSm} required />
          </div>
          <div>
            <label className={labelClassSm}>Country</label>
            <CountrySelect name="country" defaultValue={fieldValue(data?.country)} />
          </div>
          <div>
            <label className={labelClassSm}>Job Title</label>
            <input name="job_title" defaultValue={fieldValue(data?.job_title)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Status</label>
            <select
              name="status"
              defaultValue={fieldValue(data?.status) || DEFAULT_JOB_ORDER_STATUS}
              className={fieldClassSm}
            >
              {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassSm}>Job Order Date</label>
            <input
              name="job_order_date"
              type="date"
              defaultValue={formatDateForInput(data?.job_order_date)}
              className={fieldClassSm}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Employer Information</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Commercial Registration (C.R.) No.</label>
            <input
              name="commercial_registration"
              defaultValue={fieldValue(data?.commercial_registration)}
              className={fieldClassSm}
              placeholder="Ex: 7034264627"
            />
          </div>
          <div>
            <label className={labelClassSm}>Company Contact</label>
            <input
              name="company_contact"
              defaultValue={fieldValue(data?.company_contact)}
              className={fieldClassSm}
              placeholder="Ex: 0563313305"
            />
          </div>
          <div>
            <label className={labelClassSm}>Company Address</label>
            <input
              name="company_address"
              defaultValue={fieldValue(data?.company_address)}
              className={fieldClassSm}
              placeholder="Ex: Al-Dammam, Saudi Arabia"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Visa Information</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Work Visa Number</label>
            <input name="visa_number" defaultValue={fieldValue(data?.visa_number)} className={fieldClassSm} />
          </div>
          <div>
            <label className={labelClassSm}>Work Visa Date</label>
            <input
              name="visa_date"
              type="date"
              defaultValue={formatDateForInput(data?.visa_date)}
              className={fieldClassSm}
            />
          </div>
          <div>
            <label className={labelClassSm}>Visa Category</label>
            <input
              name="visa_category"
              defaultValue={fieldValue(data?.visa_category)}
              className={fieldClassSm}
              placeholder="Ex: Waiter"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Requirements</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Sex</label>
            <select
              name="gender"
              defaultValue={fieldValue(data?.gender) || DEFAULT_JOB_ORDER_GENDER}
              className={fieldClassSm}
            >
              {JOB_ORDER_GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassSm}>Number of Workers</label>
            <input
              name="no_workers"
              type="number"
              defaultValue={data?.no_workers ?? 1}
              min={1}
              className={fieldClassSm}
            />
          </div>
          <div>
            <label className={labelClassSm}>Years Experience Required</label>
            <input
              name="years_exp_required"
              type="number"
              defaultValue={data?.years_exp_required ?? 0}
              min={0}
              className={fieldClassSm}
            />
          </div>
          <div className="col-span-full">
            <label className={labelClassSm}>Skills Required</label>
            <input
              name="skills_required"
              defaultValue={fieldValue(data?.skills_required)}
              className={fieldClassSm}
              placeholder="Ex: Cooking, Cleaning"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Compensation</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Basic Salary</label>
            <input
              name="salary"
              defaultValue={fieldValue(data?.salary)}
              className={fieldClassSm}
              placeholder="Ex: 1700 SAR"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>Terms & Benefits</h2>
        <div className={formGridClass}>
          <div>
            <label className={labelClassSm}>Contract Period</label>
            <input
              name="contract_period"
              defaultValue={fieldValue(data?.contract_period)}
              className={fieldClassSm}
              placeholder="Ex: 2 years"
            />
          </div>
          <div>
            <label className={labelClassSm}>Place of Work</label>
            <input
              name="work_site"
              defaultValue={fieldValue(data?.work_site)}
              className={fieldClassSm}
              placeholder="Ex: Dammam, Saudi Arabia"
            />
          </div>
          <div>
            <label className={labelClassSm}>Working Hours</label>
            <input
              name="working_hours"
              defaultValue={fieldValue(data?.working_hours)}
              className={fieldClassSm}
              placeholder="Ex: 8 hours/day, 6 days/week"
            />
          </div>
          <div className="col-span-full">
            <label className={labelClassSm}>Benefits & Other Terms</label>
            <textarea
              name="benefits_and_terms"
              rows={8}
              defaultValue={fieldValue(data?.benefits_and_terms)}
              className={fieldClassSm}
              placeholder={JOB_ORDER_BENEFITS_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

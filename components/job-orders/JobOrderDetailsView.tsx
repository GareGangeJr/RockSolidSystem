import type { ReactNode } from "react"
import { formGridClass, sectionTitleClassSm } from "@/lib/form-ui"
import { formatDisplayDate } from "@/lib/job-order-fields"

const labelStyles = "block text-xs font-medium text-gray-500"
const valueStyles = "mt-0.5 text-sm text-gray-900"
const gridLayoutStyles = formGridClass

type Props = {
  jobOrder: Record<string, unknown>
  showStatus?: boolean
}

function formatValue(value: unknown) {
  return value != null && value !== "" ? String(value) : "--"
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <span className={labelStyles}>{label}</span>
      <p className={valueStyles}>{formatValue(value)}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className={sectionTitleClassSm}>{title}</h2>
      {children}
    </div>
  )
}

function hasAnyValue(values: unknown[]) {
  return values.some((value) => value != null && value !== "")
}

export function JobOrderDetailsView({ jobOrder, showStatus = true }: Props) {
  const showEmployer = hasAnyValue([
    jobOrder.commercial_registration,
    jobOrder.company_contact,
    jobOrder.company_address,
  ])
  const showVisa = hasAnyValue([jobOrder.visa_number, jobOrder.visa_date, jobOrder.visa_category])
  const showTerms = hasAnyValue([
    jobOrder.contract_period,
    jobOrder.work_site,
    jobOrder.working_hours,
    jobOrder.benefits_and_terms,
  ])

  return (
    <div className="space-y-6">
      <Section title="Job Order Details">
        <div className={gridLayoutStyles}>
          <Field label="Company Name" value={jobOrder.company} />
          <Field label="Country" value={jobOrder.country} />
          <Field label="Job Title" value={jobOrder.job_title} />
          {showStatus && <Field label="Status" value={jobOrder.status} />}
          <Field
            label="Job Order Date"
            value={formatDisplayDate(jobOrder.job_order_date) ?? "--"}
          />
        </div>
      </Section>

      {showEmployer && (
        <Section title="Employer Information">
          <div className={gridLayoutStyles}>
            <Field label="Commercial Registration (C.R.) No." value={jobOrder.commercial_registration} />
            <Field label="Company Contact" value={jobOrder.company_contact} />
            <Field label="Company Address" value={jobOrder.company_address} />
          </div>
        </Section>
      )}

      {showVisa && (
        <Section title="Visa Information">
          <div className={gridLayoutStyles}>
            <Field label="Work Visa Number" value={jobOrder.visa_number} />
            <Field
              label="Work Visa Date"
              value={formatDisplayDate(jobOrder.visa_date) ?? "--"}
            />
            <Field label="Visa Category" value={jobOrder.visa_category} />
          </div>
        </Section>
      )}

      <Section title="Requirements">
        <div className={gridLayoutStyles}>
          <Field label="Sex" value={jobOrder.gender} />
          <Field
            label="Number of Workers"
            value={jobOrder.no_workers != null ? String(jobOrder.no_workers) : "--"}
          />
          <Field
            label="Years Experience Required"
            value={jobOrder.years_exp_required != null ? String(jobOrder.years_exp_required) : "--"}
          />
          <div className="col-span-full">
            <span className={labelStyles}>Skills Required</span>
            <p className={valueStyles}>{formatValue(jobOrder.skills_required)}</p>
          </div>
        </div>
      </Section>

      <Section title="Compensation">
        <div className={gridLayoutStyles}>
          <Field label="Basic Salary" value={jobOrder.salary} />
        </div>
      </Section>

      {showTerms && (
        <Section title="Terms & Benefits">
          <div className={gridLayoutStyles}>
            <Field label="Contract Period" value={jobOrder.contract_period} />
            <Field label="Place of Work" value={jobOrder.work_site} />
            <Field label="Working Hours" value={jobOrder.working_hours} />
            <div className="col-span-full">
              <span className={labelStyles}>Benefits & Other Terms</span>
              <p className={`${valueStyles} whitespace-pre-line`}>
                {formatValue(jobOrder.benefits_and_terms)}
              </p>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}

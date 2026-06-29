import { formatDisplayDate } from "@/lib/job-order-fields"

const labelStyles = "block text-xs font-medium text-gray-500"
const valueStyles = "mt-0.5 text-sm text-gray-900"
const sectionHeaderStyles =
  "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
const gridLayoutStyles = "grid grid-cols-12 gap-4"

type Props = {
  jobOrder: Record<string, unknown>
  showStatus?: boolean
}

function formatValue(value: unknown) {
  return value != null && value !== "" ? String(value) : "--"
}

function DetailField({
  label,
  value,
  className = "col-span-12 md:col-span-4",
}: {
  label: string
  value: unknown
  className?: string
}) {
  return (
    <div className={className}>
      <span className={labelStyles}>{label}</span>
      <p className={valueStyles}>{formatValue(value)}</p>
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
      <div>
        <h2 className={sectionHeaderStyles}>Job Order Details</h2>
        <div className={gridLayoutStyles}>
          <DetailField label="ID" value={`JO-${formatValue(jobOrder.id)}`} />
          <DetailField label="Company Name" value={jobOrder.company} />
          <DetailField label="Country" value={jobOrder.country} />
          <DetailField label="Job Title" value={jobOrder.job_title} className="col-span-12 md:col-span-6" />
          {showStatus && (
            <DetailField label="Status" value={jobOrder.status} className="col-span-12 md:col-span-6" />
          )}
          <DetailField
            label="Job Order Date"
            value={formatDisplayDate(jobOrder.job_order_date) ?? "--"}
          />
        </div>
      </div>

      {showEmployer && (
        <>
          <hr className="border-gray-200" />
          <div>
            <h2 className={sectionHeaderStyles}>Employer Information</h2>
            <div className={gridLayoutStyles}>
              <DetailField label="Commercial Registration (C.R.) No." value={jobOrder.commercial_registration} />
              <DetailField label="Company Contact" value={jobOrder.company_contact} />
              <DetailField label="Company Address" value={jobOrder.company_address} />
            </div>
          </div>
        </>
      )}

      {showVisa && (
        <>
          <hr className="border-gray-200" />
          <div>
            <h2 className={sectionHeaderStyles}>Visa Information</h2>
            <div className={gridLayoutStyles}>
              <DetailField label="Work Visa Number" value={jobOrder.visa_number} />
              <DetailField
                label="Work Visa Date"
                value={formatDisplayDate(jobOrder.visa_date) ?? "--"}
              />
              <DetailField label="Visa Category" value={jobOrder.visa_category} />
            </div>
          </div>
        </>
      )}

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Requirements</h2>
        <div className={gridLayoutStyles}>
          <DetailField label="Sex" value={jobOrder.gender} />
          <DetailField
            label="Number of Workers"
            value={jobOrder.no_workers != null ? String(jobOrder.no_workers) : "--"}
          />
          <DetailField
            label="Years Experience Required"
            value={jobOrder.years_exp_required != null ? String(jobOrder.years_exp_required) : "--"}
          />
          <DetailField label="Skills Required" value={jobOrder.skills_required} className="col-span-12" />
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className={sectionHeaderStyles}>Compensation</h2>
        <div className={gridLayoutStyles}>
          <DetailField label="Basic Salary" value={jobOrder.salary} className="col-span-12 md:col-span-6" />
        </div>
      </div>

      {showTerms && (
        <>
          <hr className="border-gray-200" />
          <div>
            <h2 className={sectionHeaderStyles}>Terms & Benefits</h2>
            <div className={gridLayoutStyles}>
              <DetailField label="Contract Period" value={jobOrder.contract_period} />
              <DetailField label="Place of Work" value={jobOrder.work_site} />
              <DetailField label="Working Hours" value={jobOrder.working_hours} />
              <div className="col-span-12">
                <span className={labelStyles}>Benefits & Other Terms</span>
                <p className={`${valueStyles} whitespace-pre-line`}>
                  {formatValue(jobOrder.benefits_and_terms)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

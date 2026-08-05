import type { ReactNode } from "react"
import { formGridClass, sectionTitleClassSm } from "@/lib/form-ui"
import {
  concernEntryHasData,
  historyEntryHasData,
  normalizeConcernEntriesFromRecord,
  normalizeHistoryEntriesFromRecord,
  type MonitoringConcernEntry,
  type MonitoringHistoryEntry,
} from "@/lib/monitoring-entries"

const labelStyles = "block text-xs font-medium text-gray-500"
const valueStyles = "mt-0.5 text-sm text-gray-900"
const gridLayoutStyles = formGridClass

type ApplicantInfo = {
  first_name?: string | null
  last_name?: string | null
  contact_number?: string | null
  passport_number?: string | null
} | null

type JobOrderInfo = {
  id?: number | null
  job_title?: string | null
  company?: string | null
  country?: string | null
} | null

type MonitoringRecord = Record<string, unknown>

type Props = {
  monitoring: MonitoringRecord
  applicant?: ApplicantInfo
  jobOrder?: JobOrderInfo
}

function formatValue(value: unknown) {
  return value != null && value !== "" ? String(value) : "--"
}

function formatDate(value: unknown) {
  return value != null && String(value).length >= 10 ? String(value).slice(0, 10) : "--"
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

function ConcernCard({ entry, index }: { entry: MonitoringConcernEntry; index: number }) {
  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="mb-2 text-xs font-bold text-gray-600">CONCERN {index + 1}</div>
      <div className={gridLayoutStyles}>
        <Field label="Type of Concern" value={entry.concern_type} />
        <Field label="Date Reported" value={formatDate(entry.concern_date_reported)} />
        <Field label="Status of Concern" value={entry.concern_status} />
        <div className="col-span-full">
          <span className={labelStyles}>Action Taken</span>
          <p className={valueStyles}>{formatValue(entry.action_taken)}</p>
        </div>
      </div>
    </div>
  )
}

function HistoryCard({ entry, index }: { entry: MonitoringHistoryEntry; index: number }) {
  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="mb-2 text-xs font-bold text-gray-600">HISTORY {index + 1}</div>
      <div className={gridLayoutStyles}>
        <Field label="Entry Date" value={formatDate(entry.entry_date)} />
        <Field label="Date of Arrival" value={formatDate(entry.date_of_arrival)} />
        <Field label="Expected Return Date" value={formatDate(entry.expected_return_date)} />
        <Field label="Actual Return Date" value={formatDate(entry.actual_return_date)} />
        <Field label="Reason for Return" value={entry.reason_for_return} />
        <Field label="Will Extend Contract?" value={entry.will_extend_contract} />
        {entry.notes ? (
          <div className="col-span-full">
            <span className={labelStyles}>Notes</span>
            <p className={valueStyles}>{entry.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function MonitoringDetailsView({ monitoring, applicant, jobOrder }: Props) {
  const applicantName = applicant
    ? [applicant.first_name, applicant.last_name].filter(Boolean).join(" ") || "--"
    : "--"

  const concerns = normalizeConcernEntriesFromRecord(monitoring).filter(concernEntryHasData)
  const history = normalizeHistoryEntriesFromRecord(monitoring).filter(historyEntryHasData)

  return (
    <div className="space-y-6">
      <Section title="Applicant & Job Information">
        <div className={gridLayoutStyles}>
          <Field label="Applicant Name" value={applicantName} />
          <Field label="Contact" value={applicant?.contact_number} />
          <Field label="Passport Number" value={applicant?.passport_number} />
          <Field label="Job Order ID" value={jobOrder?.id != null ? `JO-${jobOrder.id}` : "--"} />
          <Field label="Job Title" value={jobOrder?.job_title} />
          <Field label="Company" value={jobOrder?.company} />
          <Field label="Country" value={jobOrder?.country} />
        </div>
      </Section>

      <Section title="Deployment Details">
        <div className={gridLayoutStyles}>
          <Field label="Deployment Status" value={monitoring.deployment_status} />
          <Field label="Employer Name" value={monitoring.employer_name} />
          <Field label="Contract Duration" value={monitoring.contract_duration} />
          <Field label="Salary Amount" value={monitoring.salary_amount} />
          <Field label="Departure Date" value={formatDate(monitoring.deployment_date)} />
          <Field label="Welfare Officer Assigned" value={monitoring.welfare_officer} />
          <Field label="Last Status Update" value={formatDate(monitoring.last_status_update)} />
        </div>
      </Section>

      <Section title="Concerns">
        {concerns.length === 0 ? (
          <p className="text-sm text-gray-500">No concerns recorded.</p>
        ) : (
          <div className="space-y-4">
            {concerns.map((entry, index) => (
              <ConcernCard key={index} entry={entry} index={index} />
            ))}
          </div>
        )}
      </Section>

      <Section title="History">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No history recorded.</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <HistoryCard key={index} entry={entry} index={index} />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

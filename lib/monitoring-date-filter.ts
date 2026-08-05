import {
  normalizeConcernEntriesFromRecord,
  normalizeHistoryEntriesFromRecord,
} from "@/lib/monitoring-entries"
import { isDeploymentInDateRange } from "@/lib/reports/date-range"

export const MONITORING_DATE_FILTER_FIELDS = [
  { value: "deployment_date", label: "Departure Date" },
  { value: "expected_return_date", label: "ETA Return Date" },
  { value: "actual_return_date", label: "Actual Return Date" },
  { value: "concern_date_reported", label: "Date Reported" },
  { value: "date_of_arrival", label: "Date of Arrival" },
] as const

export type MonitoringDateFilterField = (typeof MONITORING_DATE_FILTER_FIELDS)[number]["value"]

function sliceDate(value: unknown): string | null {
  if (value == null || String(value).trim() === "") return null
  return String(value).slice(0, 10)
}

export function getMonitoringDatesForField(
  record: Record<string, unknown>,
  field: MonitoringDateFilterField
): string[] {
  const dates: string[] = []
  const topLevel = sliceDate(record[field])
  if (topLevel) dates.push(topLevel)

  if (field === "date_of_arrival" || field === "actual_return_date" || field === "expected_return_date") {
    for (const entry of normalizeHistoryEntriesFromRecord(record)) {
      const day = sliceDate(entry[field as keyof typeof entry])
      if (day && !dates.includes(day)) dates.push(day)
    }
  }

  if (field === "concern_date_reported") {
    for (const entry of normalizeConcernEntriesFromRecord(record)) {
      const day = sliceDate(entry.concern_date_reported)
      if (day && !dates.includes(day)) dates.push(day)
    }
  }

  return dates
}

export function monitoringRecordMatchesDateRange(
  record: Record<string, unknown>,
  field: MonitoringDateFilterField,
  fromDate: string | null,
  toDate: string | null
): boolean {
  if (!fromDate && !toDate) return true

  const dates = getMonitoringDatesForField(record, field)
  if (dates.length === 0) return false

  return dates.some((day) => isDeploymentInDateRange(day, fromDate, toDate))
}

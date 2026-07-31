import { formatApplicantRef } from "@/lib/format-applicant-ref"

export function normalizeActivityRecordId(
  module: string,
  recordId: string | number | null | undefined,
  details?: Record<string, unknown>
): string | null {
  if (recordId == null) return null

  let moduleKey = module
  let id = String(recordId)

  if (id === "Reports") return id
  if (/^APP-\d{4}-\d+$/.test(id)) return id
  if (/^(JO|MON|EMP)-/.test(id)) return id

  if (module === "archive") {
    if (typeof details?.entityId === "number") id = String(details.entityId)
    if (typeof details?.table === "string") {
      const table = details.table
      if (table === "applicant_files") moduleKey = "applicants"
      else if (table === "employee_files") moduleKey = "employees"
      else moduleKey = table
    }
  }

  if (moduleKey === "applicants") {
    const shortMatch = id.match(/^APP-(\d+)$/)
    if (shortMatch) return formatApplicantRef(Number(shortMatch[1]))
    if (/^\d+$/.test(id)) return formatApplicantRef(Number(id))
    return id
  }
  if (moduleKey === "job_orders") return `JO-${id}`
  if (moduleKey === "monitoring") return `MON-${id}`
  if (moduleKey === "employees" || moduleKey === "attendance") {
    return id.startsWith("EMP-") ? id : `EMP-${id}`
  }

  return id
}

export function formatActivityAction(action: string): string {
  const labels: Record<string, string> = {
    create: "Created",
    update: "Updated",
    archive: "Archived",
    restore: "Restored",
    deploy: "Deployed",
    match: "Matched",
    unmatch: "Unmatched",
    status_change: "Changed status",
    login_create: "Created login",
    login_disable: "Disabled login",
    time_in: "Timed in",
    time_out: "Timed out",
    download: "Downloaded",
  }
  return labels[action] ?? action.replace(/_/g, " ")
}

export function formatActivityModule(module: string): string {
  const labels: Record<string, string> = {
    applicants: "Applicant",
    job_orders: "Job Order",
    monitoring: "Monitoring",
    employees: "Employee",
    archive: "Archive",
    attendance: "Attendance",
    reports: "Reports",
  }
  return labels[module] ?? module.replace(/_/g, " ")
}

export function formatActivityRecord(
  module: string,
  recordId: string | null,
  details?: Record<string, unknown>
): string {
  return normalizeActivityRecordId(module, recordId, details) ?? "--"
}

export const ARCHIVABLE_TABLES = ["applicants", "job_orders", "employees", "monitoring"] as const
export const ARCHIVABLE_FILE_TABLES = ["applicant_files", "employee_files"] as const

export type ArchivableTable = (typeof ARCHIVABLE_TABLES)[number]
export type ArchivableFileTable = (typeof ARCHIVABLE_FILE_TABLES)[number]

export function isArchivableTable(value: string): value is ArchivableTable {
  return (ARCHIVABLE_TABLES as readonly string[]).includes(value)
}

export const ARCHIVE_TABLE_LABELS: Record<ArchivableTable, string> = {
  applicants: "Applicant",
  job_orders: "Job Order",
  employees: "Employee",
  monitoring: "Monitoring Record",
}

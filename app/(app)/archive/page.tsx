import { createSupabaseServer } from "@/lib/supabase/server"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { ArchiveView } from "@/components/archive/ArchiveView"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

function fullName(first: string | null, middle: string | null, last: string | null) {
  return [first, middle, last].filter(Boolean).join(" ")
}

export default async function ArchivePage() {
  const supabase = await createSupabaseServer()
  const admin = createSupabaseAdmin()

  const [
    { data: applicants, error: applicantsError },
    { data: jobOrders, error: jobOrdersError },
    { data: employees, error: employeesError },
    { data: monitoringRecords, error: monitoringError },
    { data: applicantFiles, error: applicantFilesError },
    { data: employeeFiles, error: employeeFilesError },
  ] = await Promise.all([
    supabase
      .from("applicants")
      .select("id, first_name, middle_name, last_name, position_applied, status, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
    supabase
      .from("job_orders")
      .select("id, company, country, job_title, status, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
    supabase
      .from("employees")
      .select("id, employee_number, first_name, middle_name, last_name, position, employment_status, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
    supabase
      .from("monitoring")
      .select("id, applicant_id, job_order_id, deployment_status, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
    admin
      .from("applicant_files")
      .select("id, applicant_id, file_name, file_path, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
    admin
      .from("employee_files")
      .select("id, employee_id, file_name, file_path, archived_at")
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false }),
  ])

  const error =
    applicantsError ??
    jobOrdersError ??
    employeesError ??
    monitoringError ??
    applicantFilesError ??
    employeeFilesError
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Archive</h1>
        <p className="mt-2 text-red-500">
          Error loading archive: {error.message}. If this mentions <code>archived_at</code>, run{" "}
          <code>supabase/add_archived_at.sql</code> in Supabase first.
        </p>
      </div>
    )
  }

  const applicantIds = monitoringRecords?.map((record) => record.applicant_id) ?? []
  const jobOrderIds = monitoringRecords?.map((record) => record.job_order_id) ?? []

  const [{ data: monitoringApplicants }, { data: monitoringJobOrders }] = await Promise.all([
    supabase
      .from("applicants")
      .select("id, first_name, last_name")
      .in("id", applicantIds.length > 0 ? applicantIds : [0]),
    supabase
      .from("job_orders")
      .select("id, job_title, country")
      .in("id", jobOrderIds.length > 0 ? jobOrderIds : [0]),
  ])

  const archivedApplicantIds = [...new Set((applicantFiles ?? []).map((file) => file.applicant_id))]
  const archivedEmployeeIds = [...new Set((employeeFiles ?? []).map((file) => file.employee_id))]

  const [{ data: fileApplicants }, { data: fileEmployees }] = await Promise.all([
    supabase
      .from("applicants")
      .select("id, first_name, middle_name, last_name")
      .in("id", archivedApplicantIds.length > 0 ? archivedApplicantIds : [0]),
    supabase
      .from("employees")
      .select("id, first_name, middle_name, last_name, employee_number")
      .in("id", archivedEmployeeIds.length > 0 ? archivedEmployeeIds : [0]),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Archive</h1>
      </div>

      <ArchiveView
        applicants={(applicants ?? []).map((row) => ({
          id: row.id,
          name: fullName(row.first_name, row.middle_name, row.last_name) || formatApplicantRef(row.id),
          position: row.position_applied ?? null,
          status: row.status ?? null,
          archived_at: row.archived_at as string,
        }))}
        jobOrders={(jobOrders ?? []).map((row) => ({
          id: row.id,
          company: row.company ?? null,
          country: row.country ?? null,
          job_title: row.job_title ?? null,
          status: row.status ?? null,
          archived_at: row.archived_at as string,
        }))}
        employees={(employees ?? []).map((row) => ({
          id: row.id,
          employee_number: row.employee_number ?? null,
          name: fullName(row.first_name, row.middle_name, row.last_name) || `Employee ${row.id}`,
          position: row.position ?? null,
          employment_status: row.employment_status ?? null,
          archived_at: row.archived_at as string,
        }))}
        monitoring={(monitoringRecords ?? []).map((row) => {
          const applicant = monitoringApplicants?.find((item) => item.id === row.applicant_id)
          const jobOrder = monitoringJobOrders?.find((item) => item.id === row.job_order_id)
          const applicantName = applicant
            ? [applicant.first_name, applicant.last_name].filter(Boolean).join(" ")
            : formatApplicantRef(row.applicant_id)
          const jobOrderLabel = jobOrder
            ? `JO-${jobOrder.id} - ${jobOrder.job_title ?? "Job Order"}`
            : `JO-${row.job_order_id}`

          return {
            id: row.id,
            applicantName,
            applicantId: row.applicant_id ?? null,
            jobOrderLabel,
            deployment_status: row.deployment_status ?? null,
            archived_at: row.archived_at as string,
          }
        })}
        applicantFiles={(applicantFiles ?? []).map((row) => {
          const applicant = fileApplicants?.find((item) => item.id === row.applicant_id)
          const entityLabel = applicant
            ? fullName(applicant.first_name, applicant.middle_name, applicant.last_name) ||
              formatApplicantRef(row.applicant_id)
            : formatApplicantRef(row.applicant_id)

          return {
            id: row.id,
            entityId: row.applicant_id,
            entityLabel,
            file_name: row.file_name ?? null,
            file_path: row.file_path ?? null,
            bucket: "applicant files" as const,
            archived_at: row.archived_at as string,
          }
        })}
        employeeFiles={(employeeFiles ?? []).map((row) => {
          const employee = fileEmployees?.find((item) => item.id === row.employee_id)
          const entityLabel = employee
            ? fullName(employee.first_name, employee.middle_name, employee.last_name) ||
              employee.employee_number ||
              `Employee ${row.employee_id}`
            : `Employee ${row.employee_id}`

          return {
            id: row.id,
            entityId: row.employee_id,
            entityLabel,
            file_name: row.file_name ?? null,
            file_path: row.file_path ?? null,
            bucket: "employee-files" as const,
            archived_at: row.archived_at as string,
          }
        })}
      />
    </div>
  )
}

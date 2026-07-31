"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { SearchTable } from "@/components/shared/SearchTable"
import { FilePreviewModal } from "@/components/shared/FilePreviewModal"
import { RestoreButton } from "@/components/shared/RestoreButton"
import { RestoreFileButton } from "@/components/shared/RestoreFileButton"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

export type ArchivedApplicantRow = {
  id: number
  name: string
  position: string | null
  status: string | null
  archived_at: string
}

export type ArchivedJobOrderRow = {
  id: number
  company: string | null
  country: string | null
  job_title: string | null
  status: string | null
  archived_at: string
}

export type ArchivedEmployeeRow = {
  id: number
  employee_number: string | null
  name: string
  position: string | null
  employment_status: string | null
  archived_at: string
}

export type ArchivedMonitoringRow = {
  id: number
  applicantName: string
  applicantId: number | null
  jobOrderLabel: string
  deployment_status: string | null
  archived_at: string
}

function formatArchivedDate(value: string) {
  return new Date(value).toLocaleString()
}

export type ArchivedFileRow = {
  id: number
  entityId: number
  entityLabel: string
  file_name: string | null
  file_path: string | null
  bucket: "applicant files" | "employee-files"
  archived_at: string
}

type ArchiveViewProps = {
  applicants: ArchivedApplicantRow[]
  jobOrders: ArchivedJobOrderRow[]
  employees: ArchivedEmployeeRow[]
  monitoring: ArchivedMonitoringRow[]
  applicantFiles: ArchivedFileRow[]
  employeeFiles: ArchivedFileRow[]
}

export function ArchiveView({
  applicants,
  jobOrders,
  employees,
  monitoring,
  applicantFiles,
  employeeFiles,
}: ArchiveViewProps) {
  const supabase = createSupabaseBrowser()
  const [preview, setPreview] = useState<{ url: string; name: string; pdf: boolean } | null>(null)

  async function viewArchivedFile(row: ArchivedFileRow) {
    const name = row.file_name || "file"
    if (!row.file_path) {
      alert("File not found.")
      return
    }

    const lower = name.toLowerCase()
    const pdf = lower.endsWith(".pdf")
    const image = /\.(jpe?g|png)$/.test(lower)
    if (!pdf && !image) {
      alert("This file type cannot be previewed here.")
      return
    }

    const { data, error } = await supabase.storage.from(row.bucket).createSignedUrl(row.file_path, 60)
    if (error || !data?.signedUrl) {
      alert(error?.message || "Could not open file.")
      return
    }

    setPreview({ url: data.signedUrl, name, pdf })
  }

  const total =
    applicants.length +
    jobOrders.length +
    employees.length +
    monitoring.length +
    applicantFiles.length +
    employeeFiles.length

  if (total === 0) {
    return <p className="text-gray-600">No archived records yet.</p>
  }

  return (
    <>
    <div className="space-y-8">
      {applicants.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Applicants ({applicants.length})</h2>
          <SearchTable
            rows={applicants}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived applicants..."
            searchMatch={(row, query) =>
              [formatApplicantRef(row.id), row.name, row.position, row.status]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Applicant ID", cell: (row) => formatApplicantRef(row.id) },
              { header: "Name", cell: (row) => row.name },
              { header: "Position", cell: (row) => row.position ?? "--" },
              { header: "Status", cell: (row) => row.status ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/applicants/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <RestoreButton table="applicants" id={row.id} name={row.name} />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived applicants."
          />
        </section>
      )}

      {jobOrders.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Job Orders ({jobOrders.length})</h2>
          <SearchTable
            rows={jobOrders}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived job orders..."
            searchMatch={(row, query) =>
              [`jo-${row.id}`, row.company, row.country, row.job_title, row.status]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Job Order ID", cell: (row) => `JO-${row.id}` },
              { header: "Company", cell: (row) => row.company ?? "--" },
              { header: "Country", cell: (row) => row.country ?? "--" },
              { header: "Job Title", cell: (row) => row.job_title ?? "--" },
              { header: "Status", cell: (row) => row.status ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/job-orders/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <RestoreButton table="job_orders" id={row.id} name={`JO-${row.id}`} />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived job orders."
          />
        </section>
      )}

      {employees.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Employees ({employees.length})</h2>
          <SearchTable
            rows={employees}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived employees..."
            searchMatch={(row, query) =>
              [row.employee_number, row.name, row.position, row.employment_status]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Employee ID", cell: (row) => row.employee_number ?? "--" },
              { header: "Name", cell: (row) => row.name },
              { header: "Position", cell: (row) => row.position ?? "--" },
              { header: "Status", cell: (row) => row.employment_status ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/employees/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <RestoreButton table="employees" id={row.id} name={row.name} />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived employees."
          />
        </section>
      )}

      {monitoring.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Monitoring ({monitoring.length})</h2>
          <SearchTable
            rows={monitoring}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived monitoring records..."
            searchMatch={(row, query) =>
              [row.applicantName, row.jobOrderLabel, row.deployment_status]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Applicant", cell: (row) => row.applicantName },
              { header: "Job Order", cell: (row) => row.jobOrderLabel },
              { header: "Deployment Status", cell: (row) => row.deployment_status ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/monitoring/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <RestoreButton table="monitoring" id={row.id} name={row.applicantName} />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived monitoring records."
          />
        </section>
      )}

      {applicantFiles.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Applicant Files ({applicantFiles.length})</h2>
          <SearchTable
            rows={applicantFiles}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived applicant files..."
            searchMatch={(row, query) =>
              [row.entityLabel, row.file_name]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Applicant", cell: (row) => row.entityLabel },
              { header: "File Name", cell: (row) => row.file_name ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => viewArchivedFile(row)}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <RestoreFileButton
                      table="applicant_files"
                      fileId={row.id}
                      entityId={row.entityId}
                      name={row.file_name ?? "file"}
                    />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived applicant files."
          />
        </section>
      )}

      {employeeFiles.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Employee Files ({employeeFiles.length})</h2>
          <SearchTable
            rows={employeeFiles}
            rowKey={(row) => row.id}
            searchPlaceholder="Search archived employee files..."
            searchMatch={(row, query) =>
              [row.entityLabel, row.file_name]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query)
            }
            columns={[
              { header: "Employee", cell: (row) => row.entityLabel },
              { header: "File Name", cell: (row) => row.file_name ?? "--" },
              { header: "Archived", cell: (row) => formatArchivedDate(row.archived_at) },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => viewArchivedFile(row)}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <RestoreFileButton
                      table="employee_files"
                      fileId={row.id}
                      entityId={row.entityId}
                      name={row.file_name ?? "file"}
                    />
                  </div>
                ),
              },
            ]}
            emptyMessage="No archived employee files."
          />
        </section>
      )}
    </div>
    <FilePreviewModal preview={preview} onClose={() => setPreview(null)} />
    </>
  )
}

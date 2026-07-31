"use client"

import Link from "next/link"
import { Eye, Pencil, UserPlus } from "lucide-react"
import { SearchTable } from "@/components/shared/SearchTable"
import { ArchiveButton } from "@/components/shared/ArchiveButton"
import JobOrderStatusSelect from "@/components/job-orders/JobOrderStatusSelect"
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/status-options"
import type { JobOrder } from "@/types/entities"

type JobOrderRow = JobOrder & { assigned_workers: number }

export function JobOrderTable({ jobOrders }: { jobOrders: JobOrderRow[] }) {
  return (
    <SearchTable
      rows={jobOrders}
      rowKey={(row) => row.id}
      searchPlaceholder="Search company, country, job title, ID..."
      searchMatch={(row, query) => {
        const haystack = [`jo-${row.id}`, row.company, row.country, row.job_title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      }}
      filters={[
        {
          id: "status",
          label: "Status",
          options: JOB_ORDER_STATUS_OPTIONS,
          match: (row, value) => row.status?.trim() === value,
        },
      ]}
      columns={[
        { header: "Job Order ID", cell: (row) => `JO-${row.id}` },
        { header: "Company", cell: (row) => row.company ?? "--" },
        { header: "Country", cell: (row) => row.country ?? "--" },
        { header: "Job Title", cell: (row) => row.job_title ?? "--" },
        { header: "Workers", cell: (row) => {
          const assigned = row.assigned_workers
          const needed = row.no_workers
          if (needed == null) return assigned
          return `${assigned}/${needed}`
        }},
        {
          header: "Status",
          cell: (row) => <JobOrderStatusSelect jobOrderId={row.id} currentStatus={row.status} />,
        },
        {
          header: "Actions",
          cell: (row) => (
            <div className="flex items-center gap-3">
              <Link href={`/job-orders/${row.id}`} className="rounded p-1 hover:bg-blue-100 hover:text-blue-600" title="View">
                <Eye className="h-4 w-4" />
              </Link>
              <Link href={`/job-orders/${row.id}/match`} className="rounded p-1 hover:bg-green-100 hover:text-green-600" title="Match Applicants">
                <UserPlus className="h-4 w-4" />
              </Link>
              <Link href={`/job-orders/${row.id}/edit`} className="rounded p-1 hover:bg-yellow-100 hover:text-yellow-600" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
              <ArchiveButton table="job_orders" id={row.id} name={`JO-${row.id}`} />
            </div>
          ),
        },
      ]}
      emptyMessage="No job orders found."
    />
  )
}

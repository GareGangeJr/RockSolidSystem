"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { SearchTable } from "@/components/shared/SearchTable"
import type { JobOrder } from "@/types/entities"

type PublicJobOrder = Pick<JobOrder, "id" | "company" | "country" | "job_title" | "no_workers">

export function PublicJobOrderTable({ jobOrders }: { jobOrders: PublicJobOrder[] }) {
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
      columns={[
        { header: "Job Order ID", cell: (row) => `JO-${row.id}` },
        { header: "Company", cell: (row) => row.company ?? "--" },
        { header: "Country", cell: (row) => row.country ?? "--" },
        { header: "Job Title", cell: (row) => row.job_title ?? "--" },
        { header: "Workers Needed", cell: (row) => row.no_workers ?? "--" },
        {
          header: "View",
          cell: (row) => (
            <Link href={`/apply/job-orders/${row.id}`} className="inline-flex rounded p-1 hover:bg-blue-100 hover:text-blue-600" title="View details">
              <Eye className="h-4 w-4" />
            </Link>
          ),
        },
      ]}
      emptyMessage="No open job orders available right now."
    />
  )
}

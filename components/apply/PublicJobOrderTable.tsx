"use client"

import Link from "next/link"
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
          header: "",
          cell: (row) => (
            <Link
              href={`/apply/job-orders/${row.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Details
            </Link>
          ),
        },
      ]}
      emptyMessage="No open job orders available right now."
    />
  )
}

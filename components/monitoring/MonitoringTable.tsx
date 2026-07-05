"use client"

import Link from "next/link"
import { Eye, Pencil } from "lucide-react"
import { SearchTable } from "@/components/shared/SearchTable"
import { formatApplicantRef } from "@/lib/format-applicant-ref"
import type { MonitoringRecord } from "@/types/entities"

function formatDate(date: string | null) {
  return date ? new Date(date).toLocaleDateString() : "--"
}

export function MonitoringTable({ records }: { records: MonitoringRecord[] }) {
  return (
    <SearchTable
      rows={records}
      rowKey={(row) => row.id}
      searchPlaceholder="Search applicant name, job order, country..."
      searchMatch={(row, query) => {
        const haystack = [
          row.applicant?.first_name,
          row.applicant?.last_name,
          formatApplicantRef(row.applicant?.id ?? 0),
          `jo-${row.jobOrder?.id}`,
          row.jobOrder?.country,
          row.jobOrder?.job_title,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      }}
      filters={[
        {
          id: "deployment",
          label: "Deployment",
          options: ["Deployed", "Deployed(With Concerns)"],
          match: (row, value) => row.deployment_status?.trim() === value,
        },
        {
          id: "concern",
          label: "Concern",
          options: ["None", "Pending", "Resolved", "Escalated"],
          match: (row, value) => {
            if (value === "None") return !row.concern_status
            return row.concern_status?.trim() === value
          },
        },
      ]}
      columns={[
        {
          header: "Applicant ID & Name",
          cell: (row) => (
            <>
              <div>{formatApplicantRef(row.applicant?.id)}</div>
              <div className="text-xs text-gray-500">
                {row.applicant?.first_name} {row.applicant?.last_name}
              </div>
            </>
          ),
        },
        {
          header: "Job Order ID & Title",
          cell: (row) => (
            <>
              <div>JO-{row.jobOrder?.id}</div>
              <div className="text-xs text-gray-500">{row.jobOrder?.job_title ?? "--"}</div>
            </>
          ),
        },
        { header: "Country", cell: (row) => row.jobOrder?.country ?? "--" },
        { header: "Deployment Status", cell: (row) => row.deployment_status ?? "--" },
        { header: "Deployed Date", cell: (row) => formatDate(row.deployment_date) },
        { header: "Concern Status", cell: (row) => row.concern_status ?? "--" },
        { header: "ETA Return Date", cell: (row) => formatDate(row.expected_return_date) },
        {
          header: "Actions",
          cell: (row) => (
            <div className="flex items-center gap-3">
              <Link href={`/monitoring/${row.id}`} className="rounded p-1 hover:bg-blue-100 hover:text-blue-600" title="View">
                <Eye className="h-4 w-4" />
              </Link>
              <Link href={`/monitoring/${row.id}/edit`} className="rounded p-1 hover:bg-yellow-100 hover:text-yellow-600" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          ),
        },
      ]}
      emptyMessage="No monitoring records found."
    />
  )
}

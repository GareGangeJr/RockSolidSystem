"use client"

import Link from "next/link"
import { Eye, FolderOpen, Pencil } from "lucide-react"
import { SearchTable } from "@/components/shared/SearchTable"
import { ArchiveButton } from "@/components/shared/ArchiveButton"
import { ApplicantStatusSelect } from "./ApplicantStatusSelect"
import { formatApplicantRef } from "@/lib/format-applicant-ref"
import { APPLICANT_TYPE_FILTER_OPTIONS, resolveApplicantType, STATUS_OPTIONS } from "@/lib/status-options"
import type { Applicant } from "@/types/entities"

type ApplicantRow = Pick<
  Applicant,
  | "id"
  | "created_at"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "position_applied"
  | "applicant_type"
  | "status"
  | "notes"
  | "contact_number"
  | "email"
  | "date_applied"
>

function fullName(applicant: ApplicantRow) {
  return [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(" ")
}

function formatAppliedDate(dateApplied: string | null, createdAt: string) {
  const val = dateApplied ?? createdAt
  return val.length >= 10 ? val.slice(0, 10) : val
}

export function ApplicantTable({ applicants }: { applicants: ApplicantRow[] }) {
  return (
    <SearchTable
      rows={applicants}
      rowKey={(row) => row.id}
      searchPlaceholder="Search name, ID, position, contact, email..."
      searchMatch={(row, query) => {
        const haystack = [
          formatApplicantRef(row.id),
          fullName(row),
          row.position_applied,
          row.contact_number,
          row.email,
          row.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      }}
      filters={[
        {
          id: "type",
          label: "Type",
          options: APPLICANT_TYPE_FILTER_OPTIONS,
          match: (row, value) => resolveApplicantType(row.applicant_type, row.position_applied) === value,
        },
        {
          id: "status",
          label: "Status",
          options: STATUS_OPTIONS,
          match: (row, value) => row.status?.trim() === value,
        },
      ]}
      columns={[
        { header: "Applicant ID", cell: (row) => formatApplicantRef(row.id) },
        { header: "Name", cell: (row) => fullName(row) },
        { header: "Position", cell: (row) => row.position_applied ?? "--" },
        { header: "Type", cell: (row) => resolveApplicantType(row.applicant_type, row.position_applied) ?? "--" },
        {
          header: "Status",
          cell: (row) => <ApplicantStatusSelect applicantId={row.id} currentStatus={row.status} />,
        },
        { header: "Contact", cell: (row) => row.contact_number ?? "--" },
        {
          header: "Date Applied",
          cell: (row) => formatAppliedDate(row.date_applied, row.created_at),
        },
        {
          header: "Actions",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Link href={`/applicants/${row.id}/files`} className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600" title="Files">
                <FolderOpen className="h-4 w-4" />
              </Link>
              <Link href={`/applicants/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                <Eye className="h-4 w-4" />
              </Link>
              <Link href={`/applicants/${row.id}/edit`} className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
              <ArchiveButton table="applicants" id={row.id} name={fullName(row) || `Applicant ${row.id}`} />
            </div>
          ),
        },
      ]}
      emptyMessage="No applicants found."
    />
  )
}

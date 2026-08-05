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
  | "active_cellphone"
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

const actionClass = "rounded-md p-1.5 text-gray-500 hover:bg-gray-100"

export function ApplicantTable({ applicants }: { applicants: ApplicantRow[] }) {
  return (
    <SearchTable
      rows={applicants}
      rowKey={(row) => row.id}
      searchPlaceholder="Search name, ID, position, contact, email..."
      tableClassName="min-w-[920px]"
      searchMatch={(row, query) => {
        const haystack = [
          formatApplicantRef(row.id),
          fullName(row),
          row.position_applied,
          row.contact_number,
          row.active_cellphone,
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
        {
          header: "Applicant ID",
          className: "whitespace-nowrap",
          cell: (row) => (
            <span className="font-medium text-gray-900">{formatApplicantRef(row.id)}</span>
          ),
        },
        {
          header: "Applicant",
          className: "min-w-[200px] max-w-[260px]",
          cell: (row) => (
            <div className="space-y-0.5">
              <div className="font-medium leading-snug text-gray-900">{fullName(row) || "--"}</div>
              {row.active_cellphone?.trim() ? (
                <div className="truncate text-xs text-gray-500">{row.active_cellphone.trim()}</div>
              ) : null}
            </div>
          ),
        },
        {
          header: "Position",
          className: "min-w-[180px] max-w-[240px]",
          cell: (row) => {
            const type = resolveApplicantType(row.applicant_type, row.position_applied)
            return (
              <div className="space-y-0.5">
                <div className="leading-snug text-gray-900">{row.position_applied ?? "--"}</div>
                {type && <div className="text-xs text-gray-500">{type}</div>}
              </div>
            )
          },
        },
        {
          header: "Status",
          className: "whitespace-nowrap",
          cell: (row) => <ApplicantStatusSelect applicantId={row.id} currentStatus={row.status} />,
        },
        {
          header: "Date Applied",
          className: "whitespace-nowrap text-gray-600",
          cell: (row) => formatAppliedDate(row.date_applied, row.created_at),
        },
        {
          header: "Actions",
          className: "whitespace-nowrap",
          cell: (row) => (
            <div className="flex items-center gap-1">
              <Link
                href={`/applicants/${row.id}/files`}
                className={`${actionClass} hover:bg-purple-100 hover:text-purple-600`}
                title="Files"
              >
                <FolderOpen className="h-4 w-4" />
              </Link>
              <Link
                href={`/applicants/${row.id}`}
                className={`${actionClass} hover:bg-blue-100 hover:text-blue-600`}
                title="View"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/applicants/${row.id}/edit`}
                className={`${actionClass} hover:bg-yellow-100 hover:text-yellow-600`}
                title="Edit"
              >
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

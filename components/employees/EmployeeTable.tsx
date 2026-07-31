"use client"

import Link from "next/link"
import { Eye, FolderOpen, Pencil } from "lucide-react"
import { SearchTable } from "@/components/shared/SearchTable"
import { ArchiveButton } from "@/components/shared/ArchiveButton"
import CreateEmployeeLoginButton from "@/components/CreateEmployeeLoginButton"
import DisableEmployeeLoginButton from "@/components/DisableEmployeeLoginButton"
import EmployeeStatusSelect from "@/components/employees/EmployeeStatusSelect"
import { EMPLOYMENT_STATUS_OPTIONS } from "@/lib/status-options"
import type { Employee } from "@/types/entities"

type EmployeeRow = Pick<
  Employee,
  | "id"
  | "employee_number"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "position"
  | "department"
  | "employment_status"
  | "contact_number"
  | "email"
  | "date_hired"
  | "auth_user_id"
>

function fullName(employee: EmployeeRow) {
  return [employee.first_name, employee.middle_name, employee.last_name].filter(Boolean).join(" ")
}

export function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
  return (
    <SearchTable
      rows={employees}
      rowKey={(row) => row.id}
      searchPlaceholder="Search name, employee #, position, contact..."
      searchMatch={(row, query) => {
        const haystack = [row.employee_number, fullName(row), row.position, row.contact_number, row.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      }}
      filters={[
        {
          id: "status",
          label: "Status",
          options: EMPLOYMENT_STATUS_OPTIONS,
          match: (row, value) => row.employment_status?.trim() === value,
        },
      ]}
      columns={[
        { header: "Employee ID", cell: (row) => row.employee_number ?? "--" },
        { header: "Name", cell: (row) => fullName(row) },
        { header: "Position", cell: (row) => row.position ?? "--" },
        { header: "Department", cell: (row) => row.department ?? "--" },
        {
          header: "Status",
          cell: (row) => <EmployeeStatusSelect employeeId={row.id} currentStatus={row.employment_status} />,
        },
        { header: "Contact", cell: (row) => row.contact_number ?? "--" },
        {
          header: "Date Hired",
          cell: (row) => (row.date_hired ? new Date(row.date_hired).toLocaleDateString() : "--"),
        },
        {
          header: "Actions",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Link href={`/employees/${row.id}/files`} className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600" title="Files">
                <FolderOpen className="h-4 w-4" />
              </Link>
              <Link href={`/employees/${row.id}`} className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600" title="View">
                <Eye className="h-4 w-4" />
              </Link>
              <Link href={`/employees/${row.id}/edit`} className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600" title="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
              <ArchiveButton table="employees" id={row.id} name={fullName(row) || `Employee ${row.id}`} />
              {!row.auth_user_id && row.email && (
                <CreateEmployeeLoginButton employeeId={row.id} employeeName={fullName(row) || "Employee"} />
              )}
              {row.auth_user_id && (
                <DisableEmployeeLoginButton employeeId={row.id} employeeName={fullName(row) || "Employee"} />
              )}
            </div>
          ),
        },
      ]}
      emptyMessage="No employees found."
    />
  )
}

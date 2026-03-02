"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Pencil, FolderOpen } from "lucide-react"
import DeleteEmployeeForm from "./DeleteEmployeeForm"

export type Employee = {
  id: number
  employee_number: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position: string | null
  department: string | null
  employment_status: string | null
  contact_number: string | null
  email: string | null
  date_hired: string | null
}

type Props = {
  employees: Employee[]
}

export default function EmployeesListWithFilters({ employees }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = employees
    const q = search.trim().toLowerCase()

    if (q) {
      list = list.filter((emp) => {
        const empNum = (emp.employee_number ?? "").toLowerCase()
        const name = [emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(" ").toLowerCase()
        const position = (emp.position ?? "").toLowerCase()
        const contact = (emp.contact_number ?? "").toLowerCase()
        const email = (emp.email ?? "").toLowerCase()
        return empNum.includes(q) || name.includes(q) || position.includes(q) || contact.includes(q) || email.includes(q)
      })
    }

    if (statusFilter !== "All") list = list.filter((emp) => emp.employment_status?.trim() === statusFilter)

    return list
  }, [employees, search, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search name, employee #, position, contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Resigned">Resigned</option>
          <option value="Terminated">Terminated</option>
        </select>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium">Employee #</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Position</th>
              <th className="p-3 text-left font-medium">Department</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Contact</th>
              <th className="p-3 text-left font-medium">Date Hired</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-t border-gray-100">
                <td className="p-3">{emp.employee_number ?? "—"}</td>
                <td className="p-3">
                  {[emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(" ")}
                </td>
                <td className="p-3">{emp.position ?? "—"}</td>
                <td className="p-3">{emp.department ?? "—"}</td>
                <td className="p-3">
                  <span>
                    {emp.employment_status ?? "—"}
                  </span>
                </td>
                <td className="p-3">{emp.contact_number ?? "—"}</td>
                <td className="p-3">
                  {emp.date_hired ? new Date(emp.date_hired).toLocaleDateString() : "—"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/employees/${emp.id}/files`}
                      className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                      title="Files"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/employees/${emp.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/employees/${emp.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteEmployeeForm id={emp.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

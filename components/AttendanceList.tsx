"use client"

import { useMemo, useState } from "react"

export type AttendanceListRow = {
  id: number
  employeeName: string
  employeeNumber: string | null
  logType: string
  loggedAt: string
}

type Props = {
  rows: AttendanceListRow[]
}

export default function AttendanceList({ rows }: Props) {
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const filtered = useMemo(() => {
    let list = rows
    const query = search.trim().toLowerCase()

    if (query) {
      list = list.filter(
        (row) =>
          row.employeeName.toLowerCase().includes(query) ||
          (row.employeeNumber ?? "").toLowerCase().includes(query)
      )
    }

    if (dateFilter) {
      list = list.filter((row) => row.loggedAt.slice(0, 10) === dateFilter)
    }

    return list
  }, [rows, search, dateFilter])

  const formatDateTime = (value: string) => new Date(value).toLocaleString()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by Employee ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[240px] rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            setSearch("")
            setDateFilter("")
          }}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{row.employeeNumber ?? "--"}</td>
                <td className="p-3">{row.employeeName}</td>
                <td className="p-3 capitalize">{row.logType.replace("_", " ")}</td>
                <td className="p-3">{formatDateTime(row.loggedAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No attendance logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

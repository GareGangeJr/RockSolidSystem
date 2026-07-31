"use client"

import { useMemo, useState } from "react"
import {
  formatActivityAction,
  formatActivityModule,
  formatActivityRecord,
  normalizeActivityRecordId,
} from "@/lib/activity-log-format"

export type ActivityLogRow = {
  id: number
  userLabel: string
  userRole: string | null
  action: string
  module: string
  recordId: string | null
  details: Record<string, unknown>
  createdAt: string
}

type Props = {
  rows: ActivityLogRow[]
}

export default function ActivityLogList({ rows }: Props) {
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [moduleFilter, setModuleFilter] = useState("")

  const modules = useMemo(() => {
    return [...new Set(rows.map((row) => row.module))].sort()
  }, [rows])

  const filtered = useMemo(() => {
    let list = rows
    const query = search.trim().toLowerCase()

    if (query) {
      list = list.filter((row) => {
        const haystack = [
          row.userLabel,
          row.action,
          row.module,
          row.recordId,
          formatActivityAction(row.action),
          formatActivityModule(row.module),
          formatActivityRecord(row.module, row.recordId, row.details),
          JSON.stringify(row.details),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(query)
      })
    }

    if (moduleFilter) {
      list = list.filter((row) => row.module === moduleFilter)
    }

    if (dateFilter) {
      list = list.filter((row) => row.createdAt.slice(0, 10) === dateFilter)
    }

    return list
  }, [rows, search, dateFilter, moduleFilter])

  const formatDateTime = (value: string) => new Date(value).toLocaleString()

  function detailSummary(row: ActivityLogRow) {
    const recordRef = formatActivityRecord(row.module, row.recordId, row.details)
    const status = typeof row.details.status === "string" ? row.details.status : null

    if (recordRef !== "--" && status) {
      return `${recordRef}, ${status}`
    }

    if (recordRef !== "--" && typeof row.details.applicantId === "number") {
      const related = normalizeActivityRecordId("applicants", row.details.applicantId)
      return related ? `${recordRef}, ${related}` : recordRef
    }
    if (recordRef !== "--" && typeof row.details.jobOrderId === "number") {
      const related = normalizeActivityRecordId("job_orders", row.details.jobOrderId)
      return related ? `${recordRef}, ${related}` : recordRef
    }

    return recordRef !== "--" ? recordRef : null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search user, action, record..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[240px] rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All modules</option>
          {modules.map((module) => (
            <option key={module} value={module}>
              {formatActivityModule(module)}
            </option>
          ))}
        </select>
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
            setModuleFilter("")
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
              <th className="p-3 text-left">When</th>
              <th className="p-3 text-left">Who</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Record</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const summary = detailSummary(row)
              return (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="p-3 whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                  <td className="p-3">
                    <div className="font-medium">{row.userLabel}</div>
                    {row.userRole && (
                      <div className="text-xs capitalize text-gray-500">{row.userRole}</div>
                    )}
                  </td>
                  <td className="p-3">{formatActivityAction(row.action)}</td>
                  <td className="p-3">{formatActivityModule(row.module)}</td>
                  <td className="p-3">{formatActivityRecord(row.module, row.recordId, row.details)}</td>
                  <td className="p-3 text-gray-600">{summary ?? "--"}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

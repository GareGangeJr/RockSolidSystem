"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Pencil, UserPlus } from "lucide-react"
import DeleteJobOrderForm from "./DeleteJobOrderForm"
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/status-options"

export type JobOrder = {
  id: number
  created_at: string
  job_title: string | null
  company: string | null
  slots: number | null
  status: string | null
}

type Props = {
  jobOrders: JobOrder[]
}

export default function JobOrdersListWithFilters({ jobOrders }: Props) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = jobOrders
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((jo) => {
        const idStr = `jo-${jo.id}`.toLowerCase()
        const title = (jo.job_title ?? "").toLowerCase()
        const company = (jo.company ?? "").toLowerCase()
        return idStr.includes(q) || title.includes(q) || company.includes(q)
      })
    }
    if (typeFilter !== "All") {
      list = list.filter((jo) => (jo as Record<string, unknown>).type === typeFilter)
    }
    if (statusFilter !== "All") {
      list = list.filter((jo) => (jo.status ?? "").trim() === statusFilter)
    }
    return list
  }, [jobOrders, search, typeFilter, statusFilter])

  function clearFilters() {
    setSearch("")
    setTypeFilter("All")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search job order ID, title, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Type: All</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
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
              <th className="p-3 text-left font-medium">ID</th>
              <th className="p-3 text-left font-medium">Job Title</th>
              <th className="p-3 text-left font-medium">Company</th>
              <th className="p-3 text-left font-medium">Slots</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="p-3">JO-{o.id}</td>
                <td className="p-3">{o.job_title ?? "—"}</td>
                <td className="p-3">{o.company ?? "—"}</td>
                <td className="p-3">{o.slots ?? "—"}</td>
                <td className="p-3">{o.status ?? "—"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/job-orders/${o.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${o.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${o.id}/match`}
                      className="rounded p-1 text-gray-600 hover:bg-green-100 hover:text-green-600"
                      title="Match Applicants"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Link>
                    <DeleteJobOrderForm id={o.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No job orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

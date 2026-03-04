"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Pencil, UserPlus } from "lucide-react"
import DeleteJobOrderForm from "./DeleteJobOrderForm"
import { JOB_ORDER_STATUS_OPTIONS } from "@/lib/status-options"

export type JobOrder = {
  id: number
  created_at: string
  company: string | null
  country: string | null
  job_title: string | null
  no_workers: number | null
  status: string | null
}

type Props = {
  jobOrders: JobOrder[]
}

export default function JobOrdersListWithFilters({ jobOrders }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = jobOrders
    const searchQuery = search.trim().toLowerCase()
    if (searchQuery) {
      list = list.filter((jobOrder) => {
        const idStr = `jo-${jobOrder.id}`.toLowerCase()
        const company = (jobOrder.company ?? "").toLowerCase()
        const country = (jobOrder.country ?? "").toLowerCase()
        const jobTitle = (jobOrder.job_title ?? "").toLowerCase()
        return idStr.includes(searchQuery) || company.includes(searchQuery) || country.includes(searchQuery) || jobTitle.includes(searchQuery)
      })
    }
    if (statusFilter !== "All") {
      list = list.filter((jobOrder) => jobOrder.status?.trim() === statusFilter)
    }
    return list
  }, [jobOrders, search, statusFilter])

  function clearFilters() {
    setSearch("")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search company, country, job title, ID..."
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Workers</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((jobOrder) => (
              <tr key={jobOrder.id} className="border-t">
                <td className="p-3">JO-{jobOrder.id}</td>
                <td className="p-3">{jobOrder.company}</td>
                <td className="p-3">{jobOrder.country}</td>
                <td className="p-3">{jobOrder.job_title}</td>
                <td className="p-3">{jobOrder.no_workers}</td>
                <td className="p-3">{jobOrder.status}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/job-orders/${jobOrder.id}`}
                      className="p-1 rounded-md text-black hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${jobOrder.id}/match`}
                      className="p-1 rounded-md text-black hover:bg-green-100 hover:text-green-600"
                      title="Match Applicants"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${jobOrder.id}/edit`}
                      className="p-1 rounded-md text-black hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteJobOrderForm id={jobOrder.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
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

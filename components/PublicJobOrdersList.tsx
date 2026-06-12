"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

export type PublicJobOrder = {
  id: number
  company: string | null
  country: string | null
  job_title: string | null
  no_workers: number | null
}

type Props = {
  jobOrders: PublicJobOrder[]
}

export default function PublicJobOrdersList({ jobOrders }: Props) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const searchQuery = search.trim().toLowerCase()
    if (!searchQuery) return jobOrders

    return jobOrders.filter((jobOrder) => {
      const idStr = `jo-${jobOrder.id}`.toLowerCase()
      const company = (jobOrder.company ?? "").toLowerCase()
      const country = (jobOrder.country ?? "").toLowerCase()
      const jobTitle = (jobOrder.job_title ?? "").toLowerCase()
      return (
        idStr.includes(searchQuery) ||
        company.includes(searchQuery) ||
        country.includes(searchQuery) ||
        jobTitle.includes(searchQuery)
      )
    })
  }, [jobOrders, search])

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search company, country, job title, ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Job Order ID</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Workers Needed</th>
              <th className="p-3 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((jobOrder) => (
              <tr key={jobOrder.id} className="border-t">
                <td className="p-3">JO-{jobOrder.id}</td>
                <td className="p-3">{jobOrder.company ?? "--"}</td>
                <td className="p-3">{jobOrder.country ?? "--"}</td>
                <td className="p-3">{jobOrder.job_title ?? "--"}</td>
                <td className="p-3">{jobOrder.no_workers ?? "--"}</td>
                <td className="p-3">
                  <Link
                    href={`/apply/job-orders/${jobOrder.id}`}
                    className="inline-flex rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No open job orders available right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

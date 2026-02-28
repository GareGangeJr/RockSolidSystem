"use client"

// Step 1: Import tools we need
import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Pencil } from "lucide-react"
import DeleteMonitoringForm from "./DeleteMonitoringForm"

// Step 2: Define what a Monitoring record looks like
export type MonitoringRecord = {
  id: number
  applicant_id: number
  job_order_id: number
  deployment_status: string | null
  deployment_date: string | null
  concern_status: string | null
  expected_return_date: string | null
  applicant?: {
    id: number
    first_name: string | null
    last_name: string | null
  }
  jobOrder?: {
    id: number
    job_title: string | null
    country: string | null
  }
}

type Props = {
  records: MonitoringRecord[]
}

// Step 3: Main component that shows Monitoring records with filters
export default function MonitoringListWithFilters({ records }: Props) {
  // These store what the user types/selects
  const [search, setSearch] = useState("")
  const [deploymentFilter, setDeploymentFilter] = useState("All")
  const [concernFilter, setConcernFilter] = useState("All")

  // Step 4: Filter the list based on search and filters
  const filtered = useMemo(() => {
    let list = records
    const q = search.trim().toLowerCase()

    // If user typed something, search for it
    if (q) {
      list = list.filter((r) => {
        const applicantName = `${r.applicant?.first_name || ""} ${r.applicant?.last_name || ""}`.toLowerCase()
        const jobOrderId = `jo-${r.jobOrder?.id || ""}`.toLowerCase()
        const country = (r.jobOrder?.country ?? "").toLowerCase()
        const jobTitle = (r.jobOrder?.job_title ?? "").toLowerCase()
        // Check if search text is in any of these fields
        return applicantName.includes(q) || jobOrderId.includes(q) || country.includes(q) || jobTitle.includes(q)
      })
    }

    // If user picked a deployment status, filter by it
    if (deploymentFilter !== "All") {
      list = list.filter((r) => r.deployment_status?.trim() === deploymentFilter)
    }

    // If user picked a concern status, filter by it
    if (concernFilter !== "All") {
      list = list.filter((r) => {
        if (concernFilter === "None") return !r.concern_status
        return r.concern_status?.trim() === concernFilter
      })
    }

    return list
  }, [records, search, deploymentFilter, concernFilter])

  // Step 5: Clear all filters button
  const clearFilters = () => {
    setSearch("")
    setDeploymentFilter("All")
    setConcernFilter("All")
  }

  // Helper function to format dates
  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString() : "—"

  return (
    <div className="space-y-4">
      {/* Filter controls: search box + dropdowns + clear button */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search applicant name, job order, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={deploymentFilter}
          onChange={(e) => setDeploymentFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Deployment: All</option>
          <option value="Deployed">Deployed</option>
          <option value="Deployed(With Concerns)">Deployed(With Concerns)</option>
        </select>
        <select
          value={concernFilter}
          onChange={(e) => setConcernFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Concern: All</option>
          <option value="None">None</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
        </select>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {/* Table showing filtered results */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Job Order</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Deployment Status</th>
                <th className="p-3 text-left">Deployed Date</th>
                <th className="p-3 text-left">Concern Status</th>
                <th className="p-3 text-left">Return Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div>{r.applicant?.id}</div>
                    <div className="text-xs text-gray-500">{r.applicant?.first_name} {r.applicant?.last_name}</div>
                  </td>
                  <td className="p-3">
                    <div>JO-{r.jobOrder?.id}</div>
                    <div className="text-xs text-gray-500">{r.jobOrder?.job_title || "—"}</div>
                  </td>
                  <td className="p-3">{r.jobOrder?.country || "—"}</td>
                  <td className="p-3">
                    <span className={r.deployment_status === "Deployed(With Concerns)" ? "text-yellow-600" : "text-green-600"}>
                      {r.deployment_status}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(r.deployment_date)}</td>
                  <td className="p-3">
                    <span className={
                      r.concern_status === "Pending" ? "text-yellow-600" :
                      r.concern_status === "Escalated" ? "text-red-600" :
                      r.concern_status === "Resolved" ? "text-green-600" : ""
                    }>
                      {r.concern_status || "—"}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(r.expected_return_date)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/monitoring/${r.id}`}
                        className="p-1 rounded-md text-black hover:bg-blue-100 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/monitoring/${r.id}/edit`}
                        className="p-1 rounded-md text-black hover:bg-yellow-100 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteMonitoringForm id={r.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No monitoring records found.</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Pencil } from "lucide-react"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

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

export default function MonitoringListWithFilters({ records }: Props) {
  const [search, setSearch] = useState("")
  const [deploymentFilter, setDeploymentFilter] = useState("All")
  const [concernFilter, setConcernFilter] = useState("All")


  const filtered = useMemo(() => {
    let list = records
    const searchQuery = search.trim().toLowerCase()

    if (searchQuery) {
      list = list.filter((record) => {
        const applicantName = `${record.applicant?.first_name || ""} ${record.applicant?.last_name || ""}`.toLowerCase()
        const applicantId = formatApplicantRef(record.applicant?.id).toLowerCase()
        const jobOrderId = `jo-${record.jobOrder?.id || ""}`.toLowerCase()
        const country = (record.jobOrder?.country ?? "").toLowerCase()
        const jobTitle = (record.jobOrder?.job_title ?? "").toLowerCase()
        return applicantName.includes(searchQuery) || applicantId.includes(searchQuery) || jobOrderId.includes(searchQuery) || country.includes(searchQuery) || jobTitle.includes(searchQuery)
      })
    }


    if (deploymentFilter !== "All") {
      list = list.filter((record) => record.deployment_status?.trim() === deploymentFilter)
    }

   
    if (concernFilter !== "All") {
      list = list.filter((record) => {
        if (concernFilter === "None") return !record.concern_status
        return record.concern_status?.trim() === concernFilter
      })
    }

    return list
  }, [records, search, deploymentFilter, concernFilter])


  const clearFilters = () => {
    setSearch("")
    setDeploymentFilter("All")
    setConcernFilter("All")
  }


  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString() : "--"

  return (
    <div className="space-y-4">
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

      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Applicant ID & Name</th>
                <th className="p-3 text-left">Job Order ID & Title</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Deployment Status</th>
                <th className="p-3 text-left">Deployed Date</th>
                <th className="p-3 text-left">Concern Status</th>
                <th className="p-3 text-left"> ETA Return Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="p-3">
                    <div>{formatApplicantRef(record.applicant?.id)}</div>
                    <div className="text-xs text-gray-500">{record.applicant?.first_name} {record.applicant?.last_name}</div>
                  </td>
                  <td className="p-3">
                    <div>JO-{record.jobOrder?.id}</div>
                    <div className="text-xs text-gray-500">{record.jobOrder?.job_title || "--"}</div>
                  </td>
                  <td className="p-3">{record.jobOrder?.country || "--"}</td>
                  <td className="p-3">
                    <span>{record.deployment_status}</span>
                  </td>
                  <td className="p-3">{formatDate(record.deployment_date)}</td>
                  <td className="p-3">
                    <span>{record.concern_status || "--"}</span>
                  </td>
                  <td className="p-3">{formatDate(record.expected_return_date)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/monitoring/${record.id}`}
                        className="p-1 rounded-md text-black hover:bg-blue-100 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/monitoring/${record.id}/edit`}
                        className="p-1 rounded-md text-black hover:bg-yellow-100 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
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

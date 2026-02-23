"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Pencil, Eye, FolderOpen } from "lucide-react"
import DeleteApplicantButton from "./DeleteApplicantButton"
import StatusDropdown from "./StatusDropdown"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS } from "@/lib/status-options"

export type Applicant = {
  id: number
  created_at: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position_applied: string | null
  applicant_type: string | null
  status: string | null
  contact_number: string | null
  email: string | null
  date_applied: string | null
}

type Props = {
  applicants: Applicant[]
}

function formatDate(dateApplied: string | null, createdAt: string | null): string {
  const val = dateApplied ?? createdAt
  if (!val) return "—"
  const s = String(val)
  if (s.length >= 10) return s.slice(0, 10)
  return s
}

export default function ApplicantsListWithFilters({ applicants }: Props) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = applicants
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((app) => {
        const idStr = `app-${new Date().getFullYear()}-${app.id}`.toLowerCase()
        const name = [app.first_name, app.middle_name, app.last_name].filter(Boolean).join(" ").toLowerCase()
        const pos = (app.position_applied ?? "").toLowerCase()
        const contact = (app.contact_number ?? "").toLowerCase()
        const email = (app.email ?? "").toLowerCase()
        return idStr.includes(q) || name.includes(q) || pos.includes(q) || contact.includes(q) || email.includes(q)
      })
    }
    if (typeFilter !== "All") {
      list = list.filter((app) => (app.applicant_type ?? "").trim() === typeFilter)
    }
    if (statusFilter !== "All") {
      list = list.filter((app) => (app.status ?? "").trim() === statusFilter)
    }
    return list
  }, [applicants, search, typeFilter, statusFilter])

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
          placeholder="Search name, applicant ID, position, contact, email..."
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
          {APPLICANT_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
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
              <th className="p-3 text-left font-medium">Applicant ID</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Position</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Contact</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Date Applied</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-t border-gray-100">
                <td className="p-3">
                  {`APP-${new Date().getFullYear()}-${app.id}`}
                </td>
                <td className="p-3">
                  {[app.first_name, app.middle_name, app.last_name].filter(Boolean).join(" ")}
                </td>
                <td className="p-3">{app.position_applied ?? "—"}</td>
                <td className="p-3">{app.applicant_type ?? "—"}</td>
                <td className="p-3">
                  <StatusDropdown applicantId={app.id} currentStatus={app.status} />
                </td>
                <td className="p-3">{app.contact_number ?? "—"}</td>
                <td className="p-3">{app.email ?? "—"}</td>
                <td className="p-3">{formatDate(app.date_applied, app.created_at)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/applicants/${app.id}/files`}
                      className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                      title="Files"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/applicants/${app.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/applicants/${app.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteApplicantButton id={app.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

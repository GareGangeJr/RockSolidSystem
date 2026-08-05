"use client"

import { Download } from "lucide-react"
import { useMemo, useState } from "react"
import type {
  CountryCount,
  DeploymentReportRow,
  PlacementStatusCount,
} from "@/lib/reports/types"
import { filterDeploymentsByDateRange } from "@/lib/reports/date-range"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

type Props = {
  summary: {
    totalPlacements: number
    totalDeployed: number
    withConcerns: number
    deployedThisMonth: number
    matchedApplicants: number
  }
  statusCounts: PlacementStatusCount[]
  countryCounts: CountryCount[]
  deployments: DeploymentReportRow[]
}

const dateFieldClass =
  "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export default function ReportsView({
  summary,
  statusCounts,
  countryCounts,
  deployments,
}: Props) {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const filteredDeployments = useMemo(
    () => filterDeploymentsByDateRange(deployments, fromDate || null, toDate || null),
    [deployments, fromDate, toDate]
  )

  const exportHref = useMemo(() => {
    const params = new URLSearchParams()
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)
    const query = params.toString()
    return query ? `/api/reports/export?${query}` : "/api/reports/export"
  }, [fromDate, toDate])

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString() : "--"

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="report-from-date" className="mb-1 block text-xs font-medium text-gray-600">
            From
          </label>
          <input
            id="report-from-date"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            className={dateFieldClass}
          />
        </div>
        <div>
          <label htmlFor="report-to-date" className="mb-1 block text-xs font-medium text-gray-600">
            To
          </label>
          <input
            id="report-to-date"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className={dateFieldClass}
          />
        </div>
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("")
              setToDate("")
            }}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Download Reports
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total Deployments" value={summary.totalPlacements} />
        <SummaryCard label="Currently Deployed" value={summary.totalDeployed} />
        <SummaryCard label="With Concerns" value={summary.withConcerns} />
        <SummaryCard label="Deployed This Month" value={summary.deployedThisMonth} />
        <SummaryCard label="Matched to Jobs" value={summary.matchedApplicants} />
      </div>

      <p className="text-sm text-gray-500">
        {fromDate || toDate
          ? `Showing deployments${fromDate ? ` from ${formatDate(fromDate)}` : ""}${toDate ? ` to ${formatDate(toDate)}` : ""}.`
          : "Showing all deployments. Pick a from and to date to filter the report."}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Placements by Country</h2>
          {countryCounts.length === 0 ? (
            <p className="text-sm text-gray-500">No deployment data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2">Country</th>
                  <th className="pb-2 text-right">Deployments</th>
                </tr>
              </thead>
              <tbody>
                {countryCounts.map((row) => (
                  <tr key={row.country} className="border-b border-gray-100">
                    <td className="py-2">{row.country}</td>
                    <td className="py-2 text-right font-medium">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Applicant Status Summary</h2>
          {statusCounts.length === 0 ? (
            <p className="text-sm text-gray-500">No applicants yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {statusCounts.map((row) => (
                  <tr key={row.status} className="border-b border-gray-100">
                    <td className="py-2">{row.status}</td>
                    <td className="py-2 text-right font-medium">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Deployment Report</h2>
        </div>

        {filteredDeployments.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No deployment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Applicant</th>
                  <th className="p-3 text-left">Position</th>
                  <th className="p-3 text-left">Job Order</th>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 text-left">Employer</th>
                  <th className="p-3 text-left">Deployed</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Concern</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeployments.map((row) => (
                  <tr key={row.monitoringId} className="border-t border-gray-100">
                    <td className="p-3">
                      <div className="font-medium">{row.applicantName}</div>
                      <div className="text-xs text-gray-500">
                        {formatApplicantRef(row.applicantId)}
                      </div>
                    </td>
                    <td className="p-3">{row.positionApplied}</td>
                    <td className="p-3">
                      <div>JO-{row.jobOrderId}</div>
                      <div className="text-xs text-gray-500">{row.jobTitle}</div>
                    </td>
                    <td className="p-3">{row.company}</td>
                    <td className="p-3">{row.destinationCountry}</td>
                    <td className="p-3">{row.employerName || "--"}</td>
                    <td className="p-3">{formatDate(row.deploymentDate)}</td>
                    <td className="p-3">{row.deploymentStatus}</td>
                    <td className="p-3">{row.concernStatus || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-sm leading-snug text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
    </div>
  )
}

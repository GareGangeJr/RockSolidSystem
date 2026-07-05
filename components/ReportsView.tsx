"use client"

import { Download } from "lucide-react"
import { useMemo, useState } from "react"
import type {
  CountryCount,
  DeploymentReportRow,
  PlacementStatusCount,
} from "@/lib/reports/types"
import {
  defaultDateInput,
  filterDeploymentsByPeriod,
  type ReportPeriod,
} from "@/lib/reports/date-range"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

export type { DeploymentReportRow, CountryCount, PlacementStatusCount }

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

export default function ReportsView({
  summary,
  statusCounts,
  countryCounts,
  deployments,
}: Props) {
  const [period, setPeriod] = useState<ReportPeriod>("all")
  const [dateInput, setDateInput] = useState(() => defaultDateInput("day"))

  const filteredDeployments = useMemo(
    () => filterDeploymentsByPeriod(deployments, period, dateInput),
    [deployments, period, dateInput]
  )

  const exportHref =
    period === "all"
      ? "/api/reports/export"
      : `/api/reports/export?period=${period}&date=${encodeURIComponent(dateInput)}`

  function handlePeriodChange(next: ReportPeriod) {
    setPeriod(next)
    if (next !== "all") {
      setDateInput(defaultDateInput(next))
    }
  }

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString() : "--"

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Total Deployments" value={summary.totalPlacements} />
          <SummaryCard label="Currently Deployed" value={summary.totalDeployed} />
          <SummaryCard label="With Concerns" value={summary.withConcerns} />
          <SummaryCard label="Deployed This Month" value={summary.deployedThisMonth} />
          <SummaryCard label="Matched to Jobs" value={summary.matchedApplicants} />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Report period</label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as ReportPeriod)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All time</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          {period !== "all" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                {period === "year" ? "Year" : period === "month" ? "Month" : period === "week" ? "Any day in week" : "Date"}
              </label>
              {period === "year" ? (
                <input
                  type="number"
                  min={2020}
                  max={2035}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              ) : period === "month" ? (
                <input
                  type="month"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              ) : (
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              )}
            </div>
          )}
          <a
            href={exportHref}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Download Reports
          </a>
        </div>
      </div>

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
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

import { fetchReportData } from "@/lib/reports/fetch-report-data"
import ReportsView from "@/components/ReportsView"

export default async function ReportsPage() {
  const data = await fetchReportData()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>

      <ReportsView
        summary={data.summary}
        statusCounts={data.statusCounts}
        countryCounts={data.countryCounts}
        deployments={data.deployments}
      />
    </div>
  )
}

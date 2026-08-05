import { createSupabaseServer } from "@/lib/supabase/server"
import DashboardView, {
  type CountItem,
  type MonthlyItem,
  type RecentApplicant,
  type RecentDeployment,
  type StatCard,
} from "@/components/DashboardView"
import { APPLICANT_TYPE_OPTIONS, STATUS_OPTIONS } from "@/lib/status-options"

function countByField(rows: { [key: string]: unknown }[], field: string, defaults: readonly string[] = []) {
  const map = new Map<string, number>()
  for (const label of defaults) map.set(label, 0)
  for (const row of rows) {
    const key = String(row[field] ?? "Unknown").trim() || "Unknown"
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
}

function getLastSixMonths(): MonthlyItem[] {
  const items: MonthlyItem[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    items.push({
      monthKey: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleString("default", { month: "short" }),
      count: 0,
    })
  }
  return items
}

function formatDate(value: string | null) {
  if (!value) return "--"
  return new Date(value).toLocaleDateString()
}

export default async function Home() {
  const supabase = await createSupabaseServer()

  const [
    { data: applicants },
    { data: jobOrders },
    { data: monitoringRecords },
    { count: openJobOrders },
  ] = await Promise.all([
    supabase.from("applicants").select("id, first_name, last_name, position_applied, status, applicant_type, created_at").is("archived_at", null).order("created_at", { ascending: false }),
    supabase.from("job_orders").select("id, status, country").is("archived_at", null),
    supabase.from("monitoring").select("id, applicant_id, job_order_id, deployment_status, deployment_date").is("archived_at", null).order("deployment_date", { ascending: false }).limit(10),
    supabase.from("job_orders").select("*", { count: "exact", head: true }).eq("status", "Open").is("archived_at", null),
  ])

  const applicantRows = applicants ?? []
  const jobOrderRows = jobOrders ?? []

  const deployed = applicantRows.filter((a) =>
    ["Deployed", "Deployed(With Concerns)"].includes(String(a.status ?? ""))
  ).length
  const docsOnProcess = applicantRows.filter((a) => a.status === "Docs on Process").length
  const deported = applicantRows.filter((a) => a.status === "Deported").length
  const finishContracts = applicantRows.filter((a) => a.status === "Finish Contract").length

  const stats: StatCard[] = [
    { title: "Total Applicants", value: applicantRows.length, icon: "applicants", color: "bg-blue-600" },
    { title: "Deployed", value: deployed, icon: "deployed", color: "bg-green-600" },
    { title: "Open Job Orders", value: openJobOrders ?? 0, icon: "jobOrders", color: "bg-orange-600" },
    { title: "Finish Contracts", value: finishContracts, icon: "employees", color: "bg-purple-600" },
    { title: "Docs on Process", value: docsOnProcess, icon: "docs", color: "bg-cyan-600" },
    { title: "Deported", value: deported, icon: "deported", color: "bg-amber-600" },
  ]

  const statusCounts = countByField(applicantRows, "status", STATUS_OPTIONS)
  const typeCounts = countByField(applicantRows, "applicant_type", APPLICANT_TYPE_OPTIONS)

  const jobOrderMap = new Map(jobOrderRows.map((j) => [j.id, j]))
  const applicantMap = new Map(applicantRows.map((a) => [a.id, a]))

  const countryMap = new Map<string, number>()
  for (const record of monitoringRecords ?? []) {
    const country = jobOrderMap.get(record.job_order_id)?.country?.trim() || "Unknown"
    countryMap.set(country, (countryMap.get(country) ?? 0) + 1)
  }
  const countryCounts: CountItem[] = [...countryMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const monthlyApplicants = getLastSixMonths()
  for (const applicant of applicantRows) {
    const created = new Date(applicant.created_at)
    const bucketKey = `${created.getFullYear()}-${created.getMonth()}`
    const bucket = monthlyApplicants.find((item) => item.monthKey === bucketKey)
    if (bucket) bucket.count += 1
  }

  const recentApplicants: RecentApplicant[] = applicantRows.slice(0, 5).map((a) => ({
    id: a.id,
    name: [a.first_name, a.last_name].filter(Boolean).join(" ") || "--",
    position: a.position_applied || "--",
    status: a.status || "--",
    date: formatDate(a.created_at),
  }))

  const recentDeployments: RecentDeployment[] = (monitoringRecords ?? []).slice(0, 5).map((m) => {
    const applicant = applicantMap.get(m.applicant_id)
    const jobOrder = jobOrderMap.get(m.job_order_id)
    return {
      id: m.id,
      applicantId: m.applicant_id,
      applicantName: [applicant?.first_name, applicant?.last_name].filter(Boolean).join(" ") || "--",
      country: jobOrder?.country || "--",
      status: m.deployment_status || "--",
      date: formatDate(m.deployment_date),
    }
  })

  return (
    <div>
      <DashboardView
        stats={stats}
        statusCounts={statusCounts}
        typeCounts={typeCounts}
        countryCounts={countryCounts}
        monthlyApplicants={monthlyApplicants}
        recentApplicants={recentApplicants}
        recentDeployments={recentDeployments}
      />
    </div>
  )
}

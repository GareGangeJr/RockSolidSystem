import { NextResponse } from "next/server"
import { fetchReportData, filterMonitoring, filterMonitoringByDateRange } from "@/lib/reports/fetch-report-data"
import { formatReportRangeLabel, parseDateParam } from "@/lib/reports/date-range"
import { generateReportsExcel } from "@/lib/reports/generate-excel"
import { logActivity } from "@/lib/activity-log"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole } from "@/lib/user-role"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function reportRangeLabel(fromDate: string | null, toDate: string | null) {
  if (!fromDate && !toDate) return "All time"
  if (fromDate && toDate) return `${fromDate} to ${toDate}`
  if (fromDate) return `From ${fromDate}`
  return `To ${toDate}`
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = await getAccessRole(supabase, user.id)
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const country = searchParams.get("country")
  const status = searchParams.get("status")
  const fromDate = parseDateParam(searchParams.get("from"))
  const toDate = parseDateParam(searchParams.get("to"))

  try {
    const data = await fetchReportData()
    let monitoring = filterMonitoring(data.monitoring, country, status)
    monitoring = filterMonitoringByDateRange(monitoring, fromDate, toDate)

    const buffer = await generateReportsExcel({
      generatedAt: data.generatedAt,
      summary: data.summary,
      countryCounts: data.countryCounts,
      statusCounts: data.statusCounts,
      monitoring,
      jobOrders: data.jobOrders,
      applicants: data.applicants,
    })

    const dateStamp = new Date(data.generatedAt).toISOString().slice(0, 10)
    const periodLabel = formatReportRangeLabel(fromDate, toDate)
    const filename = `RockSolid-Reports_${periodLabel}_${dateStamp}.xlsx`

    await logActivity({
      action: "download",
      module: "reports",
      recordId: "Reports",
      details: { status: reportRangeLabel(fromDate, toDate) },
    })

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Report export failed:", error)
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 })
  }
}

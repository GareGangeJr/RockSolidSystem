import { NextResponse } from "next/server"
import { fetchReportData, filterDeployments } from "@/lib/reports/fetch-report-data"
import { filterDeploymentsByPeriod, parseReportPeriod } from "@/lib/reports/date-range"
import { generateReportsExcel } from "@/lib/reports/generate-excel"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole } from "@/lib/user-role"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

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
  const period = parseReportPeriod(searchParams.get("period"))
  const date = searchParams.get("date") ?? ""

  try {
    const data = await fetchReportData()
    let deployments = filterDeployments(data.deployments, country, status)
    deployments = filterDeploymentsByPeriod(deployments, period, date)

    const buffer = await generateReportsExcel({
      generatedAt: data.generatedAt,
      summary: data.summary,
      countryCounts: data.countryCounts,
      statusCounts: data.statusCounts,
      deployments,
      jobOrders: data.jobOrders,
      applicants: data.applicants,
      placements: data.placements,
    })

    const dateStamp = new Date(data.generatedAt).toISOString().slice(0, 10)
    const periodLabel = period === "all" ? "All" : `${period}-${date}`
    const filename = `RockSolid-Reports_${periodLabel}_${dateStamp}.xlsx`

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

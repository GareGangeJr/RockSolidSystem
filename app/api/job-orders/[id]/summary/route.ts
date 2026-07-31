import { NextResponse } from "next/server"
import { formatApplicantRef } from "@/lib/format-applicant-ref"
import { generateMatchedSummaryPdf } from "@/lib/generate-matched-summary-pdf"
import { createSupabaseServer } from "@/lib/supabase/server"
import { getAccessRole } from "@/lib/user-role"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function safeName(value: string) {
  return value
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50)
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = await getAccessRole(supabase, user.id)
  if (!role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const jobOrderId = Number((await params).id)
  if (Number.isNaN(jobOrderId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

  const { data: job } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .eq("id", jobOrderId)
    .maybeSingle()

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const { data: placements } = await supabase
    .from("placements")
    .select("applicant_id")
    .eq("job_order_id", jobOrderId)

  const matchedIds = (placements ?? []).map((p) => p.applicant_id)
  if (!matchedIds.length) {
    return NextResponse.json({ error: "No matched applicants" }, { status: 400 })
  }

  const { data: applicants } = await supabase
    .from("applicants")
    .select(
      "id, first_name, middle_name, last_name, position_applied, country_applying_for, gender, years_of_exp, status, contact_number"
    )
    .in("id", matchedIds)

  const summaryRows = (applicants ?? []).map((applicant) => ({
    id: applicant.id,
    ref: formatApplicantRef(applicant.id),
    name: [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(" "),
    position: applicant.position_applied ?? null,
    country: applicant.country_applying_for ?? null,
    yearsExp: applicant.years_of_exp ?? null,
    gender: applicant.gender ?? null,
    status: applicant.status ?? null,
    contact: applicant.contact_number ?? null,
  }))

  const bytes = await generateMatchedSummaryPdf({
    jobOrderId,
    jobTitle: job.job_title ?? null,
    company: job.company ?? null,
    country: job.country ?? null,
    applicants: summaryRows,
  })

  const jobLabel = safeName(job.job_title ?? "Job Order")
  const filename = `JO ${jobOrderId} ${jobLabel} Matched Summary.pdf`

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

import { NextResponse } from "next/server"
import AdmZip from "adm-zip"
import { createSupabaseServer } from "@/lib/supabase/server"
import { applicantToPdf } from "@/lib/generate-applicant-pdf"

const BUCKET = "applicant files"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const jobOrderId = Number((await params).id)
  if (Number.isNaN(jobOrderId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

  const supabase = await createSupabaseServer()

  const { data: job } = await supabase.from("job_orders").select("id, job_title").eq("id", jobOrderId).maybeSingle()
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const { data: placements } = await supabase.from("placements").select("applicant_id").eq("job_order_id", jobOrderId)
  const matchedIds = (placements ?? []).map((p) => p.applicant_id)
  if (!matchedIds.length) return NextResponse.json({ error: "No matched applicants" }, { status: 400 })

  const { data: applicants } = await supabase.from("applicants").select("*").in("id", matchedIds)
  if (!applicants?.length) return NextResponse.json({ error: "Failed to load applicants" }, { status: 500 })

  const { data: filesList } = await supabase.from("applicant_files").select("applicant_id, file_name, file_path").in("applicant_id", matchedIds)
  const filesByApplicant = new Map<number, { file_name: string; file_path: string }[]>()
  for (const f of filesList ?? []) {
    if (f.file_path && f.file_name) {
      const arr = filesByApplicant.get(f.applicant_id) ?? []
      arr.push({ file_name: f.file_name, file_path: f.file_path })
      filesByApplicant.set(f.applicant_id, arr)
    }
  }

  const zip = new AdmZip()
  const jobLabel = `JO-${jobOrderId}_${String(job.job_title ?? "Job").replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 40)}`

  for (const applicant of applicants) {
    const aid = applicant.id as number
    const name = `${applicant.first_name ?? ""} ${applicant.last_name ?? ""}`.trim() || `Applicant-${aid}`
    const folder = `Applicant_${aid}_${name.replace(/[<>:"/\\|?*]/g, "_").slice(0, 50)}`

    const pdf = await applicantToPdf(applicant as Record<string, unknown>)
    zip.addFile(`${folder}/details.pdf`, pdf)

    for (const f of filesByApplicant.get(aid) ?? []) {
      const { data: blob } = await supabase.storage.from(BUCKET).download(f.file_path)
      if (blob) zip.addFile(`${folder}/files/${f.file_name}`, Buffer.from(await blob.arrayBuffer()))
    }
  }

  const filename = `matched-applicants_${jobLabel}.zip`
  return new Response(new Uint8Array(zip.toBuffer()), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

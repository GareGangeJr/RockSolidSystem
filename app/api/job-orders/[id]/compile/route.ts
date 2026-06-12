import { NextResponse } from "next/server"
import AdmZip from "adm-zip"
import { createSupabaseServer } from "@/lib/supabase/server"
import { applicantToPdf } from "@/lib/generate-applicant-pdf"

const BUCKET = "applicant files"

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
  const jobOrderId = Number((await params).id)
  if (Number.isNaN(jobOrderId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

  const supabase = await createSupabaseServer()

  const { data: job } = await supabase
    .from("job_orders")
    .select("id, job_title, company")
    .eq("id", jobOrderId)
    .maybeSingle()
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const { data: placements } = await supabase.from("placements").select("applicant_id").eq("job_order_id", jobOrderId)
  const matchedIds = (placements ?? []).map((p) => p.applicant_id)
  if (!matchedIds.length) return NextResponse.json({ error: "No matched applicants" }, { status: 400 })

  const { data: applicants } = await supabase.from("applicants").select("*").in("id", matchedIds)
  if (!applicants?.length) return NextResponse.json({ error: "Failed to load applicants" }, { status: 500 })

  const { data: filesList } = await supabase
    .from("applicant_files")
    .select("applicant_id, file_name, file_path")
    .in("applicant_id", matchedIds)

  const filesByApplicant = new Map<number, { file_name: string; file_path: string }[]>()
  for (const file of filesList ?? []) {
    if (file.file_path && file.file_name) {
      const list = filesByApplicant.get(file.applicant_id) ?? []
      list.push({ file_name: file.file_name, file_path: file.file_path })
      filesByApplicant.set(file.applicant_id, list)
    }
  }

  const zip = new AdmZip()

  for (const [index, applicant] of applicants.entries()) {
    const aid = applicant.id as number
    const name = `${applicant.first_name ?? ""} ${applicant.last_name ?? ""}`.trim() || `Applicant ${aid}`
    const folder = `${String(index + 1).padStart(2, "0")} ${safeName(name)}`

    const pdf = await applicantToPdf(applicant as Record<string, unknown>)
    zip.addFile(`${folder}/Application Form.pdf`, pdf)

    for (const file of filesByApplicant.get(aid) ?? []) {
      const { data: blob } = await supabase.storage.from(BUCKET).download(file.file_path)
      if (blob) zip.addFile(`${folder}/Documents/${file.file_name}`, Buffer.from(await blob.arrayBuffer()))
    }
  }

  const jobLabel = safeName(String(job.job_title ?? "Job"))
  const filename = `JO ${jobOrderId} ${jobLabel} Matched Applicants.zip`

  return new Response(new Uint8Array(zip.toBuffer()), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

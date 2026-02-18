import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import MatchToJobForm from "@/components/MatchToJobForm"
import DeleteMatchForm from "@/components/DeleteMatchForm"

type JobOrder = {
  id: number
  job_title: string | null
  company: string | null
  years_exp_required: number | null
  skills_required: string | null
}

type Applicant = {
  id: number
  first_name: string | null
  last_name: string | null
  position_applied: string | null
  years_of_exp: number | null
  skills: string | null
}

function matches(a: Applicant, job: JobOrder): boolean {
  if ((a.years_of_exp ?? 0) < (job.years_exp_required ?? 0)) return false
  const jobSkills = (job.skills_required || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  const appSkills = (a.skills || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  if (jobSkills.length > 0 && !jobSkills.some((s) => appSkills.includes(s))) return false
  return true
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const n = Number(id)

  if (Number.isNaN(n)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const { data: job, error: jobError } = await supabase
    .from("job_orders")
    .select("id, job_title, company, years_exp_required, skills_required")
    .eq("id", n)
    .maybeSingle()

  if (jobError || !job) {
    return (
      <div className="p-6">
        <p className="text-red-500">Job order not found</p>
        <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const o = job as JobOrder

  const { data: placements } = await supabase
    .from("placements")
    .select("applicant_id")
    .eq("job_order_id", n)

  const matchedIds = (placements || []).map((p) => p.applicant_id)

  const { data: applicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name, position_applied, years_of_exp, skills")

  const all = (applicants || []) as Applicant[]
  const matched = all.filter((a) => matchedIds.includes(a.id))
  const suggested = all.filter((a) => matches(a, o) && !matchedIds.includes(a.id))
  const others = all.filter((a) => !matches(a, o) && !matchedIds.includes(a.id))

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Match Applicants — JO-{o.id}</h1>
        <Link href="/job-orders" className="text-blue-600 hover:underline">Back</Link>
      </div>

      <p className="text-gray-600 mb-6">{o.job_title} at {o.company}</p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Matched Applicants</h2>
        {matched.length ? (
          <ul className="bg-white border rounded-lg divide-y">
            {matched.map((a) => (
              <li key={a.id} className="p-3 flex items-center justify-between">
                <span>
                  <Link href={`/applicants/${a.id}`} className="text-blue-600 hover:underline">
                    {a.first_name} {a.last_name}
                  </Link>
                  <span className="text-gray-600 ml-2">— JO-{o.id} • {o.job_title}</span>
                </span>
                <DeleteMatchForm applicantId={a.id} jobOrderId={o.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No matched applicants yet</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Suggested Applicants</h2>
        {suggested.length ? (
          <ul className="bg-white border rounded-lg divide-y">
            {suggested.map((a) => (
              <li key={a.id} className="p-3 flex items-center justify-between">
                <span>
                  <Link href={`/applicants/${a.id}`} className="text-blue-600 hover:underline">
                    {a.first_name} {a.last_name}
                  </Link>
                  <span className="text-gray-600 ml-2">
                    — {a.position_applied} ({a.years_of_exp ?? 0} yrs) {a.skills && `• ${a.skills}`}
                  </span>
                </span>
                <MatchToJobForm applicantId={a.id} jobOrderId={o.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No suggested applicants</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">All Other Applicants</h2>
        {others.length ? (
          <ul className="bg-white border rounded-lg divide-y">
            {others.map((a) => (
              <li key={a.id} className="p-3 flex items-center justify-between">
                <span>
                  <Link href={`/applicants/${a.id}`} className="text-blue-600 hover:underline">
                    {a.first_name} {a.last_name}
                  </Link>
                  <span className="text-gray-600 ml-2">
                    — {a.position_applied} ({a.years_of_exp ?? 0} yrs) {a.skills && `• ${a.skills}`}
                  </span>
                </span>
                <MatchToJobForm applicantId={a.id} jobOrderId={o.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No other applicants</p>
        )}
      </div>
    </div>
  )
}

import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import MatchToJobForm from "@/components/MatchToJobForm"
import DeleteMatchForm from "@/components/DeleteMatchForm"
import CompileDownloadButton from "@/components/CompileDownloadButton"
import { BackButton } from "@/components/BackButton"
import { MatchScoreBadges } from "@/components/job-orders/MatchScoreBadges"
import {
  type ApplicantForMatch,
  type JobOrderForMatch,
  isSuggestedMatch,
  scoreApplicantMatch,
  sortByMatchScore,
} from "@/lib/job-order-match"
import { isEligibleForJobMatching } from "@/lib/status-options"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

type ApplicantRow = ApplicantForMatch & { status: string | null }

type ScoredApplicant = ApplicantRow & { match: ReturnType<typeof scoreApplicantMatch> }

function buildScoredList(applicants: ApplicantRow[], job: JobOrderForMatch): ScoredApplicant[] {
  return sortByMatchScore(
    applicants.map((applicant) => ({
      ...applicant,
      match: scoreApplicantMatch(applicant, job),
    }))
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; success?: string; message?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const { error, success, message } = await searchParams
  const numericId = Number(id)

  if (Number.isNaN(numericId))
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <BackButton href="/job-orders" />
      </div>
    )

  const { data: job, error: jobError } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country, gender, years_exp_required, skills_required, no_workers")
    .eq("id", numericId)
    .maybeSingle()

  if (jobError || !job)
    return (
      <div className="p-6">
        <p className="text-red-500">Job order not found</p>
        <BackButton href="/job-orders" />
      </div>
    )

  const jobOrder = job as JobOrderForMatch & { id: number; company: string | null; no_workers: number | null }

  const { data: placements } = await supabase
    .from("placements")
    .select("applicant_id")
    .eq("job_order_id", numericId)

  const matchedIds = (placements || []).map((p) => p.applicant_id)

  const { data: applicants } = await supabase
    .from("applicants")
    .select(
      "id, first_name, last_name, position_applied, country_applying_for, gender, years_of_exp, skills, status"
    )

  const all = (applicants || []) as ApplicantRow[]
  const matched = all.filter((applicant) => matchedIds.includes(applicant.id))
  const available = all.filter(
    (applicant) => !matchedIds.includes(applicant.id) && isEligibleForJobMatching(applicant.status)
  )

  const scoredUnmatched = buildScoredList(available, jobOrder)
  const suggested = scoredUnmatched.filter((applicant) => isSuggestedMatch(applicant.match))
  const others = scoredUnmatched.filter((applicant) => !isSuggestedMatch(applicant.match))

  const slotsNeeded = jobOrder.no_workers ?? 0
  const slotsFilled = matched.length

  return (
    <div className="max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Match Applicants - JO-{jobOrder.id}</h1>
        <BackButton href="/job-orders" />
      </div>

      <p className="mb-2 text-gray-600">
        {jobOrder.job_title} at {jobOrder.company}
      </p>
      {slotsNeeded > 0 && (
        <p className="mb-6 text-sm font-medium text-gray-800">
          Slots filled: {slotsFilled}/{slotsNeeded}
        </p>
      )}

      {success === "matched" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">
          Applicant matched. Status set to Selected if applicable.
        </div>
      )}
      {success === "unmatched" && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-800">Match removed.</div>
      )}
      {error === "match" && message && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-800">{decodeURIComponent(message)}</div>
      )}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Matched Applicants</h2>
          {matched.length > 0 && <CompileDownloadButton jobOrderId={jobOrder.id} />}
        </div>
        {matched.length ? (
          <ul className="divide-y rounded-lg border bg-white">
            {matched.map((applicant) => (
              <li key={applicant.id} className="flex items-center justify-between p-3">
                <span>
                  <span className="text-gray-500">{formatApplicantRef(applicant.id)} · </span>
                  <Link href={`/applicants/${applicant.id}`} className="text-blue-600 hover:underline">
                    {applicant.first_name} {applicant.last_name}
                  </Link>
                  <span className="ml-2 text-gray-600">
                    — {applicant.position_applied ?? "No position"}
                  </span>
                </span>
                <DeleteMatchForm applicantId={applicant.id} jobOrderId={jobOrder.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No matched applicants yet</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Suggested Applicants</h2>
        {suggested.length ? (
          <ul className="divide-y rounded-lg border bg-white">
            {suggested.map((applicant) => (
              <li key={applicant.id} className="flex items-start justify-between gap-4 p-3">
                <div className="min-w-0 flex-1">
                  <div>
                    <span className="text-gray-500">{formatApplicantRef(applicant.id)} · </span>
                    <Link href={`/applicants/${applicant.id}`} className="font-medium text-blue-600 hover:underline">
                      {applicant.first_name} {applicant.last_name}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600">
                    {applicant.position_applied ?? "No position"} • {applicant.years_of_exp ?? 0} yrs
                    {applicant.country_applying_for ? ` • ${applicant.country_applying_for}` : ""}
                  </p>
                  <MatchScoreBadges match={applicant.match} />
                </div>
                <MatchToJobForm applicantId={applicant.id} jobOrderId={jobOrder.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No suggested applicants</p>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Other Applicants</h2>
        {others.length ? (
          <ul className="divide-y rounded-lg border bg-white">
            {others.map((applicant) => (
              <li key={applicant.id} className="flex items-start justify-between gap-4 p-3">
                <div className="min-w-0 flex-1">
                  <div>
                    <span className="text-gray-500">{formatApplicantRef(applicant.id)} · </span>
                    <Link href={`/applicants/${applicant.id}`} className="font-medium text-blue-600 hover:underline">
                      {applicant.first_name} {applicant.last_name}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600">
                    {applicant.position_applied ?? "No position"} • {applicant.years_of_exp ?? 0} yrs
                    {applicant.country_applying_for ? ` • ${applicant.country_applying_for}` : ""}
                  </p>
                  <MatchScoreBadges match={applicant.match} />
                </div>
                <MatchToJobForm applicantId={applicant.id} jobOrderId={jobOrder.id} />
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

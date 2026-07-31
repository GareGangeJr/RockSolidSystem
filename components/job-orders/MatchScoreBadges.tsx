import type { ApplicantMatchResult } from "@/lib/job-order-match"

export function MatchScoreBadges({ match }: { match: ApplicantMatchResult }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      {match.criteria.map((item) => (
        <span key={item.label} className={item.pass ? "text-green-700" : "text-red-600"}>
          {item.pass ? "✓" : "✗"} {item.label}
        </span>
      ))}
    </div>
  )
}

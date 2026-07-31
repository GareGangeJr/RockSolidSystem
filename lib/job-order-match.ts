export type MatchCriterion = {
  label: string
  pass: boolean
}

export type JobOrderForMatch = {
  job_title: string | null
  country: string | null
  gender: string | null
  years_exp_required: number | null
  skills_required: string | null
}

export type ApplicantForMatch = {
  id: number
  first_name: string | null
  last_name: string | null
  position_applied: string | null
  country_applying_for: string | null
  gender: string | null
  years_of_exp: number | null
  skills: string | null
}

export type ApplicantMatchResult = {
  score: number
  criteria: MatchCriterion[]
}

const CRITERION_WEIGHTS: Record<string, number> = {
  Position: 35,
  Country: 30,
  Experience: 20,
  Skills: 10,
  Gender: 5,
}

const REQUIRED_FOR_SUGGESTED = new Set(["Position", "Country"])

function parseSkills(value: string | null) {
  return (value || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function normalizeText(value: string | null) {
  return (value || "").trim().toLowerCase()
}

function checkExperience(applicant: ApplicantForMatch, job: JobOrderForMatch): MatchCriterion {
  const required = job.years_exp_required ?? 0
  const has = applicant.years_of_exp ?? 0
  return {
    label: "Experience",
    pass: required === 0 || has >= required,
  }
}

function checkSkills(applicant: ApplicantForMatch, job: JobOrderForMatch): MatchCriterion {
  const jobSkills = parseSkills(job.skills_required)
  const appSkills = parseSkills(applicant.skills)
  if (jobSkills.length === 0) {
    return { label: "Skills", pass: true }
  }

  const matched = jobSkills.filter((skill) => appSkills.includes(skill)).length
  const needed = Math.ceil(jobSkills.length / 2)

  return {
    label: "Skills",
    pass: matched >= needed,
  }
}

function checkGender(applicant: ApplicantForMatch, job: JobOrderForMatch): MatchCriterion {
  const required = normalizeText(job.gender)
  const has = normalizeText(applicant.gender)
  return {
    label: "Gender",
    pass: !required || required === "any" || (has !== "" && has === required),
  }
}

function checkCountry(applicant: ApplicantForMatch, job: JobOrderForMatch): MatchCriterion {
  const required = normalizeText(job.country)
  const has = normalizeText(applicant.country_applying_for)
  return {
    label: "Country",
    pass: !required || (has !== "" && has === required),
  }
}

function checkPosition(applicant: ApplicantForMatch, job: JobOrderForMatch): MatchCriterion {
  const jobTitle = normalizeText(job.job_title)
  const position = normalizeText(applicant.position_applied)
  return {
    label: "Position",
    pass: !jobTitle || (position !== "" && (position.includes(jobTitle) || jobTitle.includes(position))),
  }
}

export function scoreApplicantMatch(applicant: ApplicantForMatch, job: JobOrderForMatch): ApplicantMatchResult {
  const criteria = [
    checkExperience(applicant, job),
    checkSkills(applicant, job),
    checkGender(applicant, job),
    checkCountry(applicant, job),
    checkPosition(applicant, job),
  ]

  const score = criteria.reduce(
    (sum, item) => sum + (item.pass ? (CRITERION_WEIGHTS[item.label] ?? 0) : 0),
    0
  )

  return { score, criteria }
}

export function isSuggestedMatch(result: ApplicantMatchResult) {
  const passes = new Map(result.criteria.map((item) => [item.label, item.pass]))
  for (const label of REQUIRED_FOR_SUGGESTED) {
    if (!passes.get(label)) return false
  }
  return true
}

export function sortByMatchScore<T extends { match: ApplicantMatchResult }>(items: T[]) {
  return [...items].sort((a, b) => b.match.score - a.match.score)
}

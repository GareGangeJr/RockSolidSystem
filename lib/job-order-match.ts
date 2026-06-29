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
  return {
    label: "Skills",
    pass: jobSkills.length === 0 || jobSkills.some((skill) => appSkills.includes(skill)),
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

  const passed = criteria.filter((item) => item.pass).length
  const score = Math.round((passed / criteria.length) * 100)

  return { score, criteria }
}

export const SUGGESTED_MATCH_MIN_SCORE = 60

export function isSuggestedMatch(result: ApplicantMatchResult) {
  return result.score >= SUGGESTED_MATCH_MIN_SCORE
}

export function sortByMatchScore<T extends { match: ApplicantMatchResult }>(items: T[]) {
  return [...items].sort((a, b) => b.match.score - a.match.score)
}

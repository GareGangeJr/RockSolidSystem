import { describe, expect, it } from "vitest"
import {
  isSuggestedMatch,
  scoreApplicantMatch,
  type ApplicantForMatch,
  type JobOrderForMatch,
} from "@/lib/job-order-match"

const baseApplicant: ApplicantForMatch = {
  id: 1,
  first_name: "Ana",
  last_name: "Cruz",
  position_applied: "Housekeeper",
  country_applying_for: "Saudi Arabia",
  gender: "Female",
  years_of_exp: 3,
  skills: "Cleaning, Cooking",
}

const baseJob: JobOrderForMatch = {
  job_title: "Housekeeper",
  country: "Saudi Arabia",
  gender: "Female",
  years_exp_required: 2,
  skills_required: "Cleaning, Cooking",
}

describe("scoreApplicantMatch", () => {
  it("scores a full match at 100", () => {
    const result = scoreApplicantMatch(baseApplicant, baseJob)
    expect(result.score).toBe(100)
    expect(isSuggestedMatch(result)).toBe(true)
  })

  it("fails suggested when position does not match", () => {
    const result = scoreApplicantMatch(
      { ...baseApplicant, position_applied: "Driver" },
      baseJob
    )
    expect(result.criteria.find((c) => c.label === "Position")?.pass).toBe(false)
    expect(isSuggestedMatch(result)).toBe(false)
  })

  it("passes skills when at least half match", () => {
    const result = scoreApplicantMatch(
      { ...baseApplicant, skills: "Cleaning" },
      { ...baseJob, skills_required: "Cleaning, Cooking" }
    )
    expect(result.criteria.find((c) => c.label === "Skills")?.pass).toBe(true)
  })

  it("treats empty job gender/country as optional pass", () => {
    const result = scoreApplicantMatch(baseApplicant, {
      ...baseJob,
      gender: null,
      country: null,
    })
    expect(result.criteria.find((c) => c.label === "Gender")?.pass).toBe(true)
    expect(result.criteria.find((c) => c.label === "Country")?.pass).toBe(true)
  })
})

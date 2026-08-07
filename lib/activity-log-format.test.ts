import { describe, expect, it } from "vitest"
import {
  formatActivityAction,
  formatActivityModule,
  normalizeActivityRecordId,
} from "@/lib/activity-log-format"

describe("normalizeActivityRecordId", () => {
  it("formats applicant numeric ids as APP-YEAR-id", () => {
    const year = new Date().getFullYear()
    expect(normalizeActivityRecordId("applicants", 42)).toBe(`APP-${year}-42`)
  })

  it("prefixes job orders and monitoring", () => {
    expect(normalizeActivityRecordId("job_orders", 7)).toBe("JO-7")
    expect(normalizeActivityRecordId("monitoring", 3)).toBe("MON-3")
  })

  it("keeps employee numbers that already have EMP-", () => {
    expect(normalizeActivityRecordId("employees", "EMP-2026-001")).toBe("EMP-2026-001")
    expect(normalizeActivityRecordId("attendance", "12")).toBe("EMP-12")
  })

  it("resolves archive details to the entity module", () => {
    const year = new Date().getFullYear()
    expect(
      normalizeActivityRecordId("archive", "x", { table: "applicants", entityId: 9 })
    ).toBe(`APP-${year}-9`)
  })
})

describe("formatActivity labels", () => {
  it("maps known actions and modules", () => {
    expect(formatActivityAction("deploy")).toBe("Deployed")
    expect(formatActivityModule("job_orders")).toBe("Job Order")
  })
})

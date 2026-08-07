import { describe, expect, it } from "vitest"
import {
  filterDeploymentsByDateRange,
  formatReportRangeLabel,
  isDeploymentInDateRange,
  parseDateParam,
} from "@/lib/reports/date-range"

describe("parseDateParam", () => {
  it("accepts YYYY-MM-DD and rejects junk", () => {
    expect(parseDateParam("2026-01-15")).toBe("2026-01-15")
    expect(parseDateParam("not-a-date")).toBeNull()
    expect(parseDateParam(null)).toBeNull()
  })
})

describe("isDeploymentInDateRange", () => {
  it("includes dates inside the range and excludes outside", () => {
    expect(isDeploymentInDateRange("2026-01-10", "2026-01-01", "2026-01-31")).toBe(true)
    expect(isDeploymentInDateRange("2025-12-31", "2026-01-01", "2026-01-31")).toBe(false)
    expect(isDeploymentInDateRange(null, "2026-01-01", null)).toBe(false)
  })

  it("swaps inverted from/to", () => {
    expect(isDeploymentInDateRange("2026-01-15", "2026-01-31", "2026-01-01")).toBe(true)
  })
})

describe("filterDeploymentsByDateRange", () => {
  it("filters rows by deploymentDate", () => {
    const rows = [
      { id: 1, deploymentDate: "2026-01-05" },
      { id: 2, deploymentDate: "2026-02-01" },
      { id: 3, deploymentDate: null },
    ]
    expect(filterDeploymentsByDateRange(rows, "2026-01-01", "2026-01-31").map((r) => r.id)).toEqual([
      1,
    ])
  })
})

describe("formatReportRangeLabel", () => {
  it("labels empty and bounded ranges", () => {
    expect(formatReportRangeLabel(null, null)).toBe("All")
    expect(formatReportRangeLabel("2026-01-01", "2026-01-31")).toBe("2026-01-01_to_2026-01-31")
  })
})

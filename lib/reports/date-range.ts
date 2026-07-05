export type ReportPeriod = "all" | "day" | "week" | "month" | "year"

export function parseReportPeriod(value: string | null): ReportPeriod {
  if (value === "day" || value === "week" || value === "month" || value === "year") return value
  return "all"
}

function getRange(period: ReportPeriod, dateInput: string): { start: Date; end: Date } | null {
  if (period === "all" || !dateInput.trim()) return null

  if (period === "day") {
    const start = new Date(`${dateInput}T00:00:00`)
    const end = new Date(`${dateInput}T23:59:59.999`)
    return { start, end }
  }

  if (period === "month") {
    const [y, m] = dateInput.split("-").map(Number)
    if (!y || !m) return null
    return {
      start: new Date(y, m - 1, 1),
      end: new Date(y, m, 0, 23, 59, 59, 999),
    }
  }

  if (period === "year") {
    const y = Number(dateInput)
    if (!y) return null
    return {
      start: new Date(y, 0, 1),
      end: new Date(y, 11, 31, 23, 59, 59, 999),
    }
  }

  if (period === "week") {
    const d = new Date(`${dateInput}T12:00:00`)
    if (Number.isNaN(d.getTime())) return null
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const start = new Date(d)
    start.setDate(d.getDate() + diffToMonday)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  return null
}

export function isDeploymentInPeriod(
  deploymentDate: string | null,
  period: ReportPeriod,
  dateInput: string
): boolean {
  const range = getRange(period, dateInput)
  if (!range) return true
  if (!deploymentDate) return false
  const d = new Date(`${deploymentDate.slice(0, 10)}T12:00:00`)
  return d >= range.start && d <= range.end
}

export function filterDeploymentsByPeriod<T extends { deploymentDate: string | null }>(
  rows: T[],
  period: ReportPeriod,
  dateInput: string
): T[] {
  if (period === "all") return rows
  return rows.filter((row) => isDeploymentInPeriod(row.deploymentDate, period, dateInput))
}

export function defaultDateInput(period: ReportPeriod): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  if (period === "year") return String(y)
  if (period === "month") return `${y}-${m}`
  return `${y}-${m}-${d}`
}

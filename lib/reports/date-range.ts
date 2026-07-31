export function parseDateParam(value: string | null): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim().slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  return null
}

function normalizeRange(fromDate: string | null, toDate: string | null) {
  if (!fromDate && !toDate) return { from: null, to: null }
  if (fromDate && toDate && fromDate > toDate) {
    return { from: toDate, to: fromDate }
  }
  return { from: fromDate, to: toDate }
}

export function isDeploymentInDateRange(
  deploymentDate: string | null,
  fromDate: string | null,
  toDate: string | null
): boolean {
  const { from, to } = normalizeRange(fromDate, toDate)
  if (!from && !to) return true
  if (!deploymentDate) return false

  const day = deploymentDate.slice(0, 10)
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}

export function filterDeploymentsByDateRange<T extends { deploymentDate: string | null }>(
  rows: T[],
  fromDate: string | null,
  toDate: string | null
): T[] {
  const { from, to } = normalizeRange(fromDate, toDate)
  if (!from && !to) return rows
  return rows.filter((row) => isDeploymentInDateRange(row.deploymentDate, from, to))
}

export function formatReportRangeLabel(fromDate: string | null, toDate: string | null): string {
  const { from, to } = normalizeRange(fromDate, toDate)
  if (!from && !to) return "All"
  if (from && to) return `${from}_to_${to}`
  if (from) return `from_${from}`
  return `to_${to}`
}

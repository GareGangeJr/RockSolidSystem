export type MonitoringConcernEntry = {
  concern_type: string
  concern_date_reported: string
  concern_status: string
  action_taken: string
}

export type MonitoringHistoryEntry = {
  entry_date: string
  date_of_departure: string
  date_of_arrival: string
  expected_return_date: string
  actual_return_date: string
  reason_for_return: string
  will_extend_contract: string
  notes: string
}

export const emptyConcernEntry = (): MonitoringConcernEntry => ({
  concern_type: "",
  concern_date_reported: "",
  concern_status: "",
  action_taken: "",
})

export const emptyHistoryEntry = (): MonitoringHistoryEntry => ({
  entry_date: "",
  date_of_departure: "",
  date_of_arrival: "",
  expected_return_date: "",
  actual_return_date: "",
  reason_for_return: "",
  will_extend_contract: "",
  notes: "",
})

function hasText(value: unknown) {
  return value != null && String(value).trim() !== ""
}

export function hasOpenConcern(concerns: MonitoringConcernEntry[]): boolean {
  return concerns.some(
    (entry) =>
      concernEntryHasData(entry) &&
      hasText(entry.concern_type) &&
      hasText(entry.concern_status) &&
      entry.concern_status !== "Resolved"
  )
}

export function concernEntryIsPartial(entry: MonitoringConcernEntry): boolean {
  if (!concernEntryHasData(entry)) return false
  return (
    !hasText(entry.concern_type) ||
    !hasText(entry.concern_date_reported) ||
    !hasText(entry.concern_status)
  )
}

export function validateConcernEntries(concerns: MonitoringConcernEntry[]): string | null {
  for (const entry of concerns) {
    if (concernEntryIsPartial(entry)) {
      return "Each concern must include type, date reported, and status."
    }
  }
  return null
}

export function resolveDeploymentStatus(
  concerns: MonitoringConcernEntry[],
  requestedStatus?: string | null
): "Deployed" | "Deployed(With Concerns)" {
  if (hasOpenConcern(concerns)) return "Deployed(With Concerns)"
  if (requestedStatus === "Deployed(With Concerns)" && !hasOpenConcern(concerns)) {
    return "Deployed"
  }
  return "Deployed"
}

function sliceDate(value: unknown): string | null {
  if (!hasText(value)) return null
  return String(value).slice(0, 10)
}

function syncHistoryDepartureDates(
  history: MonitoringHistoryEntry[],
  deploymentDate: string | null
): MonitoringHistoryEntry[] {
  if (!deploymentDate) return history
  return history.map((entry) =>
    historyEntryHasData(entry) ? { ...entry, date_of_departure: deploymentDate } : entry
  )
}

export function concernEntryHasData(entry: MonitoringConcernEntry) {
  return (
    hasText(entry.concern_type) ||
    hasText(entry.concern_date_reported) ||
    hasText(entry.concern_status) ||
    hasText(entry.action_taken)
  )
}

export function historyEntryHasData(entry: MonitoringHistoryEntry) {
  return (
    hasText(entry.entry_date) ||
    hasText(entry.date_of_departure) ||
    hasText(entry.date_of_arrival) ||
    hasText(entry.expected_return_date) ||
    hasText(entry.actual_return_date) ||
    hasText(entry.reason_for_return) ||
    hasText(entry.will_extend_contract) ||
    hasText(entry.notes)
  )
}

function mapConcernEntry(entry: unknown): MonitoringConcernEntry {
  const row = (entry ?? {}) as Record<string, unknown>
  return {
    concern_type: hasText(row.concern_type) ? String(row.concern_type) : "",
    concern_date_reported: hasText(row.concern_date_reported) ? String(row.concern_date_reported).slice(0, 10) : "",
    concern_status: hasText(row.concern_status) ? String(row.concern_status) : "",
    action_taken: hasText(row.action_taken) ? String(row.action_taken) : "",
  }
}

function mapHistoryEntry(entry: unknown): MonitoringHistoryEntry {
  const row = (entry ?? {}) as Record<string, unknown>
  const date = (value: unknown) => (hasText(value) ? String(value).slice(0, 10) : "")
  return {
    entry_date: date(row.entry_date),
    date_of_departure: date(row.date_of_departure),
    date_of_arrival: date(row.date_of_arrival),
    expected_return_date: date(row.expected_return_date),
    actual_return_date: date(row.actual_return_date),
    reason_for_return: hasText(row.reason_for_return) ? String(row.reason_for_return) : "",
    will_extend_contract: hasText(row.will_extend_contract) ? String(row.will_extend_contract) : "",
    notes: hasText(row.notes) ? String(row.notes) : "",
  }
}

export function parseConcernEntriesJson(raw: string | null): MonitoringConcernEntry[] {
  if (!raw) return [emptyConcernEntry()]
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return [emptyConcernEntry()]
    return parsed.map(mapConcernEntry)
  } catch {
    return [emptyConcernEntry()]
  }
}

export function parseHistoryEntriesJson(raw: string | null): MonitoringHistoryEntry[] {
  if (!raw) return [emptyHistoryEntry()]
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return [emptyHistoryEntry()]
    return parsed.map(mapHistoryEntry)
  } catch {
    return [emptyHistoryEntry()]
  }
}

export function normalizeConcernEntriesFromRecord(record: Record<string, unknown>): MonitoringConcernEntry[] {
  const stored = record.concern_entries
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(mapConcernEntry)
  }

  if (concernEntryHasData(mapConcernEntry(record))) {
    return [mapConcernEntry(record)]
  }

  return [emptyConcernEntry()]
}

export function normalizeHistoryEntriesFromRecord(record: Record<string, unknown>): MonitoringHistoryEntry[] {
  const stored = record.history_entries
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(mapHistoryEntry)
  }

  const legacy = mapHistoryEntry({
    entry_date: record.last_status_update ?? record.deployment_date,
    date_of_departure: record.date_of_departure,
    date_of_arrival: record.date_of_arrival,
    expected_return_date: record.expected_return_date,
    actual_return_date: record.actual_return_date,
    reason_for_return: record.reason_for_return,
    will_extend_contract: record.will_extend_contract,
    notes: "",
  })

  if (historyEntryHasData(legacy)) {
    return [legacy]
  }

  return [emptyHistoryEntry()]
}

export function buildMonitoringEntrySyncPayload(
  concerns: MonitoringConcernEntry[],
  history: MonitoringHistoryEntry[],
  options?: {
    currentDeploymentStatus?: string | null
    deploymentDate?: string | null
  }
) {
  const savedConcerns = concerns.filter(concernEntryHasData)
  const deploymentDate = sliceDate(options?.deploymentDate)
  const savedHistory = syncHistoryDepartureDates(
    history.filter(historyEntryHasData),
    deploymentDate
  )
  const latestConcern = savedConcerns[savedConcerns.length - 1]
  const latestHistory = savedHistory[savedHistory.length - 1]

  const deploymentStatus = resolveDeploymentStatus(savedConcerns, options?.currentDeploymentStatus)

  return {
    concern_entries: savedConcerns,
    history_entries: savedHistory,
    concern_type: latestConcern?.concern_type || null,
    concern_date_reported: latestConcern?.concern_date_reported || null,
    concern_status: latestConcern?.concern_status || null,
    action_taken: latestConcern?.action_taken || null,
    date_of_departure: deploymentDate ?? (latestHistory?.date_of_departure || null),
    date_of_arrival: latestHistory?.date_of_arrival || null,
    expected_return_date: latestHistory?.expected_return_date || null,
    actual_return_date: latestHistory?.actual_return_date || null,
    reason_for_return: latestHistory?.reason_for_return || null,
    will_extend_contract: latestHistory?.will_extend_contract || null,
    deployment_status: deploymentStatus,
    ...(deploymentDate ? { deployment_date: deploymentDate } : {}),
    last_status_update: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

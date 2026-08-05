"use client"

import { useState } from "react"
import { fieldClassSm, formGridClass, labelClassSm, sectionTitleClassSm } from "@/lib/form-ui"
import {
  emptyConcernEntry,
  emptyHistoryEntry,
  type MonitoringConcernEntry,
  type MonitoringHistoryEntry,
} from "@/lib/monitoring-entries"

type Props = {
  deploymentDate?: string | null
  lastStatusUpdate?: string | null
  initialConcerns: MonitoringConcernEntry[]
  initialHistory: MonitoringHistoryEntry[]
}

function formatDisplayDate(date: unknown) {
  if (!date || String(date).length < 10) return "--"
  return String(date).slice(0, 10)
}

export function MonitoringConcernsHistoryForm({
  deploymentDate,
  lastStatusUpdate,
  initialConcerns,
  initialHistory,
}: Props) {
  const [concerns, setConcerns] = useState<MonitoringConcernEntry[]>(
    initialConcerns.length > 0 ? initialConcerns : [emptyConcernEntry()]
  )
  const [history, setHistory] = useState<MonitoringHistoryEntry[]>(
    initialHistory.length > 0 ? initialHistory : [emptyHistoryEntry()]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className={sectionTitleClassSm}>Concerns</h2>
        <p className="mb-3 text-xs text-gray-500">
          Each concern must include type, date reported, and status. Action taken is optional.
        </p>
        <div className="space-y-4">
          {concerns.map((concern, index) => (
            <div key={index} className="rounded-md border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">CONCERN {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setConcerns((prev) => prev.filter((_, i) => i !== index))}
                  disabled={concerns.length <= 1}
                  className="text-xs text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className={formGridClass}>
                <div>
                  <label className={labelClassSm}>Type of Concern</label>
                  <select
                    className={fieldClassSm}
                    value={concern.concern_type}
                    onChange={(e) =>
                      setConcerns((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], concern_type: e.target.value }
                        return next
                      })
                    }
                  >
                    <option value="">Select type</option>
                    <option value="Salary Issue">Salary Issue</option>
                    <option value="Abuse">Abuse</option>
                    <option value="Health">Health</option>
                    <option value="Homesick">Homesick</option>
                    <option value="Contract Issue">Contract Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassSm}>Date Reported</label>
                  <input
                    type="date"
                    className={fieldClassSm}
                    value={concern.concern_date_reported}
                    onChange={(e) =>
                      setConcerns((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], concern_date_reported: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Status of Concern</label>
                  <select
                    className={fieldClassSm}
                    value={concern.concern_status}
                    onChange={(e) =>
                      setConcerns((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], concern_status: e.target.value }
                        return next
                      })
                    }
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className={labelClassSm}>Action Taken</label>
                  <textarea
                    className={fieldClassSm}
                    rows={3}
                    value={concern.action_taken}
                    onChange={(e) =>
                      setConcerns((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], action_taken: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setConcerns((prev) => [...prev, emptyConcernEntry()])}
            className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            + Add Concern
          </button>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClassSm}>History</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClassSm}>Departure Date</label>
            <div className={`${fieldClassSm} cursor-not-allowed bg-gray-50 text-gray-600`}>
              {formatDisplayDate(deploymentDate)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Edit on Deployment page.</p>
          </div>
          <div>
            <label className={labelClassSm}>Last Status Update</label>
            <div className={`${fieldClassSm} cursor-not-allowed bg-gray-50 text-gray-600`}>
              {formatDisplayDate(lastStatusUpdate)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="rounded-md border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">HISTORY {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setHistory((prev) => prev.filter((_, i) => i !== index))}
                  disabled={history.length <= 1}
                  className="text-xs text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className={formGridClass}>
                <div>
                  <label className={labelClassSm}>Entry Date</label>
                  <input
                    type="date"
                    className={fieldClassSm}
                    value={entry.entry_date}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], entry_date: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Date of Arrival</label>
                  <input
                    type="date"
                    className={fieldClassSm}
                    value={entry.date_of_arrival}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], date_of_arrival: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Expected Return Date</label>
                  <input
                    type="date"
                    className={fieldClassSm}
                    value={entry.expected_return_date}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], expected_return_date: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Actual Return Date</label>
                  <input
                    type="date"
                    className={fieldClassSm}
                    value={entry.actual_return_date}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], actual_return_date: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Reason for Return</label>
                  <select
                    className={fieldClassSm}
                    value={entry.reason_for_return}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], reason_for_return: e.target.value }
                        return next
                      })
                    }
                  >
                    <option value="">Not yet returned</option>
                    <option value="Contract Finished">Contract Finished</option>
                    <option value="Early Termination">Early Termination</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Health Reasons">Health Reasons</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassSm}>Will Extend Contract?</label>
                  <select
                    className={fieldClassSm}
                    value={entry.will_extend_contract}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], will_extend_contract: e.target.value }
                        return next
                      })
                    }
                  >
                    <option value="">Not decided</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className={labelClassSm}>Notes</label>
                  <textarea
                    className={fieldClassSm}
                    rows={3}
                    value={entry.notes}
                    onChange={(e) =>
                      setHistory((prev) => {
                        const next = [...prev]
                        next[index] = { ...next[index], notes: e.target.value }
                        return next
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHistory((prev) => [...prev, emptyHistoryEntry()])}
            className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            + Add History
          </button>
        </div>
      </div>

      <input type="hidden" name="concern_entries" value={JSON.stringify(concerns)} />
      <input type="hidden" name="history_entries" value={JSON.stringify(history)} />
      <input
        type="hidden"
        name="deployment_date"
        value={deploymentDate ? String(deploymentDate).slice(0, 10) : ""}
      />
    </div>
  )
}

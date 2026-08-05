"use client"

import { useState } from "react"
import { updateMonitoringConcerns } from "@/app/(app)/monitoring/actions"
import {
  MonitoringConcernsHistoryForm,
} from "@/components/monitoring/MonitoringConcernsHistoryForm"
import {
  validateConcernEntries,
  type MonitoringConcernEntry,
  type MonitoringHistoryEntry,
} from "@/lib/monitoring-entries"

type Props = {
  monitoringId: number
  deploymentDate?: string | null
  lastStatusUpdate?: string | null
  initialConcerns: MonitoringConcernEntry[]
  initialHistory: MonitoringHistoryEntry[]
}

export function MonitoringConcernsPageForm({
  monitoringId,
  deploymentDate,
  lastStatusUpdate,
  initialConcerns,
  initialHistory,
}: Props) {
  const [formError, setFormError] = useState<string | null>(null)

  return (
    <form
      action={updateMonitoringConcerns}
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      onSubmit={(e) => {
        const formData = new FormData(e.currentTarget)
        const concerns = JSON.parse(String(formData.get("concern_entries") || "[]")) as MonitoringConcernEntry[]
        const validationError = validateConcernEntries(concerns)
        if (validationError) {
          e.preventDefault()
          setFormError(validationError)
          return
        }
        setFormError(null)
      }}
    >
      <input type="hidden" name="id" value={monitoringId} />
      <div className="space-y-6 p-6">
        {formError && (
          <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-800">{formError}</div>
        )}

        <MonitoringConcernsHistoryForm
          deploymentDate={deploymentDate}
          lastStatusUpdate={lastStatusUpdate}
          initialConcerns={initialConcerns}
          initialHistory={initialHistory}
        />

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  )
}

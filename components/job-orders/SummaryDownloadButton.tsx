"use client"

import { useState } from "react"
import { Download } from "lucide-react"

type SummaryDownloadButtonProps = {
  jobOrderId: number
}

export function SummaryDownloadButton({ jobOrderId }: SummaryDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDownload() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/job-orders/${jobOrderId}/summary`, {
        credentials: "same-origin",
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "Download failed.")
      }

      const contentType = response.headers.get("Content-Type") ?? ""
      if (!contentType.includes("application/pdf")) {
        throw new Error("Download failed. Server did not return a PDF.")
      }

      const blob = await response.blob()
      const disposition = response.headers.get("Content-Disposition") ?? ""
      const match = disposition.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? `JO-${jobOrderId} Matched Summary.pdf`

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {loading ? "Preparing..." : "Download Summary"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

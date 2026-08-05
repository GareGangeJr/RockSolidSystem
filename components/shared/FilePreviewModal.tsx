"use client"

import { useState } from "react"
import { X } from "lucide-react"

type FilePreview = {
  url: string
  name: string
  pdf: boolean
}

type FilePreviewModalProps = {
  preview: FilePreview | null
  onClose: () => void
}

function FilePreviewModalBody({ preview, onClose }: { preview: FilePreview; onClose: () => void }) {
  const [actualSize, setActualSize] = useState(false)

  function handleClose() {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={handleClose}>
      <div
        className="flex max-h-[95vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <span className="truncate text-sm font-medium">{preview.name}</span>
          <div className="flex shrink-0 items-center gap-1">
            {!preview.pdf && (
              <button
                type="button"
                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                onClick={() => setActualSize((value) => !value)}
              >
                {actualSize ? "Fit" : "Actual Size"}
              </button>
            )}
            <button
              type="button"
              className="rounded p-1.5 hover:bg-red-50 hover:text-red-600"
              title="Close"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-auto p-4">
          {preview.pdf ? (
            <iframe src={preview.url} className="h-[80vh] w-full border" title={preview.name} />
          ) : actualSize ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt={preview.name} className="block" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt={preview.name} className="mx-auto block max-h-[80vh] w-full object-contain" />
          )}
        </div>
      </div>
    </div>
  )
}

export function FilePreviewModal({ preview, onClose }: FilePreviewModalProps) {
  if (!preview) return null
  return <FilePreviewModalBody key={preview.url} preview={preview} onClose={onClose} />
}

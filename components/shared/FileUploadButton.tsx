"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]

type FileUploadButtonProps = {
  entityId: number
  storageBucket: string
  filesTable: string
  entityIdColumn: string
  onUploadSuccess?: () => void
}

export function FileUploadButton({
  entityId,
  storageBucket,
  filesTable,
  entityIdColumn,
  onUploadSuccess,
}: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputId = `upload-${filesTable}-${entityId}`

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    setError(null)

    if (file.size > MAX_BYTES) {
      setError("File too large. Maximum size is 5 MB.")
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PDF, JPG, and PNG files are allowed.")
      return
    }

    setUploading(true)
    const supabase = createSupabaseBrowser()
    const filePath = `${entityId}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`

    const { error: uploadError } = await supabase.storage.from(storageBucket).upload(filePath, file)
    if (uploadError) {
      setUploading(false)
      setError(uploadError.message)
      return
    }

    const { error: dbError } = await supabase.from(filesTable).insert({
      [entityIdColumn]: entityId,
      file_name: file.name,
      file_path: filePath,
    })

    setUploading(false)
    if (dbError) {
      setError(dbError.message)
      return
    }

    if (onUploadSuccess) onUploadSuccess()
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleUpload}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button
        type="button"
        onClick={() => document.getElementById(inputId)?.click()}
        disabled={uploading}
        className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
          uploading
            ? "cursor-not-allowed border-gray-300 text-gray-400"
            : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

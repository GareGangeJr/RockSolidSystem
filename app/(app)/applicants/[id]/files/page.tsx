"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { FileUploadButton } from "@/components/shared/FileUploadButton"
import { BackButton } from "@/components/BackButton"

type FileRow = {
  id: number
  applicant_id: number
  file_name: string | null
  file_path: string | null
  created_at: string
}

type FilePreview = {
  url: string
  name: string
  type: "image" | "pdf"
}

const BUCKET = "applicant files"

function getPreviewType(fileName: string): "image" | "pdf" | null {
  const lower = fileName.toLowerCase()
  if (lower.endsWith(".pdf")) return "pdf"
  if (/\.(jpe?g|png|gif|webp)$/.test(lower)) return "image"
  return null
}

export default function ApplicantFilesPage() {
  const params = useParams()
  const supabase = createSupabaseBrowser()

  const applicantId = Number(params.id)

  const [files, setFiles] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<FilePreview | null>(null)
  const [viewLoading, setViewLoading] = useState(false)

  async function loadFiles() {
    setLoading(true)
    const { data, error } = await supabase
      .from("applicant_files")
      .select("*")
      .eq("applicant_id", applicantId)
      .order("created_at", { ascending: false })

    if (!error && data) setFiles(data as FileRow[])
    setLoading(false)
  }

  async function signedUrl(path: string) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60)

    if (error || !data?.signedUrl) {
      alert("Signed URL failed: " + (error?.message || "unknown error"))
      return null
    }
    return data.signedUrl
  }

  async function viewFile(path: string, name: string) {
    const previewType = getPreviewType(name)
    if (!previewType) {
      alert("Preview is only available for PDF, JPG, and PNG files. Use Download instead.")
      return
    }

    setViewLoading(true)
    const url = await signedUrl(path)
    setViewLoading(false)
    if (url) setPreview({ url, name, type: previewType })
  }

  useEffect(() => {
    if (!preview) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPreview(null)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [preview])

  async function downloadFile(path: string, name: string) {
    const url = await signedUrl(path)
    if (!url) return

    const res = await fetch(url)
    const blob = await res.blob()
    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = name || "file"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(downloadLink.href)
  }

  async function deleteFile(fileId: number, path: string) {
    if (!confirm("Delete this file?")) return

    const { error: storageError } = await supabase.storage.from(BUCKET).remove([path])
    if (storageError) return alert("Storage delete failed: " + storageError.message)

    const { error: dbError } = await supabase.from("applicant_files").delete().eq("id", fileId)
    if (dbError) return alert("DB delete failed: " + dbError.message)

    loadFiles()
  }

  useEffect(() => {
    if (isNaN(applicantId)) return
    let cancelled = false
    void (async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("applicant_files")
        .select("*")
        .eq("applicant_id", applicantId)
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (!error && data) setFiles(data as FileRow[])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [applicantId, supabase])

  if (isNaN(applicantId)) return <div className="p-6 text-red-500">Invalid applicant ID</div>

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Applicant Files</h1>

        <div className="flex items-center gap-3">
          <FileUploadButton
            entityId={applicantId}
            storageBucket="applicant files"
            filesTable="applicant_files"
            entityIdColumn="applicant_id"
          />

          <BackButton href="/applicants" />
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && !files.length && <div className="text-gray-500">No files uploaded.</div>}
      {!loading && files.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Uploaded</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-3">{f.file_name}</td>
                  <td className="p-3">
                    {new Date(f.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => viewFile(f.file_path || "", f.file_name || "file")}
                        disabled={!f.file_path || viewLoading}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-gray-100"
                        onClick={() =>
                          downloadFile(f.file_path || "", f.file_name || "file")
                        }
                        disabled={!f.file_path}
                      >
                        Download
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-red-50 hover:text-red-700"
                        onClick={() => deleteFile(f.id, f.file_path || "")}
                        disabled={!f.file_path}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="truncate pr-4 text-sm font-medium text-gray-900">{preview.name}</h2>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="overflow-auto p-4">
              {preview.type === "image" ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="mx-auto max-h-[75vh] max-w-full object-contain"
                />
              ) : (
                <iframe src={preview.url} title={preview.name} className="h-[75vh] w-full rounded border" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

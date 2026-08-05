"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { archiveFileRecord } from "@/app/(app)/archive/actions"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { BackButton } from "@/components/BackButton"
import { FileUploadButton } from "@/components/shared/FileUploadButton"
import { FilePreviewModal } from "@/components/shared/FilePreviewModal"

type FileRow = {
  id: number
  applicant_id: number
  file_name: string | null
  file_path: string | null
  created_at: string
}

const BUCKET = "applicant files"

export default function ApplicantFilesPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const applicantId = Number(params.id)

  const [files, setFiles] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<{ url: string; name: string; pdf: boolean } | null>(null)

  async function loadFiles() {
    setLoading(true)
    const { data, error } = await supabase
      .from("applicant_files")
      .select("*")
      .eq("applicant_id", applicantId)
      .is("archived_at", null)
      .order("created_at", { ascending: false })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    if (data) setFiles(data as FileRow[])
    setLoading(false)
  }

  async function signedUrl(path: string) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60)
    if (error || !data?.signedUrl) {
      alert(error?.message || "Could not open file.")
      return null
    }
    return data.signedUrl
  }

  async function viewFile(path: string, name: string) {
    const lower = name.toLowerCase()
    const pdf = lower.endsWith(".pdf")
    const image = /\.(jpe?g|png)$/.test(lower)
    if (!pdf && !image) {
      alert("Use Download for this file.")
      return
    }
    const url = await signedUrl(path)
    if (url) setPreview({ url, name, pdf })
  }

  async function downloadFile(path: string, name: string) {
    const url = await signedUrl(path)
    if (!url) return

    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = name || "file"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  }

  async function archiveFile(fileId: number, fileName: string) {
    if (!confirm(`Are you sure you want to archive ${fileName}?`)) return

    const result = await archiveFileRecord("applicant_files", fileId, applicantId)
    if (result.error) {
      alert(result.error.message || "Failed to archive file")
      return
    }

    await loadFiles()
    router.refresh()
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
        .is("archived_at", null)
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }
      if (data) setFiles(data as FileRow[])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [applicantId, supabase])

  if (isNaN(applicantId)) return <div className="text-red-500">Invalid applicant ID</div>

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Applicant Files</h1>

        <div className="flex items-center gap-3">
          <FileUploadButton
            entityId={applicantId}
            storageBucket="applicant files"
            filesTable="applicant_files"
            entityIdColumn="applicant_id"
            onUploadSuccess={loadFiles}
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
                  <td className="p-3">{new Date(f.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => viewFile(f.file_path || "", f.file_name || "file")}
                        disabled={!f.file_path}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-gray-100"
                        onClick={() => downloadFile(f.file_path || "", f.file_name || "file")}
                        disabled={!f.file_path}
                      >
                        Download
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border hover:bg-orange-50 hover:text-orange-700"
                        onClick={() => archiveFile(f.id, f.file_name || "file")}
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FilePreviewModal preview={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

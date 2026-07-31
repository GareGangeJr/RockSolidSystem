"use client"

import { archiveRecord } from "@/app/(app)/archive/actions"
import type { ArchivableTable } from "@/lib/archive"
import { Archive } from "lucide-react"
import { useRouter } from "next/navigation"

type ArchiveButtonProps = {
  table: ArchivableTable
  id: number
  name: string
  className?: string
  label?: string
}

export function ArchiveButton({ table, id, name, className, label }: ArchiveButtonProps) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm("Are you sure you want to archive this?")) return

    const result = await archiveRecord(table, id)
    if (result.error) {
      alert(result.error.message || "Failed to archive record")
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded p-1 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
      }
      title="Archive"
    >
      <Archive className="h-4 w-4" />
      {label ? <span>{label}</span> : null}
    </button>
  )
}

"use client"

import { useState, type ReactNode } from "react"

type CollapsibleSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mb-3 flex w-full items-center justify-between border-b border-gray-100 pb-2 text-left"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
        <span className="text-xs text-gray-500">{open ? "Minimize" : "Show"}</span>
      </button>
      {open && children}
    </div>
  )
}

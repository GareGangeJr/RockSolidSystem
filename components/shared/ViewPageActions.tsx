import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import type { ReactNode } from "react"

type ViewPageActionsProps = {
  editHref?: string
  backHref: string
  children?: ReactNode
}

const linkClassName = "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"

export function ViewPageActions({ editHref, backHref, children }: ViewPageActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
      {editHref && (
        <Link href={editHref} className={linkClassName}>
          Edit
        </Link>
      )}
      <BackButton href={backHref} />
    </div>
  )
}

export { linkClassName as viewPageLinkClassName }

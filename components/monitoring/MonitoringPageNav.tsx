import Link from "next/link"
import { viewPageLinkClassName } from "@/components/shared/ViewPageActions"

type MonitoringPageNavProps = {
  id: number
  current: "view" | "edit" | "concerns"
}

export function MonitoringPageNav({ id, current }: MonitoringPageNavProps) {
  const links = [
    { key: "view" as const, href: `/monitoring/${id}`, label: "View" },
    { key: "edit" as const, href: `/monitoring/${id}/edit`, label: "Edit Deployment" },
    { key: "concerns" as const, href: `/monitoring/${id}/concerns`, label: "Concerns & History" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) =>
        link.key === current ? (
          <span
            key={link.key}
            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"
          >
            {link.label}
          </span>
        ) : (
          <Link key={link.key} href={link.href} className={viewPageLinkClassName}>
            {link.label}
          </Link>
        )
      )}
    </div>
  )
}

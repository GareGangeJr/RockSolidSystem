import Link from "next/link"

const backButtonClassName =
  "rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"

export function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} className={backButtonClassName}>
      Back
    </Link>
  )
}

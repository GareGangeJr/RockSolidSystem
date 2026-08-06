"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { JobOrder } from "@/types/entities"

type PublicJobOrder = Pick<JobOrder, "id" | "company" | "country" | "job_title" | "no_workers">

export function PublicJobOrderTable({ jobOrders }: { jobOrders: PublicJobOrder[] }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return jobOrders
    return jobOrders.filter((row) => {
      const haystack = [`jo-${row.id}`, row.company, row.country, row.job_title]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [jobOrders, search])

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-3 text-base"
      />

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No open job orders available right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((row) => (
            <li key={row.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">JO-{row.id}</p>
              <h2 className="mt-1 text-base font-semibold text-gray-900">{row.job_title ?? "Job opening"}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {[row.company, row.country].filter(Boolean).join(" · ") || "--"}
              </p>
              {row.no_workers != null && (
                <p className="mt-1 text-sm text-gray-500">{row.no_workers} workers needed</p>
              )}
              <Link
                href={`/apply/job-orders/${row.id}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                View & Apply
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

"use client"

import { useMemo, useState, type ReactNode } from "react"

export type TableFilter<T> = {
  id: string
  label: string
  options: readonly string[]
  match: (row: T, value: string) => boolean
}

export type TableColumn<T> = {
  header: string
  cell: (row: T) => ReactNode
}

type SearchTableProps<T> = {
  rows: T[]
  rowKey: (row: T) => string | number
  searchPlaceholder: string
  searchMatch: (row: T, query: string) => boolean
  filters?: TableFilter<T>[]
  columns: TableColumn<T>[]
  emptyMessage?: string
}

export function SearchTable<T>({
  rows,
  rowKey,
  searchPlaceholder,
  searchMatch,
  filters = [],
  columns,
  emptyMessage = "No records found.",
}: SearchTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.id, "All"]))
  )

  const filtered = useMemo(() => {
    let list = rows
    const query = search.trim().toLowerCase()
    if (query) list = list.filter((row) => searchMatch(row, query))
    for (const filter of filters) {
      const value = filterValues[filter.id]
      if (value && value !== "All") {
        list = list.filter((row) => filter.match(row, value))
      }
    }
    return list
  }, [rows, search, filterValues, filters, searchMatch])

  function clearFilters() {
    setSearch("")
    setFilterValues(Object.fromEntries(filters.map((f) => [f.id, "All"])))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {filters.map((filter) => (
          <select
            key={filter.id}
            value={filterValues[filter.id] ?? "All"}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, [filter.id]: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="All">{filter.label}: All</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="p-3 text-left font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={rowKey(row)} className="border-t border-gray-100">
                {columns.map((col) => (
                  <td key={col.header} className="p-3">
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

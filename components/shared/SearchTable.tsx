"use client"

import { useMemo, useState, type ReactNode } from "react"
import { isDeploymentInDateRange } from "@/lib/reports/date-range"
import { cn } from "@/lib/utils"

export type TableFilter<T> = {
  id: string
  label: string
  options: readonly string[]
  match: (row: T, value: string) => boolean
}

export type DateRangeFilterConfig<T> = {
  fields: readonly { value: string; label: string }[]
  defaultField: string
  getDates: (row: T, field: string) => string[]
}

export type TableColumn<T> = {
  header: string
  cell: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

type SearchTableProps<T> = {
  rows: T[]
  rowKey: (row: T) => string | number
  searchPlaceholder: string
  searchMatch: (row: T, query: string) => boolean
  filters?: TableFilter<T>[]
  dateRangeFilter?: DateRangeFilterConfig<T>
  columns: TableColumn<T>[]
  emptyMessage?: string
  tableClassName?: string
}

const dateInputClass =
  "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export function SearchTable<T>({
  rows,
  rowKey,
  searchPlaceholder,
  searchMatch,
  filters = [],
  dateRangeFilter,
  columns,
  emptyMessage = "No records found.",
  tableClassName,
}: SearchTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.id, "All"]))
  )
  const [dateField, setDateField] = useState(dateRangeFilter?.defaultField ?? "")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

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
    if (dateRangeFilter && (dateFrom || dateTo)) {
      list = list.filter((row) => {
        const dates = dateRangeFilter.getDates(row, dateField)
        if (dates.length === 0) return false
        return dates.some((day) => isDeploymentInDateRange(day, dateFrom || null, dateTo || null))
      })
    }
    return list
  }, [rows, search, filterValues, filters, dateRangeFilter, dateField, dateFrom, dateTo, searchMatch])

  function clearFilters() {
    setSearch("")
    setFilterValues(Object.fromEntries(filters.map((f) => [f.id, "All"])))
    if (dateRangeFilter) {
      setDateField(dateRangeFilter.defaultField)
      setDateFrom("")
      setDateTo("")
    }
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
        {dateRangeFilter && (
          <>
            <select
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              aria-label="Date field"
            >
              {dateRangeFilter.fields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className={dateInputClass}
              aria-label="From date"
              title="From date"
            />
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className={dateInputClass}
              aria-label="To date"
              title="To date"
            />
          </>
        )}
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className={cn("w-full text-sm", tableClassName)}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={cn(
                    "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={rowKey(row)} className="border-t border-gray-100 hover:bg-slate-50/80">
                {columns.map((col) => (
                  <td key={col.header} className={cn("px-4 py-4 align-middle text-gray-800", col.className)}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
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

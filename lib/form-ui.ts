export const fieldClassSm =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-2 sm:text-sm"

export const labelClassSm = "block text-sm font-medium text-gray-700"

export const sectionTitleClassSm =
  "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

export const formGridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"

export function displayValue(value: unknown): string {
  if (value == null || value === "") return ""
  return String(value)
}

export function displayDate(value: unknown): string {
  return displayValue(value).slice(0, 10)
}

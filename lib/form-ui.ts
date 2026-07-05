export const fieldClass =
  "mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export const fieldClassSm =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export const labelClass = "block text-base font-medium text-gray-700"
export const labelClassSm = "block text-sm font-medium text-gray-700"

export const sectionTitleClass =
  "mb-4 border-b border-gray-100 pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500"

export const sectionTitleClassSm =
  "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

export function displayValue(value: unknown): string {
  if (value == null || value === "") return ""
  return String(value)
}

export function displayDate(value: unknown): string {
  return displayValue(value).slice(0, 10)
}

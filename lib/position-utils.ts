import { POSITION_OTHER_VALUE } from "@/lib/status-options"

export function resolvePositionFromForm(
  formData: FormData,
  fieldName: string,
  options: { required?: boolean } = {}
): string {
  const value = ((formData.get(fieldName) as string) || "").trim()

  if (value === POSITION_OTHER_VALUE) {
    throw new Error(`Custom position is required for ${fieldName}`)
  }

  if (options.required && !value) {
    throw new Error(`Position is required for ${fieldName}`)
  }

  return value
}

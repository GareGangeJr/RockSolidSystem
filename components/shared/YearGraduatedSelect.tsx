import { fieldClassSm } from "@/lib/form-ui"
import { GRADUATION_YEAR_OPTIONS } from "@/lib/form-select-options"

type YearGraduatedSelectProps = {
  name: string
  defaultValue?: string
  className?: string
}

function getOptions(savedValue?: string) {
  if (savedValue && !GRADUATION_YEAR_OPTIONS.includes(savedValue)) {
    return [savedValue, ...GRADUATION_YEAR_OPTIONS]
  }
  return GRADUATION_YEAR_OPTIONS
}

export function YearGraduatedSelect({
  name,
  defaultValue,
  className = fieldClassSm,
}: YearGraduatedSelectProps) {
  const options = getOptions(defaultValue)

  return (
    <select name={name} className={className} defaultValue={defaultValue ?? ""}>
      <option value="">Select year</option>
      {options.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  )
}

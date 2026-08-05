import { fieldClassSm } from "@/lib/form-ui"
import { COUNTRY_OPTIONS } from "@/lib/form-select-options"

type CountrySelectProps = {
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
  required?: boolean
}

function getOptions(savedValue?: string) {
  if (savedValue && !(COUNTRY_OPTIONS as readonly string[]).includes(savedValue)) {
    return [savedValue, ...COUNTRY_OPTIONS]
  }
  return COUNTRY_OPTIONS
}

export function CountrySelect({
  name,
  value,
  defaultValue,
  onChange,
  className = fieldClassSm,
  required = false,
}: CountrySelectProps) {
  const isControlled = value !== undefined
  const savedValue = isControlled ? value : defaultValue
  const options = getOptions(savedValue)

  return (
    <select
      name={name}
      className={className}
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? savedValue ?? "" : undefined}
      required={required}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    >
      <option value="">Select country</option>
      {options.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  )
}

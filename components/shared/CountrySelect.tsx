import { fieldClassSm } from "@/lib/form-ui"
import { COUNTRY_OPTIONS } from "@/lib/form-select-options"

type CountrySelectProps = {
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
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
  disabled = false,
  className = fieldClassSm,
  required = false,
}: CountrySelectProps) {
  const isControlled = value !== undefined
  const savedValue = isControlled ? value : defaultValue
  const options = getOptions(savedValue)

  return (
    <>
      {disabled && isControlled && name && <input type="hidden" name={name} value={value} />}
      <select
        name={disabled || !name ? undefined : name}
        className={`${className}${disabled ? " cursor-not-allowed bg-gray-50 text-gray-600" : ""}`}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? savedValue ?? "" : undefined}
        disabled={disabled}
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
    </>
  )
}

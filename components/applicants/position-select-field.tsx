"use client"

import { useState } from "react"
import { POSITION_OPTIONS, POSITION_OTHER_VALUE, DEFAULT_POSITION, isPredefinedPosition } from "@/lib/status-options"

const inputFieldStyles =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-sm font-medium text-gray-700"

type PositionSelectFieldProps = {
  name: string
  label: string
  required?: boolean
  defaultValue?: string
}

function getInitialState(defaultValue?: string) {
  const value = (defaultValue ?? "").trim() || DEFAULT_POSITION
  if (!value) {
    return { selected: DEFAULT_POSITION, otherText: "" }
  }
  if (isPredefinedPosition(value)) {
    return { selected: value, otherText: "" }
  }
  return { selected: POSITION_OTHER_VALUE, otherText: value }
}

export function PositionSelectField({
  name,
  label,
  required = false,
  defaultValue,
}: PositionSelectFieldProps) {
  const initial = getInitialState(defaultValue)
  const [selected, setSelected] = useState(initial.selected)
  const [otherText, setOtherText] = useState(initial.otherText)

  const isOther = selected === POSITION_OTHER_VALUE
  const submittedValue = isOther ? otherText.trim() : selected

  const handleSelectChange = (value: string) => {
    setSelected(value)
    if (value !== POSITION_OTHER_VALUE) {
      setOtherText("")
    }
  }

  return (
    <div>
      <label className={labelStyles}>{label}</label>
      <select
        className={inputFieldStyles}
        value={selected}
        onChange={(e) => handleSelectChange(e.target.value)}
        required={required}
      >
        {POSITION_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value={POSITION_OTHER_VALUE}>{POSITION_OTHER_VALUE}</option>
      </select>
      {isOther && (
        <input
          className={inputFieldStyles}
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder="Ex: Waiter"
          required
        />
      )}
      <input type="hidden" name={name} value={submittedValue} />
    </div>
  )
}

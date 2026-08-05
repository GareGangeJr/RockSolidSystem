"use client"

import type { InputHTMLAttributes } from "react"

type NumericInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  allowDecimal?: boolean
  allowedChars?: string
}

function sanitize(value: string, allowDecimal: boolean, allowedChars: string) {
  let next = ""
  let seenDot = false

  for (const char of value) {
    if (char >= "0" && char <= "9") {
      next += char
      continue
    }
    if (allowDecimal && char === "." && !seenDot) {
      next += char
      seenDot = true
      continue
    }
    if (allowedChars.includes(char)) {
      next += char
    }
  }

  return next
}

export function NumericInput({
  allowDecimal = false,
  allowedChars = "",
  onChange,
  ...props
}: NumericInputProps) {
  return (
    <input
      {...props}
      type="text"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      onChange={(event) => {
        const cleaned = sanitize(event.target.value, allowDecimal, allowedChars)
        if (event.target.value !== cleaned) {
          event.target.value = cleaned
        }
        onChange?.(event)
      }}
    />
  )
}

"use client"

import { useMemo, useState } from "react"
import { labelClassSm } from "@/lib/form-ui"
import { APPLICANT_SKILL_OPTIONS } from "@/lib/status-options"

type SkillsChecklistFieldProps = {
  name?: string
  label?: string
  defaultValue?: string
  required?: boolean
}

function parseSkills(value?: string) {
  if (!value) return []
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
}

export function SkillsChecklistField({
  name = "skills",
  label = "Skills",
  defaultValue,
  required = false,
}: SkillsChecklistFieldProps) {
  const initialSelected = useMemo(() => parseSkills(defaultValue), [defaultValue])

  const options = useMemo(() => {
    const extras = initialSelected.filter(
      (skill) => !(APPLICANT_SKILL_OPTIONS as readonly string[]).includes(skill)
    )
    return [...APPLICANT_SKILL_OPTIONS, ...extras]
  }, [initialSelected])

  const [selected, setSelected] = useState(initialSelected)

  function toggleSkill(skill: string) {
    setSelected((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    )
  }

  const submittedValue = selected.join(", ")

  return (
    <div className="col-span-full">
      <label className={labelClassSm}>{label}</label>
      <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((skill) => {
          const checked = selected.includes(skill)
          return (
            <label
              key={skill}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                checked
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleSkill(skill)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{skill}</span>
            </label>
          )
        })}
      </div>
      {required && selected.length === 0 && (
        <p className="mt-2 text-xs text-gray-500">Select at least one skill.</p>
      )}
      <input type="hidden" name={name} value={submittedValue} required={required} />
    </div>
  )
}

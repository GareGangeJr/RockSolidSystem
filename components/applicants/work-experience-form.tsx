"use client"

import { useState } from "react"

export type WorkExperienceItem = {
  country: string
  company: string
  position: string
  date_started: string
  date_ended: string
}

const inputFieldStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-sm font-medium text-gray-700"

const emptyWork: WorkExperienceItem = {
  country: "",
  company: "",
  position: "",
  date_started: "",
  date_ended: "",
}

export function WorkExperienceForm({ initial = [] }: { initial?: WorkExperienceItem[] }) {
  const [works, setWorks] = useState<WorkExperienceItem[]>(initial.length > 0 ? initial : [emptyWork])

  const addWork = () => setWorks((prev) => [...prev, { ...emptyWork }])
  const removeWork = (index: number) => setWorks((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="space-y-4">
      {works.map((work, index) => (
        <div key={index} className="rounded-md border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">WORK {index + 1}</span>
            <button
              type="button"
              onClick={() => removeWork(index)}
              disabled={works.length <= 1}
              className="text-xs text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Country</label>
              <input
                className={inputFieldStyles}
                value={work.country}
                onChange={(e) =>
                  setWorks((prev) => {
                    const next = [...prev]
                    next[index] = { ...next[index], country: e.target.value }
                    return next
                  })
                }
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Company</label>
              <input
                className={inputFieldStyles}
                value={work.company}
                onChange={(e) =>
                  setWorks((prev) => {
                    const next = [...prev]
                    next[index] = { ...next[index], company: e.target.value }
                    return next
                  })
                }
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Position</label>
              <input
                className={inputFieldStyles}
                value={work.position}
                onChange={(e) =>
                  setWorks((prev) => {
                    const next = [...prev]
                    next[index] = { ...next[index], position: e.target.value }
                    return next
                  })
                }
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Date Started</label>
              <input
                type="date"
                className={inputFieldStyles}
                value={work.date_started}
                onChange={(e) =>
                  setWorks((prev) => {
                    const next = [...prev]
                    next[index] = { ...next[index], date_started: e.target.value }
                    return next
                  })
                }
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Date Ended</label>
              <input
                type="date"
                className={inputFieldStyles}
                value={work.date_ended}
                onChange={(e) =>
                  setWorks((prev) => {
                    const next = [...prev]
                    next[index] = { ...next[index], date_ended: e.target.value }
                    return next
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addWork}
        className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
      >
        + Add Work Experience
      </button>
      <input type="hidden" name="work_experiences" value={JSON.stringify(works)} />
    </div>
  )
}

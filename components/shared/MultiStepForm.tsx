"use client"

import Link from "next/link"
import { Children, useRef, useState, useTransition, type ReactNode } from "react"

type MultiStepFormProps = {
  steps: readonly string[]
  submitLabel: string
  cancelHref?: string
  hiddenFields?: ReactNode
  onSubmit: (formData: FormData) => void | Promise<{ error?: string } | void>
  children: ReactNode
}

export function MultiStepForm({
  steps,
  submitLabel,
  cancelHref,
  hiddenFields,
  onSubmit,
  children,
}: MultiStepFormProps) {
  const panels = Children.toArray(children)
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  const isLastStep = step === steps.length - 1

  function validateStep(index: number) {
    const panel = panelRefs.current[index]
    if (!panel) return true
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input[required], select[required], textarea[required]"
    )
    for (const field of fields) {
      if (!field.reportValidity()) return false
    }
    return true
  }

  function goTo(index: number) {
    setStep(index)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleNext() {
    if (!validateStep(step)) return
    goTo(Math.min(step + 1, steps.length - 1))
  }

  function handleBack() {
    goTo(Math.max(step - 1, 0))
  }

  function handleSaveClick() {
    if (!validateStep(step)) return
    formRef.current?.requestSubmit()
  }

  async function handleSubmit(formData: FormData) {
    if (!isLastStep) return
    setError("")
    startTransition(async () => {
      const result = await onSubmit(formData)
      if (result && "error" in result && result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <form
        ref={formRef}
        action={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white shadow-sm"
        onSubmit={(e) => {
          if (!isLastStep || isPending) e.preventDefault()
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || isLastStep) return
          const target = e.target
          if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
            e.preventDefault()
            handleNext()
          }
        }}
      >
        {hiddenFields}

        <header className="border-b border-gray-100 bg-gray-50/80 px-6 py-5">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
            Step {step + 1} of {steps.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {steps.map((label, index) => {
              const active = index === step
              const done = index < step
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => done && goTo(index)}
                  disabled={index > step}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : done
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}. {label}
                </button>
              )
            })}
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </header>

        <div className="p-8">
          {panels.map((panel, index) => (
            <div
              key={steps[index]}
              ref={(el) => {
                panelRefs.current[index] = el
              }}
              className={step === index ? "space-y-6" : "hidden"}
            >
              {panel}
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {cancelHref && (
              <Link
                href={cancelHref}
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            )}
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isPending}
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : submitLabel}
              </button>
            )}
          </div>
        </footer>
      </form>
    </>
  )
}

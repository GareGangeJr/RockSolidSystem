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

        <header className="border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-1 text-sm font-medium text-gray-500">
            Step {step + 1} of {steps.length}
          </p>
          <p className="mb-3 text-base font-semibold text-gray-900">{steps[step]}</p>
          <div className="flex gap-1.5">
            {steps.map((label, index) => {
              const active = index === step
              const done = index < step
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => done && goTo(index)}
                  disabled={index > step}
                  aria-label={`Step ${index + 1}: ${label}`}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    active || done ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )
            })}
          </div>
        </header>

        <div className="p-4 sm:p-8">
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

        <footer className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-gray-100 bg-white px-4 py-3 sm:static sm:bg-gray-50/50 sm:px-8 sm:py-5">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 sm:px-6"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            {cancelHref && (
              <Link
                href={cancelHref}
                className="hidden rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 sm:inline-flex"
              >
                Cancel
              </Link>
            )}
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700 sm:px-6"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isPending}
                className="rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
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

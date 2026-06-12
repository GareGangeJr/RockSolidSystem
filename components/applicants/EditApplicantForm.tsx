"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { updateApplicant } from "@/app/(app)/applicants/actions"
import {
  STATUS_OPTIONS,
  APPLICANT_TYPE_OPTIONS,
  BRANCH_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  GENDER_OPTIONS,
  SPEAKING_LEVEL_OPTIONS,
  DEFAULT_BRANCH,
  DEFAULT_CIVIL_STATUS,
  DEFAULT_GENDER,
  DEFAULT_SPEAKING_LEVEL,
  DEFAULT_APPLICANT_TYPE,
  DEFAULT_STATUS,
} from "@/lib/status-options"
import { WorkExperienceForm } from "@/components/applicants/work-experience-form"
import { PositionSelectField } from "@/components/applicants/position-select-field"

const STEPS = [
  "Application",
  "Personal Info",
  "Family & Contacts",
  "Education & Work",
  "Skills & Final",
] as const

const inputFieldStyles =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
const labelStyles = "block text-sm font-medium text-gray-700"
const sectionHeaderStyles =
  "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

const formatValue = (x: unknown): string => (x != null && x !== "" ? String(x) : "")

type WorkExperience = {
  country?: string
  company?: string
  position?: string
  date_started?: string
  date_ended?: string
}

type EditApplicantFormProps = {
  applicant: Record<string, unknown>
}

export function EditApplicantForm({ applicant }: EditApplicantFormProps) {
  const [step, setStep] = useState(0)
  const [submitReady, setSubmitReady] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const goToStep = (nextStep: number) => {
    if (nextStep === STEPS.length - 1) {
      setSubmitReady(false)
      setTimeout(() => setSubmitReady(true), 200)
    }
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const validateCurrentStep = () => {
    const panel = stepRefs.current[step]
    if (!panel) return true

    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      "input[required], select[required]"
    )
    for (const field of fields) {
      if (!field.reportValidity()) return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    goToStep(Math.min(step + 1, STEPS.length - 1))
  }

  const handleBack = () => goToStep(Math.max(step - 1, 0))

  const handleSave = () => {
    if (!submitReady || !validateCurrentStep()) return

    const form = formRef.current
    if (form) {
      const statusSelect = form.querySelector<HTMLSelectElement>('select[name="status"]')
      const newStatus = statusSelect?.value ?? ""
      const currentStatus = formatValue(applicant.status) || DEFAULT_STATUS
      if (
        (newStatus === "Deployed" || newStatus === "Deployed(With Concerns)") &&
        newStatus !== currentStatus &&
        !confirm(
          `Are you sure you want to change status to "${newStatus}"? This will add the applicant to the Monitoring page.`
        )
      ) {
        return
      }
    }

    formRef.current?.requestSubmit()
  }

  const stepPanelClass = (index: number) => (step === index ? "space-y-6" : "hidden")

  const workExperiences = ((applicant.work_experiences as WorkExperience[]) ?? []).map((w) => ({
    country: formatValue(w.country),
    company: formatValue(w.company),
    position: formatValue(w.position),
    date_started: formatValue(w.date_started)?.slice(0, 10) ?? "",
    date_ended: formatValue(w.date_ended)?.slice(0, 10) ?? "",
  }))

  return (
    <form
      ref={formRef}
      action={updateApplicant}
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
      onSubmit={(e) => {
        if (step !== STEPS.length - 1 || !submitReady) e.preventDefault()
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" || step === STEPS.length - 1) return
        const target = e.target
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
          e.preventDefault()
          handleNext()
        }
      }}
    >
      <input type="hidden" name="id" value={Number(applicant.id)} />

      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Step {step + 1} of {STEPS.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, index) => {
            const isActive = index === step
            const isDone = index < step
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (index < step) goToStep(index)
                }}
                disabled={index > step}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDone
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}. {label}
              </button>
            )
          })}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        <div ref={(el) => { stepRefs.current[0] = el }} className={stepPanelClass(0)}>
          <h2 className={sectionHeaderStyles}>Application Details</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <PositionSelectField
                name="position_applied"
                label="Position Applied For"
                required
                defaultValue={formatValue(applicant.position_applied)}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <PositionSelectField
                name="second_choice_position"
                label="Second Choice"
                defaultValue={formatValue(applicant.second_choice_position)}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Preferred Branch</label>
              <select
                name="preferred_branch"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.preferred_branch) || DEFAULT_BRANCH}
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Country Applying For</label>
              <input
                name="country_applying_for"
                type="text"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.country_applying_for)}
              />
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[1] = el }} className={stepPanelClass(1)}>
          <h2 className={sectionHeaderStyles}>Personal Information</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Last Name</label>
              <input name="last_name" className={inputFieldStyles} required defaultValue={formatValue(applicant.last_name)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>First Name</label>
              <input name="first_name" className={inputFieldStyles} required defaultValue={formatValue(applicant.first_name)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Middle Name</label>
              <input name="middle_name" className={inputFieldStyles} defaultValue={formatValue(applicant.middle_name)} />
            </div>
            <div className="col-span-12 md:col-span-8">
              <label className={labelStyles}>Current Complete Address</label>
              <input name="current_address" className={inputFieldStyles} defaultValue={formatValue(applicant.current_address)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Provincial Address</label>
              <input name="provincial_address" className={inputFieldStyles} defaultValue={formatValue(applicant.provincial_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Contact Number</label>
              <input name="contact_number" className={inputFieldStyles} defaultValue={formatValue(applicant.contact_number)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Active Cellphone</label>
              <input name="active_cellphone" className={inputFieldStyles} defaultValue={formatValue(applicant.active_cellphone)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Email</label>
              <input name="email" type="email" className={inputFieldStyles} defaultValue={formatValue(applicant.email)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Date of Birth</label>
              <input
                name="date_of_birth"
                type="date"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.date_of_birth)?.slice(0, 10) ?? ""}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Place of Birth</label>
              <input name="place_of_birth" className={inputFieldStyles} defaultValue={formatValue(applicant.place_of_birth)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Religion</label>
              <input name="religion" className={inputFieldStyles} defaultValue={formatValue(applicant.religion)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Civil Status</label>
              <select
                name="civil_status"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.civil_status) || DEFAULT_CIVIL_STATUS}
              >
                {CIVIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Sex</label>
              <select name="gender" className={inputFieldStyles} defaultValue={formatValue(applicant.gender) || DEFAULT_GENDER}>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Height (cm)</label>
              <input
                name="height_cm"
                type="number"
                step="0.01"
                className={inputFieldStyles}
                defaultValue={applicant.height_cm != null ? String(applicant.height_cm) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Weight (kg)</label>
              <input
                name="weight_kg"
                type="number"
                step="0.01"
                className={inputFieldStyles}
                defaultValue={applicant.weight_kg != null ? String(applicant.weight_kg) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Facebook Account</label>
              <input name="facebook_account" className={inputFieldStyles} defaultValue={formatValue(applicant.facebook_account)} />
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[2] = el }} className={stepPanelClass(2)}>
          <h2 className={sectionHeaderStyles}>Family Information</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Mother Full Name</label>
              <input name="mother_full_name" className={inputFieldStyles} defaultValue={formatValue(applicant.mother_full_name)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Mother Contact</label>
              <input name="mother_contact" className={inputFieldStyles} defaultValue={formatValue(applicant.mother_contact)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Father Full Name</label>
              <input name="father_full_name" className={inputFieldStyles} defaultValue={formatValue(applicant.father_full_name)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Father Contact</label>
              <input name="father_contact" className={inputFieldStyles} defaultValue={formatValue(applicant.father_contact)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Spouse Name</label>
              <input name="spouse_name" className={inputFieldStyles} defaultValue={formatValue(applicant.spouse_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Spouse Age</label>
              <input
                name="spouse_age"
                type="number"
                className={inputFieldStyles}
                defaultValue={applicant.spouse_age != null ? String(applicant.spouse_age) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Spouse Contact</label>
              <input name="spouse_contact" className={inputFieldStyles} defaultValue={formatValue(applicant.spouse_contact)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Number of Children</label>
              <input
                name="number_of_children"
                type="number"
                className={inputFieldStyles}
                defaultValue={applicant.number_of_children != null ? String(applicant.number_of_children) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Children Ages</label>
              <input name="children_ages" className={inputFieldStyles} defaultValue={formatValue(applicant.children_ages)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Children Caretaker</label>
              <input name="children_caretaker" className={inputFieldStyles} defaultValue={formatValue(applicant.children_caretaker)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Name</label>
              <input name="emergency_contact_name" className={inputFieldStyles} defaultValue={formatValue(applicant.emergency_contact_name)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Relationship</label>
              <input
                name="emergency_contact_relationship"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.emergency_contact_relationship)}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Contact Number</label>
              <input name="emergency_contact_number" className={inputFieldStyles} defaultValue={formatValue(applicant.emergency_contact_number)} />
            </div>
            <div className="col-span-12">
              <label className={labelStyles}>Address</label>
              <input name="emergency_contact_address" className={inputFieldStyles} defaultValue={formatValue(applicant.emergency_contact_address)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Beneficiaries</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Beneficiary 1 Name</label>
              <input name="beneficiary1_name" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary1_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>DOB</label>
              <input
                name="beneficiary1_dob"
                type="date"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.beneficiary1_dob)?.slice(0, 10) ?? ""}
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Age</label>
              <input
                name="beneficiary1_age"
                type="number"
                className={inputFieldStyles}
                defaultValue={applicant.beneficiary1_age != null ? String(applicant.beneficiary1_age) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Relationship</label>
              <input name="beneficiary1_relationship" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary1_relationship)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Contact</label>
              <input name="beneficiary1_contact" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary1_contact)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Beneficiary 2 Name</label>
              <input name="beneficiary2_name" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary2_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>DOB</label>
              <input
                name="beneficiary2_dob"
                type="date"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.beneficiary2_dob)?.slice(0, 10) ?? ""}
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Age</label>
              <input
                name="beneficiary2_age"
                type="number"
                className={inputFieldStyles}
                defaultValue={applicant.beneficiary2_age != null ? String(applicant.beneficiary2_age) : ""}
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Relationship</label>
              <input name="beneficiary2_relationship" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary2_relationship)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelStyles}>Contact</label>
              <input name="beneficiary2_contact" className={inputFieldStyles} defaultValue={formatValue(applicant.beneficiary2_contact)} />
            </div>
          </div>
        </div>

        <div ref={(el) => { stepRefs.current[3] = el }} className={stepPanelClass(3)}>
          <h2 className={sectionHeaderStyles}>Educational Background</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Elementary School</label>
              <input name="elementary_school" className={inputFieldStyles} defaultValue={formatValue(applicant.elementary_school)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Elementary Address</label>
              <input name="elementary_address" className={inputFieldStyles} defaultValue={formatValue(applicant.elementary_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Year Graduated</label>
              <input name="elementary_year_graduated" className={inputFieldStyles} defaultValue={formatValue(applicant.elementary_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>High School</label>
              <input name="high_school" className={inputFieldStyles} defaultValue={formatValue(applicant.high_school)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>High School Address</label>
              <input name="high_school_address" className={inputFieldStyles} defaultValue={formatValue(applicant.high_school_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Year Graduated</label>
              <input name="high_school_year_graduated" className={inputFieldStyles} defaultValue={formatValue(applicant.high_school_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Vocational Course</label>
              <input name="vocational_course" className={inputFieldStyles} defaultValue={formatValue(applicant.vocational_course)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>Vocational School</label>
              <input name="vocational_school" className={inputFieldStyles} defaultValue={formatValue(applicant.vocational_school)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Year Graduated</label>
              <input name="vocational_year_graduated" className={inputFieldStyles} defaultValue={formatValue(applicant.vocational_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>College Course</label>
              <input name="college_course" className={inputFieldStyles} defaultValue={formatValue(applicant.college_course)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelStyles}>College School</label>
              <input name="college_school" className={inputFieldStyles} defaultValue={formatValue(applicant.college_school)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Year Graduated</label>
              <input name="college_year_graduated" className={inputFieldStyles} defaultValue={formatValue(applicant.college_year_graduated)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Work Experience</h2>
          <WorkExperienceForm initial={workExperiences} />
        </div>

        <div ref={(el) => { stepRefs.current[4] = el }} className={stepPanelClass(4)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <h2 className={sectionHeaderStyles}>Skills</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyles}>Years of Experience</label>
                  <input
                    name="years_of_exp"
                    type="number"
                    min={0}
                    className={inputFieldStyles}
                    defaultValue={applicant.years_of_exp != null ? Number(applicant.years_of_exp) : 0}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Skills (comma-separated)</label>
                  <input
                    name="skills"
                    className={inputFieldStyles}
                    placeholder="Ex: Cooking, Child Care, Driving"
                    defaultValue={formatValue(applicant.skills)}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Notes</label>
                  <input name="notes" className={inputFieldStyles} defaultValue={formatValue(applicant.notes)} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h2 className={sectionHeaderStyles}>Speaking Language</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyles}>English Level</label>
                  <select
                    name="english_level"
                    className={inputFieldStyles}
                    defaultValue={formatValue(applicant.english_level) || DEFAULT_SPEAKING_LEVEL}
                  >
                    {SPEAKING_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Arabic Level</label>
                  <select
                    name="arabic_level"
                    className={inputFieldStyles}
                    defaultValue={formatValue(applicant.arabic_level) || DEFAULT_SPEAKING_LEVEL}
                  >
                    {SPEAKING_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h2 className={sectionHeaderStyles}>Passport Details</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyles}>Passport Number</label>
                  <input name="passport_number" className={inputFieldStyles} defaultValue={formatValue(applicant.passport_number)} />
                </div>
                <div>
                  <label className={labelStyles}>Date Issued</label>
                  <input
                    name="passport_date_issued"
                    type="date"
                    className={inputFieldStyles}
                    defaultValue={formatValue(applicant.passport_date_issued)?.slice(0, 10) ?? ""}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Date Expired</label>
                  <input
                    name="passport_date_expired"
                    type="date"
                    className={inputFieldStyles}
                    defaultValue={formatValue(applicant.passport_date_expired)?.slice(0, 10) ?? ""}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Place Issued</label>
                  <input name="passport_place_issued" className={inputFieldStyles} defaultValue={formatValue(applicant.passport_place_issued)} />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionHeaderStyles}>Interview</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <label className={labelStyles}>Remarks</label>
              <input name="interview_remarks" className={inputFieldStyles} defaultValue={formatValue(applicant.interview_remarks)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Interviewer Name</label>
              <input name="interviewer_name" className={inputFieldStyles} defaultValue={formatValue(applicant.interviewer_name)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelStyles}>Date Interviewed</label>
              <input
                name="date_interviewed"
                type="date"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.date_interviewed)?.slice(0, 10) ?? ""}
              />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Applicant Type</label>
              <select
                name="applicant_type"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.applicant_type) || DEFAULT_APPLICANT_TYPE}
              >
                {APPLICANT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Status</label>
              <select name="status" className={inputFieldStyles} defaultValue={formatValue(applicant.status) || DEFAULT_STATUS}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelStyles}>Date Applied</label>
              <input
                name="date_applied"
                type="date"
                className={inputFieldStyles}
                defaultValue={formatValue(applicant.date_applied)?.slice(0, 10) ?? ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
        <div>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href="/applicants"
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!submitReady}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Update Applicant
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

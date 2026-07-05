"use client"

import { useState } from "react"
import { addApplicant, updateApplicant } from "@/app/(app)/applicants/actions"
import { submitOnlineApplication } from "@/app/apply/actions"
import { MultiStepForm } from "@/components/shared/MultiStepForm"
import {
  displayDate,
  displayValue,
  fieldClassSm,
  labelClassSm,
  sectionTitleClassSm,
} from "@/lib/form-ui"
import { DEPLOYED_STATUSES } from "@/lib/applicant-workflow"
import {
  STATUS_OPTIONS,
  APPLICANT_TYPE_OPTIONS,
  ONLINE_APPLICANT_TYPE,
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
import {
  JobOrderSelectField,
  type OpenJobOrderOption,
} from "@/components/applicants/job-order-select-field"
import type { Applicant, WorkExperience } from "@/types/entities"

const STEPS = [
  "Application",
  "Personal Info",
  "Family & Contacts",
  "Education & Work",
  "Skills & Final",
] as const

type ApplicantFormProps = {
  mode?: "admin" | "public"
  applicant?: Applicant
  openJobOrders?: OpenJobOrderOption[]
  defaultJobOrderId?: number
  defaultCountryApplyingFor?: string
}

export function ApplicantForm({
  mode = "admin",
  applicant,
  openJobOrders = [],
  defaultJobOrderId,
  defaultCountryApplyingFor,
}: ApplicantFormProps) {
  const isEdit = Boolean(applicant)
  const isPublic = !isEdit && mode === "public"

  const workExperiences = isEdit
    ? ((applicant!.work_experiences as WorkExperience[]) ?? []).map((w) => ({
        country: displayValue(w.country),
        company: displayValue(w.company),
        position: displayValue(w.position),
        date_started: displayDate(w.date_started),
        date_ended: displayDate(w.date_ended),
      }))
    : []

  const val = (field: unknown) => (isEdit ? displayValue(field as string | null) : undefined)
  const dat = (field: unknown) => (isEdit ? displayDate(field as string | null) : undefined)

  async function handleSubmit(formData: FormData) {
    if (isPublic) return submitOnlineApplication(formData)
    if (isEdit) {
      const newStatus = String(formData.get("status") ?? "")
      const currentStatus = displayValue(applicant!.status) || DEFAULT_STATUS
      if (
        DEPLOYED_STATUSES.has(newStatus) &&
        newStatus !== currentStatus &&
        !confirm(`Change status to "${newStatus}"?`)
      ) {
        return
      }
      return updateApplicant(formData)
    }
    return addApplicant(formData)
  }

  const [countryApplyingFor, setCountryApplyingFor] = useState(
    defaultCountryApplyingFor ?? val(applicant?.country_applying_for) ?? ""
  )
  const [selectedJobOrderId, setSelectedJobOrderId] = useState<number | null>(defaultJobOrderId ?? null)
  const countryLocked = !isEdit && selectedJobOrderId !== null

  const applicantTypes = isEdit
    ? APPLICANT_TYPE_OPTIONS
    : APPLICANT_TYPE_OPTIONS.filter((opt) => opt !== ONLINE_APPLICANT_TYPE)

  return (
    <MultiStepForm
      steps={STEPS}
      submitLabel={isEdit ? "Save Changes" : isPublic ? "Submit Application" : "Save Applicant"}
      cancelHref={isEdit ? `/applicants/${applicant!.id}` : undefined}
      onSubmit={handleSubmit}
      hiddenFields={isEdit ? <input type="hidden" name="id" value={applicant!.id} /> : undefined}
    >
      <section>
          <h2 className={sectionTitleClassSm}>Application Details</h2>
          <div className="grid grid-cols-12 gap-4">
            {isPublic && openJobOrders.length > 0 && (
              <JobOrderSelectField
                jobOrders={openJobOrders}
                defaultJobOrderId={defaultJobOrderId}
                onJobOrderChange={(job) => {
                  setSelectedJobOrderId(job?.id ?? null)
                  setCountryApplyingFor(job?.country ?? "")
                }}
              />
            )}
            <div className="col-span-12 md:col-span-6">
              <PositionSelectField
                name="position_applied"
                label="Position Applied For"
                required
                defaultValue={val(applicant?.position_applied)}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <PositionSelectField
                name="second_choice_position"
                label="Second Choice"
                defaultValue={val(applicant?.second_choice_position)}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Preferred Branch</label>
              <select
                name="preferred_branch"
                className={fieldClassSm}
                defaultValue={val(applicant?.preferred_branch) || DEFAULT_BRANCH}
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Country Applying For</label>
              <input
                name="country_applying_for"
                type="text"
                className={`${fieldClassSm}${countryLocked ? " cursor-not-allowed bg-gray-50 text-gray-600" : ""}`}
                value={countryApplyingFor}
                readOnly={countryLocked}
                onChange={(e) => {
                  if (!countryLocked) setCountryApplyingFor(e.target.value)
                }}
              />
            </div>
          </div>
        </section>

      <section>
          <h2 className={sectionTitleClassSm}>Personal Information</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Last Name</label>
              <input name="last_name" className={fieldClassSm} required defaultValue={val(applicant?.last_name)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>First Name</label>
              <input name="first_name" className={fieldClassSm} required defaultValue={val(applicant?.first_name)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Middle Name</label>
              <input name="middle_name" className={fieldClassSm} defaultValue={val(applicant?.middle_name)} />
            </div>
            <div className="col-span-12 md:col-span-8">
              <label className={labelClassSm}>Current Complete Address</label>
              <input name="current_address" className={fieldClassSm} defaultValue={val(applicant?.current_address)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Provincial Address</label>
              <input name="provincial_address" className={fieldClassSm} defaultValue={val(applicant?.provincial_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Contact Number</label>
              <input name="contact_number" className={fieldClassSm} defaultValue={val(applicant?.contact_number)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Active Cellphone</label>
              <input name="active_cellphone" className={fieldClassSm} defaultValue={val(applicant?.active_cellphone)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Email</label>
              <input name="email" type="email" className={fieldClassSm} defaultValue={val(applicant?.email)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Date of Birth</label>
              <input name="date_of_birth" type="date" className={fieldClassSm} defaultValue={dat(applicant?.date_of_birth)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Place of Birth</label>
              <input name="place_of_birth" className={fieldClassSm} defaultValue={val(applicant?.place_of_birth)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Religion</label>
              <input name="religion" className={fieldClassSm} defaultValue={val(applicant?.religion)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Civil Status</label>
              <select
                name="civil_status"
                className={fieldClassSm}
                defaultValue={val(applicant?.civil_status) || DEFAULT_CIVIL_STATUS}
              >
                {CIVIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Sex</label>
              <select name="gender" className={fieldClassSm} defaultValue={val(applicant?.gender) || DEFAULT_GENDER}>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Height (cm)</label>
              <input name="height_cm" type="number" step="0.01" className={fieldClassSm} defaultValue={val(applicant?.height_cm)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Weight (kg)</label>
              <input name="weight_kg" type="number" step="0.01" className={fieldClassSm} defaultValue={val(applicant?.weight_kg)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Facebook Account</label>
              <input name="facebook_account" className={fieldClassSm} defaultValue={val(applicant?.facebook_account)} />
            </div>
          </div>
        </section>

      <section>
          <h2 className={sectionTitleClassSm}>Family Information</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Mother Full Name</label>
              <input name="mother_full_name" className={fieldClassSm} defaultValue={val(applicant?.mother_full_name)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Mother Contact</label>
              <input name="mother_contact" className={fieldClassSm} defaultValue={val(applicant?.mother_contact)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Father Full Name</label>
              <input name="father_full_name" className={fieldClassSm} defaultValue={val(applicant?.father_full_name)} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className={labelClassSm}>Father Contact</label>
              <input name="father_contact" className={fieldClassSm} defaultValue={val(applicant?.father_contact)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Spouse Name</label>
              <input name="spouse_name" className={fieldClassSm} defaultValue={val(applicant?.spouse_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Spouse Age</label>
              <input name="spouse_age" type="number" className={fieldClassSm} defaultValue={val(applicant?.spouse_age)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Spouse Contact</label>
              <input name="spouse_contact" className={fieldClassSm} defaultValue={val(applicant?.spouse_contact)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Number of Children</label>
              <input name="number_of_children" type="number" className={fieldClassSm} defaultValue={val(applicant?.number_of_children)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Children Ages</label>
              <input name="children_ages" className={fieldClassSm} defaultValue={val(applicant?.children_ages)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Children Caretaker</label>
              <input name="children_caretaker" className={fieldClassSm} defaultValue={val(applicant?.children_caretaker)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionTitleClassSm}>Emergency Contact</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Name</label>
              <input name="emergency_contact_name" className={fieldClassSm} defaultValue={val(applicant?.emergency_contact_name)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Relationship</label>
              <input name="emergency_contact_relationship" className={fieldClassSm} defaultValue={val(applicant?.emergency_contact_relationship)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Contact Number</label>
              <input name="emergency_contact_number" className={fieldClassSm} defaultValue={val(applicant?.emergency_contact_number)} />
            </div>
            <div className="col-span-12">
              <label className={labelClassSm}>Address</label>
              <input name="emergency_contact_address" className={fieldClassSm} defaultValue={val(applicant?.emergency_contact_address)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionTitleClassSm}>Beneficiaries</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Beneficiary 1 Name</label>
              <input name="beneficiary1_name" className={fieldClassSm} defaultValue={val(applicant?.beneficiary1_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>DOB</label>
              <input name="beneficiary1_dob" type="date" className={fieldClassSm} defaultValue={dat(applicant?.beneficiary1_dob)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Age</label>
              <input name="beneficiary1_age" type="number" className={fieldClassSm} defaultValue={val(applicant?.beneficiary1_age)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Relationship</label>
              <input name="beneficiary1_relationship" className={fieldClassSm} defaultValue={val(applicant?.beneficiary1_relationship)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Contact</label>
              <input name="beneficiary1_contact" className={fieldClassSm} defaultValue={val(applicant?.beneficiary1_contact)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Beneficiary 2 Name</label>
              <input name="beneficiary2_name" className={fieldClassSm} defaultValue={val(applicant?.beneficiary2_name)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>DOB</label>
              <input name="beneficiary2_dob" type="date" className={fieldClassSm} defaultValue={dat(applicant?.beneficiary2_dob)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Age</label>
              <input name="beneficiary2_age" type="number" className={fieldClassSm} defaultValue={val(applicant?.beneficiary2_age)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Relationship</label>
              <input name="beneficiary2_relationship" className={fieldClassSm} defaultValue={val(applicant?.beneficiary2_relationship)} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <label className={labelClassSm}>Contact</label>
              <input name="beneficiary2_contact" className={fieldClassSm} defaultValue={val(applicant?.beneficiary2_contact)} />
            </div>
          </div>
        </section>

      <section>
          <h2 className={sectionTitleClassSm}>Educational Background</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Elementary School</label>
              <input name="elementary_school" className={fieldClassSm} defaultValue={val(applicant?.elementary_school)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Elementary Address</label>
              <input name="elementary_address" className={fieldClassSm} defaultValue={val(applicant?.elementary_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Year Graduated</label>
              <input name="elementary_year_graduated" className={fieldClassSm} defaultValue={val(applicant?.elementary_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>High School</label>
              <input name="high_school" className={fieldClassSm} defaultValue={val(applicant?.high_school)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>High School Address</label>
              <input name="high_school_address" className={fieldClassSm} defaultValue={val(applicant?.high_school_address)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Year Graduated</label>
              <input name="high_school_year_graduated" className={fieldClassSm} defaultValue={val(applicant?.high_school_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>Vocational Course</label>
              <input name="vocational_course" className={fieldClassSm} defaultValue={val(applicant?.vocational_course)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>Vocational School</label>
              <input name="vocational_school" className={fieldClassSm} defaultValue={val(applicant?.vocational_school)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Year Graduated</label>
              <input name="vocational_year_graduated" className={fieldClassSm} defaultValue={val(applicant?.vocational_year_graduated)} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className={labelClassSm}>College Course</label>
              <input name="college_course" className={fieldClassSm} defaultValue={val(applicant?.college_course)} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <label className={labelClassSm}>College School</label>
              <input name="college_school" className={fieldClassSm} defaultValue={val(applicant?.college_school)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className={labelClassSm}>Year Graduated</label>
              <input name="college_year_graduated" className={fieldClassSm} defaultValue={val(applicant?.college_year_graduated)} />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className={sectionTitleClassSm}>Work Experience</h2>
          <WorkExperienceForm initial={workExperiences} />
        </section>

      <section>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <h2 className={sectionTitleClassSm}>Skills</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClassSm}>Years of Experience</label>
                  <input
                    name="years_of_exp"
                    type="number"
                    min={0}
                    defaultValue={isEdit && applicant?.years_of_exp != null ? Number(applicant.years_of_exp) : 0}
                    className={fieldClassSm}
                  />
                </div>
                <div>
                  <label className={labelClassSm}>Skills (comma-separated)</label>
                  <input name="skills" className={fieldClassSm} placeholder="Ex: Cooking, Child Care, Driving" defaultValue={val(applicant?.skills)} />
                </div>
                <div>
                  <label className={labelClassSm}>Notes</label>
                  <input name="notes" className={fieldClassSm} defaultValue={val(applicant?.notes)} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h2 className={sectionTitleClassSm}>Speaking Language</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClassSm}>English Level</label>
                  <select name="english_level" className={fieldClassSm} defaultValue={val(applicant?.english_level) || DEFAULT_SPEAKING_LEVEL}>
                    {SPEAKING_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClassSm}>Arabic Level</label>
                  <select name="arabic_level" className={fieldClassSm} defaultValue={val(applicant?.arabic_level) || DEFAULT_SPEAKING_LEVEL}>
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
              <h2 className={sectionTitleClassSm}>Passport Details</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClassSm}>Passport Number</label>
                  <input name="passport_number" className={fieldClassSm} defaultValue={val(applicant?.passport_number)} />
                </div>
                <div>
                  <label className={labelClassSm}>Date Issued</label>
                  <input name="passport_date_issued" type="date" className={fieldClassSm} defaultValue={dat(applicant?.passport_date_issued)} />
                </div>
                <div>
                  <label className={labelClassSm}>Date Expired</label>
                  <input name="passport_date_expired" type="date" className={fieldClassSm} defaultValue={dat(applicant?.passport_date_expired)} />
                </div>
                <div>
                  <label className={labelClassSm}>Place Issued</label>
                  <input name="passport_place_issued" className={fieldClassSm} defaultValue={val(applicant?.passport_place_issued)} />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {!isPublic && (
            <>
              <h2 className={sectionTitleClassSm}>Interview</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClassSm}>Remarks</label>
                  <input name="interview_remarks" className={fieldClassSm} defaultValue={val(applicant?.interview_remarks)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClassSm}>Interviewer Name</label>
                  <input name="interviewer_name" className={fieldClassSm} defaultValue={val(applicant?.interviewer_name)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClassSm}>Date Interviewed</label>
                  <input name="date_interviewed" type="date" className={fieldClassSm} defaultValue={dat(applicant?.date_interviewed)} />
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
            </>
          )}

          <div className="grid grid-cols-12 gap-4">
            {isPublic ? (
              <input type="hidden" name="applicant_type" value={ONLINE_APPLICANT_TYPE} />
            ) : (
              <div className="col-span-12 md:col-span-4">
                <label className={labelClassSm}>Applicant Type</label>
                <select
                  name="applicant_type"
                  className={fieldClassSm}
                  defaultValue={val(applicant?.applicant_type) || DEFAULT_APPLICANT_TYPE}
                >
                  {applicantTypes.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!isPublic && (
              <>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClassSm}>Status</label>
                  <select name="status" className={fieldClassSm} defaultValue={val(applicant?.status) || DEFAULT_STATUS}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClassSm}>Date Applied</label>
                  <input name="date_applied" type="date" className={fieldClassSm} defaultValue={dat(applicant?.date_applied)} />
                </div>
              </>
            )}
          </div>
        </section>
    </MultiStepForm>
  )
}

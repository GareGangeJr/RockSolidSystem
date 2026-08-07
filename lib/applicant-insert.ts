import { resolvePositionFromForm } from "@/lib/position-utils"

const getOptionalString = (formData: FormData, key: string) => (formData.get(key) as string) || ""

function optionalDate(value: FormDataEntryValue | null | undefined): string | null {
  if (value == null) return null
  const trimmed = String(value).trim()
  return trimmed || null
}

function sanitizeWorkExperiences(items: WorkExperienceItem[]): WorkExperienceItem[] {
  return items.map((item) => ({
    ...item,
    date_started: item.date_started?.trim() || undefined,
    date_ended: item.date_ended?.trim() || undefined,
  }))
}

type WorkExperienceItem = {
  country?: string
  company?: string
  position?: string
  date_started?: string
  date_ended?: string
}

function parseWorkExperiences(formData: FormData): WorkExperienceItem[] {
  const raw = formData.get("work_experiences") as string | null
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as WorkExperienceItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getAgeFromDob(dob: string | null): number | null {
  if (!dob || dob.length < 10) return null
  const [year, month, day] = dob.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return null
  const today = new Date()
  let age = today.getFullYear() - year
  const monthDiff = today.getMonth() + 1 - month
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age--
  return age < 0 ? null : age
}

const MIN_APPLICANT_AGE = 18

export type ApplicantInsertPayload = Record<string, unknown>

export function buildApplicantInsertPayload(
  formData: FormData,
  overrides?: { status?: string; date_applied?: string | null; applicant_type?: string }
): ApplicantInsertPayload {
  const works = sanitizeWorkExperiences(
    parseWorkExperiences(formData).filter(
      (w) => w.country || w.company || w.position || w.date_started || w.date_ended
    )
  )

  const positionApplied = resolvePositionFromForm(formData, "position_applied", { required: true })
  const secondChoicePosition = resolvePositionFromForm(formData, "second_choice_position")
  const dob = optionalDate(formData.get("date_of_birth"))
  const age = getAgeFromDob(dob)

  if (dob && (age === null || age < MIN_APPLICANT_AGE)) {
    throw new Error("Applicants must be at least 18 years old.")
  }

  return {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: positionApplied,
    status: overrides?.status ?? ((formData.get("status") as string) || "New Applicant"),
    applicant_type: overrides?.applicant_type ?? ((formData.get("applicant_type") as string) || "Domestic Helper"),
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,
    second_choice_position: secondChoicePosition || null,
    preferred_branch: getOptionalString(formData, "preferred_branch"),
    country_applying_for: getOptionalString(formData, "country_applying_for"),
    current_address: getOptionalString(formData, "current_address"),
    provincial_address: getOptionalString(formData, "provincial_address"),
    active_cellphone: getOptionalString(formData, "active_cellphone"),
    date_of_birth: dob,
    age,
    place_of_birth: getOptionalString(formData, "place_of_birth"),
    religion: getOptionalString(formData, "religion"),
    civil_status: getOptionalString(formData, "civil_status"),
    gender: getOptionalString(formData, "gender"),
    height_cm: Number(formData.get("height_cm")) || null,
    weight_kg: Number(formData.get("weight_kg")) || null,
    facebook_account: getOptionalString(formData, "facebook_account"),
    mother_full_name: getOptionalString(formData, "mother_full_name"),
    mother_contact: getOptionalString(formData, "mother_contact"),
    father_full_name: getOptionalString(formData, "father_full_name"),
    father_contact: getOptionalString(formData, "father_contact"),
    spouse_name: getOptionalString(formData, "spouse_name"),
    spouse_age: Number(formData.get("spouse_age")) || null,
    spouse_contact: getOptionalString(formData, "spouse_contact"),
    number_of_children: Number(formData.get("number_of_children")) || null,
    children_ages: getOptionalString(formData, "children_ages"),
    children_caretaker: getOptionalString(formData, "children_caretaker"),
    emergency_contact_name: getOptionalString(formData, "emergency_contact_name"),
    emergency_contact_relationship: getOptionalString(formData, "emergency_contact_relationship"),
    emergency_contact_number: getOptionalString(formData, "emergency_contact_number"),
    emergency_contact_address: getOptionalString(formData, "emergency_contact_address"),
    beneficiary1_name: getOptionalString(formData, "beneficiary1_name"),
    beneficiary1_dob: optionalDate(formData.get("beneficiary1_dob")),
    beneficiary1_age: Number(formData.get("beneficiary1_age")) || null,
    beneficiary1_relationship: getOptionalString(formData, "beneficiary1_relationship"),
    beneficiary1_contact: getOptionalString(formData, "beneficiary1_contact"),
    beneficiary2_name: getOptionalString(formData, "beneficiary2_name"),
    beneficiary2_dob: optionalDate(formData.get("beneficiary2_dob")),
    beneficiary2_age: Number(formData.get("beneficiary2_age")) || null,
    beneficiary2_relationship: getOptionalString(formData, "beneficiary2_relationship"),
    beneficiary2_contact: getOptionalString(formData, "beneficiary2_contact"),
    elementary_school: getOptionalString(formData, "elementary_school"),
    elementary_address: getOptionalString(formData, "elementary_address"),
    elementary_year_graduated: getOptionalString(formData, "elementary_year_graduated"),
    high_school: getOptionalString(formData, "high_school"),
    high_school_address: getOptionalString(formData, "high_school_address"),
    high_school_year_graduated: getOptionalString(formData, "high_school_year_graduated"),
    vocational_course: getOptionalString(formData, "vocational_course"),
    vocational_school: getOptionalString(formData, "vocational_school"),
    vocational_year_graduated: getOptionalString(formData, "vocational_year_graduated"),
    college_course: getOptionalString(formData, "college_course"),
    college_school: getOptionalString(formData, "college_school"),
    college_year_graduated: getOptionalString(formData, "college_year_graduated"),
    english_level: getOptionalString(formData, "english_level"),
    arabic_level: getOptionalString(formData, "arabic_level"),
    passport_number: getOptionalString(formData, "passport_number"),
    passport_date_issued: optionalDate(formData.get("passport_date_issued")),
    passport_date_expired: optionalDate(formData.get("passport_date_expired")),
    passport_place_issued: getOptionalString(formData, "passport_place_issued"),
    interview_remarks: getOptionalString(formData, "interview_remarks"),
    interviewer_name: getOptionalString(formData, "interviewer_name"),
    date_interviewed: optionalDate(formData.get("date_interviewed")),
    date_applied: optionalDate(overrides?.date_applied ?? formData.get("date_applied")),
    work_experiences: works,
  }
}

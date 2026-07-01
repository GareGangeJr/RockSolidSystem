"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { buildApplicantInsertPayload } from "@/lib/applicant-insert"
import {
  applyApplicantStatusChange,
  DEPLOYED_STATUSES,
} from "@/lib/applicant-workflow"
import { resolvePositionFromForm } from "@/lib/position-utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const getOptionalString = (formData: FormData, key: string) => (formData.get(key) as string) || ""

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
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age < 0 ? null : age
}

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()

  let payload
  try {
    payload = buildApplicantInsertPayload(formData)
  } catch (error) {
    console.error("Invalid position fields:", error)
    redirect("/applicants/add")
  }

  const { data: inserted, error: insertError } = await supabase.from("applicants").insert(payload).select("id").single()

  if (insertError || !inserted) {
    console.error("Error inserting applicant:", insertError)
    revalidatePath("/applicants")
    redirect("/applicants")
  }

  const initialStatus = (payload.status as string) || "New Applicant"
  if (DEPLOYED_STATUSES.has(initialStatus)) {
    const statusResult = await applyApplicantStatusChange(supabase, inserted.id, initialStatus, "New Applicant")
    if (statusResult.error) {
      redirect(`/applicants/${inserted.id}/edit?error=status&message=${encodeURIComponent(statusResult.error.message)}`)
    }
    revalidatePath("/monitoring")
  }

  revalidatePath("/applicants")
  redirect("/applicants?success=added")
}

export async function updateApplicantStatus(applicantId: number, newStatus: string) {
  const supabase = await createSupabaseServer()
  const { data: current } = await supabase
    .from("applicants")
    .select("status")
    .eq("id", applicantId)
    .maybeSingle()

  if (current?.status === newStatus) {
    return { error: null }
  }

  const result = await applyApplicantStatusChange(supabase, applicantId, newStatus, current?.status)
  if (!result.error) {
    revalidatePath("/applicants")
    revalidatePath("/monitoring")
  }
  return result
}

export async function updateApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  const newStatus = (formData.get("status") as string) || "New Applicant"
  const { data: current } = await supabase.from("applicants").select("status").eq("id", id).maybeSingle()
  const previousStatus = current?.status ?? null

  if (newStatus !== previousStatus) {
    const statusResult = await applyApplicantStatusChange(supabase, id, newStatus, previousStatus)
    if (statusResult.error) {
      redirect(`/applicants/${id}/edit?error=status&message=${encodeURIComponent(statusResult.error.message)}`)
    }
    revalidatePath("/monitoring")
  }

  let positionApplied: string
  let secondChoicePosition: string
  try {
    positionApplied = resolvePositionFromForm(formData, "position_applied", { required: true })
    secondChoicePosition = resolvePositionFromForm(formData, "second_choice_position")
  } catch (error) {
    console.error("Invalid position fields:", error)
    redirect(`/applicants/${id}/edit`)
  }

  await supabase.from("applicants").update({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: positionApplied,
    applicant_type: (formData.get("applicant_type") as string) || "Domestic Helper",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,

    second_choice_position: secondChoicePosition,
    preferred_branch: formData.get("preferred_branch") as string,
    country_applying_for: formData.get("country_applying_for") as string,
    current_address: formData.get("current_address") as string,
    provincial_address: formData.get("provincial_address") as string,
    active_cellphone: formData.get("active_cellphone") as string,
    date_of_birth: formData.get("date_of_birth") || null,
    age: getAgeFromDob((formData.get("date_of_birth") as string) || null),
    place_of_birth: formData.get("place_of_birth") as string,
    religion: formData.get("religion") as string,
    civil_status: formData.get("civil_status") as string,
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
    beneficiary1_dob: formData.get("beneficiary1_dob") || null,
    beneficiary1_age: Number(formData.get("beneficiary1_age")) || null,
    beneficiary1_relationship: getOptionalString(formData, "beneficiary1_relationship"),
    beneficiary1_contact: getOptionalString(formData, "beneficiary1_contact"),
    beneficiary2_name: getOptionalString(formData, "beneficiary2_name"),
    beneficiary2_dob: formData.get("beneficiary2_dob") || null,
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
    passport_date_issued: formData.get("passport_date_issued") || null,
    passport_date_expired: formData.get("passport_date_expired") || null,
    passport_place_issued: getOptionalString(formData, "passport_place_issued"),

    interview_remarks: getOptionalString(formData, "interview_remarks"),
    interviewer_name: getOptionalString(formData, "interviewer_name"),
    date_interviewed: formData.get("date_interviewed") || null,
    date_applied: formData.get("date_applied") || null,

    work_experiences: parseWorkExperiences(formData).filter((w) => w.country || w.company || w.position || w.date_started || w.date_ended)
  }).eq("id", id)

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants?success=updated")
}

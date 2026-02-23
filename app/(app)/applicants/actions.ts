"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const optStr = (formData: FormData, key: string) => (formData.get(key) as string) || ""

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  await supabase.from("applicants").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: formData.get("position_applied") as string,
    status: (formData.get("status") as string) || "New Applicant",
    applicant_type: (formData.get("applicant_type") as string) || "Domestic Helper",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,

    second_choice_position: optStr(formData, "second_choice_position"),
    preferred_branch: optStr(formData, "preferred_branch"),
    country_applying_for: optStr(formData, "country_applying_for"),
    current_address: optStr(formData, "current_address"),
    provincial_address: optStr(formData, "provincial_address"),
    active_cellphone: optStr(formData, "active_cellphone"),
    active_email: optStr(formData, "active_email"),
    date_of_birth: formData.get("date_of_birth") || null,
    age: Number(formData.get("age")) || null,
    place_of_birth: optStr(formData, "place_of_birth"),
    religion: optStr(formData, "religion"),
    civil_status: optStr(formData, "civil_status"),
    height_cm: Number(formData.get("height_cm")) || null,
    weight_kg: Number(formData.get("weight_kg")) || null,
    facebook_account: optStr(formData, "facebook_account"),
    mother_full_name: optStr(formData, "mother_full_name"),
    mother_contact: optStr(formData, "mother_contact"),
    father_full_name: optStr(formData, "father_full_name"),
    father_contact: optStr(formData, "father_contact"),
    spouse_name: optStr(formData, "spouse_name"),
    spouse_age: Number(formData.get("spouse_age")) || null,
    spouse_contact: optStr(formData, "spouse_contact"),
    number_of_children: Number(formData.get("number_of_children")) || null,
    children_ages: optStr(formData, "children_ages"),
    children_caretaker: optStr(formData, "children_caretaker"),
    emergency_contact_name: optStr(formData, "emergency_contact_name"),
    emergency_contact_relationship: optStr(formData, "emergency_contact_relationship"),
    emergency_contact_number: optStr(formData, "emergency_contact_number"),
    emergency_contact_address: optStr(formData, "emergency_contact_address"),

    beneficiary1_name: optStr(formData, "beneficiary1_name"),
    beneficiary1_dob: formData.get("beneficiary1_dob") || null,
    beneficiary1_age: Number(formData.get("beneficiary1_age")) || null,
    beneficiary1_relationship: optStr(formData, "beneficiary1_relationship"),
    beneficiary1_contact: optStr(formData, "beneficiary1_contact"),
    beneficiary2_name: optStr(formData, "beneficiary2_name"),
    beneficiary2_dob: formData.get("beneficiary2_dob") || null,
    beneficiary2_age: Number(formData.get("beneficiary2_age")) || null,
    beneficiary2_relationship: optStr(formData, "beneficiary2_relationship"),
    beneficiary2_contact: optStr(formData, "beneficiary2_contact"),

    elementary_school: optStr(formData, "elementary_school"),
    elementary_address: optStr(formData, "elementary_address"),
    elementary_year_graduated: optStr(formData, "elementary_year_graduated"),
    high_school: optStr(formData, "high_school"),
    high_school_address: optStr(formData, "high_school_address"),
    high_school_year_graduated: optStr(formData, "high_school_year_graduated"),
    vocational_course: optStr(formData, "vocational_course"),
    vocational_school: optStr(formData, "vocational_school"),
    vocational_year_graduated: optStr(formData, "vocational_year_graduated"),
    college_course: optStr(formData, "college_course"),
    college_school: optStr(formData, "college_school"),
    college_year_graduated: optStr(formData, "college_year_graduated"),

    work1_country: optStr(formData, "work1_country"),
    work1_company: optStr(formData, "work1_company"),
    work1_position: optStr(formData, "work1_position"),
    work1_date_started: formData.get("work1_date_started") || null,
    work1_date_ended: formData.get("work1_date_ended") || null,
    work2_country: optStr(formData, "work2_country"),
    work2_company: optStr(formData, "work2_company"),
    work2_position: optStr(formData, "work2_position"),
    work2_date_started: formData.get("work2_date_started") || null,
    work2_date_ended: formData.get("work2_date_ended") || null,
    work3_country: optStr(formData, "work3_country"),
    work3_company: optStr(formData, "work3_company"),
    work3_position: optStr(formData, "work3_position"),
    work3_date_started: formData.get("work3_date_started") || null,
    work3_date_ended: formData.get("work3_date_ended") || null,

    english_level: optStr(formData, "english_level"),
    arabic_level: optStr(formData, "arabic_level"),
    passport_number: optStr(formData, "passport_number"),
    passport_date_issued: formData.get("passport_date_issued") || null,
    passport_date_expired: formData.get("passport_date_expired") || null,
    passport_place_issued: optStr(formData, "passport_place_issued"),

    interview_remarks: optStr(formData, "interview_remarks"),
    interviewer_name: optStr(formData, "interviewer_name"),
    date_interviewed: formData.get("date_interviewed") || null,
    date_applied: formData.get("date_applied") || null
  })

  revalidatePath("/applicants")
  redirect("/applicants")
}

export async function updateApplicantStatus(applicantId: number, newStatus: string) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from("applicants")
    .update({ status: newStatus })
    .eq("id", applicantId)
  revalidatePath("/applicants")
  return { error }
}

export async function updateApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  await supabase.from("applicants").update({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: formData.get("position_applied") as string,
    status: formData.get("status") as string,
    applicant_type: (formData.get("applicant_type") as string) || "Domestic Helper",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,

    second_choice_position: formData.get("second_choice_position") as string,
    preferred_branch: formData.get("preferred_branch") as string,
    country_applying_for: formData.get("country_applying_for") as string,
    current_address: formData.get("current_address") as string,
    provincial_address: formData.get("provincial_address") as string,
    active_cellphone: formData.get("active_cellphone") as string,
    active_email: formData.get("active_email") as string,
    date_of_birth: formData.get("date_of_birth") || null,
    age: Number(formData.get("age")) || null,
    place_of_birth: formData.get("place_of_birth") as string,
    religion: formData.get("religion") as string,
    civil_status: formData.get("civil_status") as string,
    height_cm: Number(formData.get("height_cm")) || null,
    weight_kg: Number(formData.get("weight_kg")) || null,
    facebook_account: optStr(formData, "facebook_account"),
    mother_full_name: optStr(formData, "mother_full_name"),
    mother_contact: optStr(formData, "mother_contact"),
    father_full_name: optStr(formData, "father_full_name"),
    father_contact: optStr(formData, "father_contact"),
    spouse_name: optStr(formData, "spouse_name"),
    spouse_age: Number(formData.get("spouse_age")) || null,
    spouse_contact: optStr(formData, "spouse_contact"),
    number_of_children: Number(formData.get("number_of_children")) || null,
    children_ages: optStr(formData, "children_ages"),
    children_caretaker: optStr(formData, "children_caretaker"),
    emergency_contact_name: optStr(formData, "emergency_contact_name"),
    emergency_contact_relationship: optStr(formData, "emergency_contact_relationship"),
    emergency_contact_number: optStr(formData, "emergency_contact_number"),
    emergency_contact_address: optStr(formData, "emergency_contact_address"),

    beneficiary1_name: optStr(formData, "beneficiary1_name"),
    beneficiary1_dob: formData.get("beneficiary1_dob") || null,
    beneficiary1_age: Number(formData.get("beneficiary1_age")) || null,
    beneficiary1_relationship: optStr(formData, "beneficiary1_relationship"),
    beneficiary1_contact: optStr(formData, "beneficiary1_contact"),
    beneficiary2_name: optStr(formData, "beneficiary2_name"),
    beneficiary2_dob: formData.get("beneficiary2_dob") || null,
    beneficiary2_age: Number(formData.get("beneficiary2_age")) || null,
    beneficiary2_relationship: optStr(formData, "beneficiary2_relationship"),
    beneficiary2_contact: optStr(formData, "beneficiary2_contact"),

    elementary_school: optStr(formData, "elementary_school"),
    elementary_address: optStr(formData, "elementary_address"),
    elementary_year_graduated: optStr(formData, "elementary_year_graduated"),
    high_school: optStr(formData, "high_school"),
    high_school_address: optStr(formData, "high_school_address"),
    high_school_year_graduated: optStr(formData, "high_school_year_graduated"),
    vocational_course: optStr(formData, "vocational_course"),
    vocational_school: optStr(formData, "vocational_school"),
    vocational_year_graduated: optStr(formData, "vocational_year_graduated"),
    college_course: optStr(formData, "college_course"),
    college_school: optStr(formData, "college_school"),
    college_year_graduated: optStr(formData, "college_year_graduated"),

    work1_country: optStr(formData, "work1_country"),
    work1_company: optStr(formData, "work1_company"),
    work1_position: optStr(formData, "work1_position"),
    work1_date_started: formData.get("work1_date_started") || null,
    work1_date_ended: formData.get("work1_date_ended") || null,
    work2_country: optStr(formData, "work2_country"),
    work2_company: optStr(formData, "work2_company"),
    work2_position: optStr(formData, "work2_position"),
    work2_date_started: formData.get("work2_date_started") || null,
    work2_date_ended: formData.get("work2_date_ended") || null,
    work3_country: optStr(formData, "work3_country"),
    work3_company: optStr(formData, "work3_company"),
    work3_position: optStr(formData, "work3_position"),
    work3_date_started: formData.get("work3_date_started") || null,
    work3_date_ended: formData.get("work3_date_ended") || null,

    english_level: optStr(formData, "english_level"),
    arabic_level: optStr(formData, "arabic_level"),
    passport_number: optStr(formData, "passport_number"),
    passport_date_issued: formData.get("passport_date_issued") || null,
    passport_date_expired: formData.get("passport_date_expired") || null,
    passport_place_issued: optStr(formData, "passport_place_issued"),

    interview_remarks: optStr(formData, "interview_remarks"),
    interviewer_name: optStr(formData, "interviewer_name"),
    date_interviewed: formData.get("date_interviewed") || null,
    date_applied: formData.get("date_applied") || null
  }).eq("id", id)

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants")
}
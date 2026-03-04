"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const getOptionalString = (formData: FormData, key: string) => (formData.get(key) as string) || ""

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

    second_choice_position: getOptionalString(formData, "second_choice_position"),
    preferred_branch: getOptionalString(formData, "preferred_branch"),
    country_applying_for: getOptionalString(formData, "country_applying_for"),
    current_address: getOptionalString(formData, "current_address"),
    provincial_address: getOptionalString(formData, "provincial_address"),
    active_cellphone: getOptionalString(formData, "active_cellphone"),
    active_email: getOptionalString(formData, "active_email"),
    date_of_birth: formData.get("date_of_birth") || null,
    age: Number(formData.get("age")) || null,
    place_of_birth: getOptionalString(formData, "place_of_birth"),
    religion: getOptionalString(formData, "religion"),
    civil_status: getOptionalString(formData, "civil_status"),
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

    work1_country: getOptionalString(formData, "work1_country"),
    work1_company: getOptionalString(formData, "work1_company"),
    work1_position: getOptionalString(formData, "work1_position"),
    work1_date_started: formData.get("work1_date_started") || null,
    work1_date_ended: formData.get("work1_date_ended") || null,
    work2_country: getOptionalString(formData, "work2_country"),
    work2_company: getOptionalString(formData, "work2_company"),
    work2_position: getOptionalString(formData, "work2_position"),
    work2_date_started: formData.get("work2_date_started") || null,
    work2_date_ended: formData.get("work2_date_ended") || null,
    work3_country: getOptionalString(formData, "work3_country"),
    work3_company: getOptionalString(formData, "work3_company"),
    work3_position: getOptionalString(formData, "work3_position"),
    work3_date_started: formData.get("work3_date_started") || null,
    work3_date_ended: formData.get("work3_date_ended") || null,

    english_level: getOptionalString(formData, "english_level"),
    arabic_level: getOptionalString(formData, "arabic_level"),
    passport_number: getOptionalString(formData, "passport_number"),
    passport_date_issued: formData.get("passport_date_issued") || null,
    passport_date_expired: formData.get("passport_date_expired") || null,
    passport_place_issued: getOptionalString(formData, "passport_place_issued"),

    interview_remarks: getOptionalString(formData, "interview_remarks"),
    interviewer_name: getOptionalString(formData, "interviewer_name"),
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
  
  if (error) {
    console.error("Error updating applicant status:", error)
    return { error }
  }
  
  if (newStatus === "Deployed" || newStatus === "Deployed(With Concerns)") {
    const { data: placement, error: placementError } = await supabase
      .from("placements")
      .select("job_order_id")
      .eq("applicant_id", applicantId)
      .maybeSingle()
    
    console.log("Placement found:", placement)
    
    if (placement) {
      const { data: existing } = await supabase
        .from("monitoring")
        .select("id")
        .eq("applicant_id", applicantId)
        .eq("job_order_id", placement.job_order_id)
        .maybeSingle()
      
      console.log("Existing monitoring:", existing)
      
      if (!existing) {
        const { data: newRecord, error: insertError } = await supabase.from("monitoring").insert({
          applicant_id: applicantId,
          job_order_id: placement.job_order_id,
          deployment_status: newStatus,
          deployment_date: new Date().toISOString().split('T')[0],
        }).select()
        
        console.log("New monitoring record created:", newRecord)
        console.log("Insert error (if any):", insertError)
        
        if (insertError) {
          return { error: { message: `Error creating monitoring record: ${insertError.message}` } }
        }
      } else {
        const { error: updateError } = await supabase.from("monitoring").update({
          deployment_status: newStatus,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id)
        
        console.log("Monitoring record updated")
        if (updateError) {
          return { error: { message: `Error updating monitoring record: ${updateError.message}` } }
        }
      }
      
      revalidatePath("/monitoring")
    } else {
      console.error("No placement found for applicant:", applicantId)
      return { error: { message: "Cannot deploy: Applicant is not matched to any job order. Please match them to a job order first." } }
    }
  }
  
  revalidatePath("/applicants")
  return { error: null }
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

    work1_country: getOptionalString(formData, "work1_country"),
    work1_company: getOptionalString(formData, "work1_company"),
    work1_position: getOptionalString(formData, "work1_position"),
    work1_date_started: formData.get("work1_date_started") || null,
    work1_date_ended: formData.get("work1_date_ended") || null,
    work2_country: getOptionalString(formData, "work2_country"),
    work2_company: getOptionalString(formData, "work2_company"),
    work2_position: getOptionalString(formData, "work2_position"),
    work2_date_started: formData.get("work2_date_started") || null,
    work2_date_ended: formData.get("work2_date_ended") || null,
    work3_country: getOptionalString(formData, "work3_country"),
    work3_company: getOptionalString(formData, "work3_company"),
    work3_position: getOptionalString(formData, "work3_position"),
    work3_date_started: formData.get("work3_date_started") || null,
    work3_date_ended: formData.get("work3_date_ended") || null,

    english_level: getOptionalString(formData, "english_level"),
    arabic_level: getOptionalString(formData, "arabic_level"),
    passport_number: getOptionalString(formData, "passport_number"),
    passport_date_issued: formData.get("passport_date_issued") || null,
    passport_date_expired: formData.get("passport_date_expired") || null,
    passport_place_issued: getOptionalString(formData, "passport_place_issued"),

    interview_remarks: getOptionalString(formData, "interview_remarks"),
    interviewer_name: getOptionalString(formData, "interviewer_name"),
    date_interviewed: formData.get("date_interviewed") || null,
    date_applied: formData.get("date_applied") || null
  }).eq("id", id)

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants")
}

export async function deleteApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  await supabase.from("applicants").delete().eq("id", id)

  revalidatePath("/applicants")
  redirect("/applicants")
}
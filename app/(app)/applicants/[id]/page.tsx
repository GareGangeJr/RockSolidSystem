import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"
import { ViewPageActions, viewPageLinkClassName } from "@/components/shared/ViewPageActions"
import { formGridClass } from "@/lib/form-ui"
import { CollapsibleSection } from "@/components/shared/CollapsibleSection"
import Link from "next/link"
import { resolveApplicantType } from "@/lib/status-options"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "--")
const formatDate = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "--")

function getAgeFromDob(dob: unknown): string {
  if (!dob || String(dob).length < 10) return "--"
  const birth = new Date(String(dob).slice(0, 10))
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age < 0 ? "--" : String(age)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id: idParam } = await params
  const id = Number(idParam)

  if (Number.isNaN(id)) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Invalid applicant ID</p>
      <BackButton href="/applicants" />
    </div>
  )

  const { data, error } = await supabase.from("applicants").select("*").eq("id", id).maybeSingle()

  if (error) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Error: {error.message}</p>
      <BackButton href="/applicants" />
    </div>
  )

  if (!data) return (
    <div className="p-6">
      <p className="font-semibold text-red-500">Applicant not found.</p>
      <BackButton href="/applicants" />
    </div>
  )

  const applicant = data as Record<string, unknown>
  const isArchived = Boolean(applicant.archived_at)

  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const gridLayoutStyles = formGridClass

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Applicant</h1>
          {isArchived ? (
            <BackButton href="/archive" />
          ) : (
            <ViewPageActions editHref={`/applicants/${id}/edit`} backHref="/applicants">
              <Link href={`/applicants/${id}/files`} className={viewPageLinkClassName}>
                Files
              </Link>
            </ViewPageActions>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <CollapsibleSection title="Application Details" defaultOpen>
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Position Applied For</span><p className={valueStyles}>{formatValue(applicant.position_applied)}</p></div>
                <div><span className={labelStyles}>Second Choice</span><p className={valueStyles}>{formatValue(applicant.second_choice_position)}</p></div>
                <div><span className={labelStyles}>Preferred Branch</span><p className={valueStyles}>{formatValue(applicant.preferred_branch)}</p></div>
                <div><span className={labelStyles}>Country Applying For</span><p className={valueStyles}>{formatValue(applicant.country_applying_for)}</p></div>
                <div><span className={labelStyles}>Applicant Type</span><p className={valueStyles}>{formatValue(resolveApplicantType(applicant.applicant_type as string, applicant.position_applied as string))}</p></div>
                <div><span className={labelStyles}>Status</span><p className={valueStyles}>{formatValue(applicant.status)}</p></div>
                <div><span className={labelStyles}>Date Applied</span><p className={valueStyles}>{formatDate(applicant.date_applied) !== "--" ? formatDate(applicant.date_applied) : formatDate(applicant.created_at)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Personal Information">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Last Name</span><p className={valueStyles}>{formatValue(applicant.last_name)}</p></div>
                <div><span className={labelStyles}>First Name</span><p className={valueStyles}>{formatValue(applicant.first_name)}</p></div>
                <div><span className={labelStyles}>Middle Name</span><p className={valueStyles}>{formatValue(applicant.middle_name)}</p></div>
                <div><span className={labelStyles}>Current Complete Address</span><p className={valueStyles}>{formatValue(applicant.current_address)}</p></div>
                <div><span className={labelStyles}>Provincial Address</span><p className={valueStyles}>{formatValue(applicant.provincial_address)}</p></div>
                <div><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(applicant.contact_number)}</p></div>
                <div><span className={labelStyles}>Active Cellphone</span><p className={valueStyles}>{formatValue(applicant.active_cellphone)}</p></div>
                <div><span className={labelStyles}>Email</span><p className={valueStyles}>{formatValue(applicant.email)}</p></div>
                <div><span className={labelStyles}>Date of Birth</span><p className={valueStyles}>{formatDate(applicant.date_of_birth)}</p></div>
                <div><span className={labelStyles}>Age</span><p className={valueStyles}>{getAgeFromDob(applicant.date_of_birth)}</p></div>
                <div><span className={labelStyles}>Place of Birth</span><p className={valueStyles}>{formatValue(applicant.place_of_birth)}</p></div>
                <div><span className={labelStyles}>Religion</span><p className={valueStyles}>{formatValue(applicant.religion)}</p></div>
                <div><span className={labelStyles}>Civil Status</span><p className={valueStyles}>{formatValue(applicant.civil_status)}</p></div>
                <div><span className={labelStyles}>Sex</span><p className={valueStyles}>{formatValue(applicant.gender)}</p></div>
                <div><span className={labelStyles}>Height (cm)</span><p className={valueStyles}>{formatValue(applicant.height_cm)}</p></div>
                <div><span className={labelStyles}>Weight (kg)</span><p className={valueStyles}>{formatValue(applicant.weight_kg)}</p></div>
                <div><span className={labelStyles}>Facebook Account</span><p className={valueStyles}>{formatValue(applicant.facebook_account)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Family Information">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Mother Full Name</span><p className={valueStyles}>{formatValue(applicant.mother_full_name)}</p></div>
                <div><span className={labelStyles}>Mother Contact</span><p className={valueStyles}>{formatValue(applicant.mother_contact)}</p></div>
                <div><span className={labelStyles}>Father Full Name</span><p className={valueStyles}>{formatValue(applicant.father_full_name)}</p></div>
                <div><span className={labelStyles}>Father Contact</span><p className={valueStyles}>{formatValue(applicant.father_contact)}</p></div>
                <div><span className={labelStyles}>Spouse Name</span><p className={valueStyles}>{formatValue(applicant.spouse_name)}</p></div>
                <div><span className={labelStyles}>Spouse Age</span><p className={valueStyles}>{formatValue(applicant.spouse_age)}</p></div>
                <div><span className={labelStyles}>Spouse Contact</span><p className={valueStyles}>{formatValue(applicant.spouse_contact)}</p></div>
                <div><span className={labelStyles}>Number of Children</span><p className={valueStyles}>{formatValue(applicant.number_of_children)}</p></div>
                <div><span className={labelStyles}>Children Ages</span><p className={valueStyles}>{formatValue(applicant.children_ages)}</p></div>
                <div><span className={labelStyles}>Children Caretaker</span><p className={valueStyles}>{formatValue(applicant.children_caretaker)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Emergency Contact">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Name</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_name)}</p></div>
                <div><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_relationship)}</p></div>
                <div><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_number)}</p></div>
                <div><span className={labelStyles}>Address</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_address)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Beneficiaries">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Beneficiary 1 Name</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_name)}</p></div>
                <div><span className={labelStyles}>DOB</span><p className={valueStyles}>{formatDate(applicant.beneficiary1_dob)}</p></div>
                <div><span className={labelStyles}>Age</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_age)}</p></div>
                <div><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_relationship)}</p></div>
                <div><span className={labelStyles}>Contact</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_contact)}</p></div>
                <div><span className={labelStyles}>Beneficiary 2 Name</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_name)}</p></div>
                <div><span className={labelStyles}>DOB</span><p className={valueStyles}>{formatDate(applicant.beneficiary2_dob)}</p></div>
                <div><span className={labelStyles}>Age</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_age)}</p></div>
                <div><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_relationship)}</p></div>
                <div><span className={labelStyles}>Contact</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_contact)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Educational Background">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Elementary School</span><p className={valueStyles}>{formatValue(applicant.elementary_school)}</p></div>
                <div><span className={labelStyles}>Elementary Address</span><p className={valueStyles}>{formatValue(applicant.elementary_address)}</p></div>
                <div><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.elementary_year_graduated)}</p></div>
                <div><span className={labelStyles}>High School</span><p className={valueStyles}>{formatValue(applicant.high_school)}</p></div>
                <div><span className={labelStyles}>High School Address</span><p className={valueStyles}>{formatValue(applicant.high_school_address)}</p></div>
                <div><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.high_school_year_graduated)}</p></div>
                <div><span className={labelStyles}>Vocational Course</span><p className={valueStyles}>{formatValue(applicant.vocational_course)}</p></div>
                <div><span className={labelStyles}>Vocational School</span><p className={valueStyles}>{formatValue(applicant.vocational_school)}</p></div>
                <div><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.vocational_year_graduated)}</p></div>
                <div><span className={labelStyles}>College Course</span><p className={valueStyles}>{formatValue(applicant.college_course)}</p></div>
                <div><span className={labelStyles}>College School</span><p className={valueStyles}>{formatValue(applicant.college_school)}</p></div>
                <div><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.college_year_graduated)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Work Experience">
              <div className="space-y-4">
                {((applicant.work_experiences as { country?: string; company?: string; position?: string; date_started?: string; date_ended?: string }[]) ?? []).length === 0 ? (
                  <p className="text-sm text-gray-500">No work experience recorded.</p>
                ) : (
                  ((applicant.work_experiences as { country?: string; company?: string; position?: string; date_started?: string; date_ended?: string }[]) ?? []).map((w, idx) => (
                    <div key={idx} className="rounded-md border border-gray-200 p-4">
                      <div className="mb-2 text-xs font-bold text-gray-600">WORK {idx + 1}</div>
                      <div className={gridLayoutStyles}>
                        <div><span className={labelStyles}>Country</span><p className={valueStyles}>{formatValue(w.country)}</p></div>
                        <div><span className={labelStyles}>Company</span><p className={valueStyles}>{formatValue(w.company)}</p></div>
                        <div><span className={labelStyles}>Position</span><p className={valueStyles}>{formatValue(w.position)}</p></div>
                        <div><span className={labelStyles}>Date Started</span><p className={valueStyles}>{formatDate(w.date_started)}</p></div>
                        <div><span className={labelStyles}>Date Ended</span><p className={valueStyles}>{formatDate(w.date_ended)}</p></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Skills">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Years of Experience</span><p className={valueStyles}>{formatValue(applicant.years_of_exp)}</p></div>
                <div><span className={labelStyles}>Skills</span><p className={valueStyles}>{formatValue(applicant.skills)}</p></div>
                <div><span className={labelStyles}>Notes</span><p className={valueStyles}>{formatValue(applicant.notes)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Speaking Language">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>English Level</span><p className={valueStyles}>{formatValue(applicant.english_level)}</p></div>
                <div><span className={labelStyles}>Arabic Level</span><p className={valueStyles}>{formatValue(applicant.arabic_level)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Passport Details">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Passport Number</span><p className={valueStyles}>{formatValue(applicant.passport_number)}</p></div>
                <div><span className={labelStyles}>Date Issued</span><p className={valueStyles}>{formatDate(applicant.passport_date_issued)}</p></div>
                <div><span className={labelStyles}>Date Expired</span><p className={valueStyles}>{formatDate(applicant.passport_date_expired)}</p></div>
                <div><span className={labelStyles}>Place Issued</span><p className={valueStyles}>{formatValue(applicant.passport_place_issued)}</p></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Interview">
              <div className={gridLayoutStyles}>
                <div><span className={labelStyles}>Remarks</span><p className={valueStyles}>{formatValue(applicant.interview_remarks)}</p></div>
                <div><span className={labelStyles}>Interviewer Name</span><p className={valueStyles}>{formatValue(applicant.interviewer_name)}</p></div>
                <div><span className={labelStyles}>Date Interviewed</span><p className={valueStyles}>{formatDate(applicant.date_interviewed)}</p></div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  )
}

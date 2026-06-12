import { createSupabaseServer } from "@/lib/supabase/server"
import { BackButton } from "@/components/BackButton"

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

  const labelStyles = "block text-xs font-medium text-gray-500"
  const valueStyles = "mt-0.5 text-sm text-gray-900"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridLayoutStyles = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Applicant</h1>
          <BackButton href="/applicants" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <div className={gridLayoutStyles}>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Position Applied For</span>
                  <p className={valueStyles}>{formatValue(applicant.position_applied)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Second Choice</span>
                  <p className={valueStyles}>{formatValue(applicant.second_choice_position)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Preferred Branch</span>
                  <p className={valueStyles}>{formatValue(applicant.preferred_branch)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelStyles}>Country Applying For</span>
                  <p className={valueStyles}>{formatValue(applicant.country_applying_for)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Applicant Type</span>
                  <p className={valueStyles}>{formatValue(applicant.applicant_type)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Status</span>
                  <p className={valueStyles}>{formatValue(applicant.status)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelStyles}>Date Applied</span>
                  <p className={valueStyles}>{formatDate(applicant.date_applied) !== "--" ? formatDate(applicant.date_applied) : formatDate(applicant.created_at)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Personal Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-4"><span className={labelStyles}>Last Name</span><p className={valueStyles}>{formatValue(applicant.last_name)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>First Name</span><p className={valueStyles}>{formatValue(applicant.first_name)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Middle Name</span><p className={valueStyles}>{formatValue(applicant.middle_name)}</p></div>
                <div className="col-span-8"><span className={labelStyles}>Current Complete Address</span><p className={valueStyles}>{formatValue(applicant.current_address)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Provincial Address</span><p className={valueStyles}>{formatValue(applicant.provincial_address)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(applicant.contact_number)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Active Cellphone</span><p className={valueStyles}>{formatValue(applicant.active_cellphone)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Email</span><p className={valueStyles}>{formatValue(applicant.email)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Date of Birth</span><p className={valueStyles}>{formatDate(applicant.date_of_birth)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Age</span><p className={valueStyles}>{getAgeFromDob(applicant.date_of_birth)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Place of Birth</span><p className={valueStyles}>{formatValue(applicant.place_of_birth)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Religion</span><p className={valueStyles}>{formatValue(applicant.religion)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Civil Status</span><p className={valueStyles}>{formatValue(applicant.civil_status)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Sex</span><p className={valueStyles}>{formatValue(applicant.gender)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Height (cm)</span><p className={valueStyles}>{formatValue(applicant.height_cm)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Weight (kg)</span><p className={valueStyles}>{formatValue(applicant.weight_kg)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Facebook Account</span><p className={valueStyles}>{formatValue(applicant.facebook_account)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Family Information</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>Mother Full Name</span><p className={valueStyles}>{formatValue(applicant.mother_full_name)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Mother Contact</span><p className={valueStyles}>{formatValue(applicant.mother_contact)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Father Full Name</span><p className={valueStyles}>{formatValue(applicant.father_full_name)}</p></div>
                <div className="col-span-6"><span className={labelStyles}>Father Contact</span><p className={valueStyles}>{formatValue(applicant.father_contact)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>Spouse Name</span><p className={valueStyles}>{formatValue(applicant.spouse_name)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Spouse Age</span><p className={valueStyles}>{formatValue(applicant.spouse_age)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>Spouse Contact</span><p className={valueStyles}>{formatValue(applicant.spouse_contact)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Number of Children</span><p className={valueStyles}>{formatValue(applicant.number_of_children)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>Children Ages</span><p className={valueStyles}>{formatValue(applicant.children_ages)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Children Caretaker</span><p className={valueStyles}>{formatValue(applicant.children_caretaker)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-5"><span className={labelStyles}>Name</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_name)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_relationship)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Contact Number</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_number)}</p></div>
                <div className="col-span-12"><span className={labelStyles}>Address</span><p className={valueStyles}>{formatValue(applicant.emergency_contact_address)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Beneficiaries</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-4"><span className={labelStyles}>Beneficiary 1 Name</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_name)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>DOB</span><p className={valueStyles}>{formatDate(applicant.beneficiary1_dob)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Age</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_age)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_relationship)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Contact</span><p className={valueStyles}>{formatValue(applicant.beneficiary1_contact)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Beneficiary 2 Name</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_name)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>DOB</span><p className={valueStyles}>{formatDate(applicant.beneficiary2_dob)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Age</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_age)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Relationship</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_relationship)}</p></div>
                <div className="col-span-2"><span className={labelStyles}>Contact</span><p className={valueStyles}>{formatValue(applicant.beneficiary2_contact)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Educational Background</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-4"><span className={labelStyles}>Elementary School</span><p className={valueStyles}>{formatValue(applicant.elementary_school)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>Elementary Address</span><p className={valueStyles}>{formatValue(applicant.elementary_address)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.elementary_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>High School</span><p className={valueStyles}>{formatValue(applicant.high_school)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>High School Address</span><p className={valueStyles}>{formatValue(applicant.high_school_address)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.high_school_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>Vocational Course</span><p className={valueStyles}>{formatValue(applicant.vocational_course)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>Vocational School</span><p className={valueStyles}>{formatValue(applicant.vocational_school)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.vocational_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelStyles}>College Course</span><p className={valueStyles}>{formatValue(applicant.college_course)}</p></div>
                <div className="col-span-5"><span className={labelStyles}>College School</span><p className={valueStyles}>{formatValue(applicant.college_school)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Year Graduated</span><p className={valueStyles}>{formatValue(applicant.college_year_graduated)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Work Experience</h2>
              <div className="space-y-4">
                {((applicant.work_experiences as { country?: string; company?: string; position?: string; date_started?: string; date_ended?: string }[]) ?? []).length === 0 ? (
                  <p className="text-sm text-gray-500">No work experience recorded.</p>
                ) : (
                  ((applicant.work_experiences as { country?: string; company?: string; position?: string; date_started?: string; date_ended?: string }[]) ?? []).map((w, idx) => (
                    <div key={idx} className="rounded-md border border-gray-200 p-4">
                      <div className="mb-2 text-xs font-bold text-gray-600">WORK {idx + 1}</div>
                      <div className={gridLayoutStyles}>
                        <div className="col-span-3"><span className={labelStyles}>Country</span><p className={valueStyles}>{formatValue(w.country)}</p></div>
                        <div className="col-span-5"><span className={labelStyles}>Company</span><p className={valueStyles}>{formatValue(w.company)}</p></div>
                        <div className="col-span-4"><span className={labelStyles}>Position</span><p className={valueStyles}>{formatValue(w.position)}</p></div>
                        <div className="col-span-3"><span className={labelStyles}>Date Started</span><p className={valueStyles}>{formatDate(w.date_started)}</p></div>
                        <div className="col-span-3"><span className={labelStyles}>Date Ended</span><p className={valueStyles}>{formatDate(w.date_ended)}</p></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <h2 className={sectionHeaderStyles}>Skills</h2>
                <div className="space-y-3">
                  <div><span className={labelStyles}>Years of Experience</span><p className={valueStyles}>{formatValue(applicant.years_of_exp)}</p></div>
                  <div><span className={labelStyles}>Skills</span><p className={valueStyles}>{formatValue(applicant.skills)}</p></div>
                  <div><span className={labelStyles}>Notes</span><p className={valueStyles}>{formatValue(applicant.notes)}</p></div>
                </div>
              </div>
              <div className="col-span-4">
                <h2 className={sectionHeaderStyles}>Speaking Language</h2>
                <div className="space-y-3">
                  <div><span className={labelStyles}>English Level</span><p className={valueStyles}>{formatValue(applicant.english_level)}</p></div>
                  <div><span className={labelStyles}>Arabic Level</span><p className={valueStyles}>{formatValue(applicant.arabic_level)}</p></div>
                </div>
              </div>
              <div className="col-span-4">
                <h2 className={sectionHeaderStyles}>Passport Details</h2>
                <div className="space-y-3">
                  <div><span className={labelStyles}>Passport Number</span><p className={valueStyles}>{formatValue(applicant.passport_number)}</p></div>
                  <div><span className={labelStyles}>Date Issued</span><p className={valueStyles}>{formatDate(applicant.passport_date_issued)}</p></div>
                  <div><span className={labelStyles}>Date Expired</span><p className={valueStyles}>{formatDate(applicant.passport_date_expired)}</p></div>
                  <div><span className={labelStyles}>Place Issued</span><p className={valueStyles}>{formatValue(applicant.passport_place_issued)}</p></div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Interview</h2>
              <div className={gridLayoutStyles}>
                <div className="col-span-6"><span className={labelStyles}>Remarks</span><p className={valueStyles}>{formatValue(applicant.interview_remarks)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Interviewer Name</span><p className={valueStyles}>{formatValue(applicant.interviewer_name)}</p></div>
                <div className="col-span-3"><span className={labelStyles}>Date Interviewed</span><p className={valueStyles}>{formatDate(applicant.date_interviewed)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

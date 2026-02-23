import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateApplicant } from "../../actions"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS } from "@/lib/status-options"

const v = (x: unknown): string => (x != null && x !== "" ? String(x) : "")

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id } = await params
  const n = Number(id)

  if (Number.isNaN(n)) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid ID</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const { data, error } = await supabase.from("applicants").select("*").eq("id", n).maybeSingle()

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Applicant not found</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const a = data as Record<string, unknown>

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"
  const sectionClass = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Applicant</h1>
          <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={updateApplicant} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={Number(a.id)} />
          <div className="space-y-6 p-6">
            <div>
                            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Position Applied For</label>
                  <input name="position_applied" className={inputClass} required defaultValue={v(a.position_applied)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Second Choice</label>
                  <input name="second_choice_position" className={inputClass} defaultValue={v(a.second_choice_position)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Preferred Branch</label>
                  <input name="preferred_branch" className={inputClass} defaultValue={v(a.preferred_branch)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Country Applying For</label>
                  <input name="country_applying_for" className={inputClass} defaultValue={v(a.country_applying_for)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Personal Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Last Name</label>
                  <input name="last_name" className={inputClass} required defaultValue={v(a.last_name)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>First Name</label>
                  <input name="first_name" className={inputClass} required defaultValue={v(a.first_name)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Middle Name</label>
                  <input name="middle_name" className={inputClass} defaultValue={v(a.middle_name)} />
                </div>
                <div className="col-span-12 md:col-span-8">
                  <label className={labelClass}>Current Complete Address</label>
                  <input name="current_address" className={inputClass} defaultValue={v(a.current_address)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Provincial Address</label>
                  <input name="provincial_address" className={inputClass} defaultValue={v(a.provincial_address)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Contact Number</label>
                  <input name="contact_number" className={inputClass} defaultValue={v(a.contact_number)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Active Cellphone</label>
                  <input name="active_cellphone" className={inputClass} defaultValue={v(a.active_cellphone)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Email</label>
                  <input name="email" type="email" className={inputClass} defaultValue={v(a.email)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Active Email</label>
                  <input name="active_email" type="email" className={inputClass} defaultValue={v(a.active_email)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Date of Birth</label>
                  <input name="date_of_birth" type="date" className={inputClass} defaultValue={v(a.date_of_birth)?.slice(0, 10) ?? ""} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Age</label>
                  <input name="age" type="number" className={inputClass} defaultValue={a.age != null ? String(a.age) : ""} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Place of Birth</label>
                  <input name="place_of_birth" className={inputClass} defaultValue={v(a.place_of_birth)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Religion</label>
                  <input name="religion" className={inputClass} defaultValue={v(a.religion)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Civil Status</label>
                  <input name="civil_status" className={inputClass} defaultValue={v(a.civil_status)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Height (cm)</label>
                  <input name="height_cm" type="number" step="0.01" className={inputClass} defaultValue={a.height_cm != null ? String(a.height_cm) : ""} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Weight (kg)</label>
                  <input name="weight_kg" type="number" step="0.01" className={inputClass} defaultValue={a.weight_kg != null ? String(a.weight_kg) : ""} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Facebook Account</label>
                  <input name="facebook_account" className={inputClass} defaultValue={v(a.facebook_account)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Family Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Mother Full Name</label>
                  <input name="mother_full_name" className={inputClass} defaultValue={v(a.mother_full_name)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Mother Contact</label>
                  <input name="mother_contact" className={inputClass} defaultValue={v(a.mother_contact)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Father Full Name</label>
                  <input name="father_full_name" className={inputClass} defaultValue={v(a.father_full_name)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Father Contact</label>
                  <input name="father_contact" className={inputClass} defaultValue={v(a.father_contact)} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Spouse Name</label>
                  <input name="spouse_name" className={inputClass} defaultValue={v(a.spouse_name)} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Spouse Age</label>
                  <input name="spouse_age" type="number" className={inputClass} defaultValue={a.spouse_age != null ? String(a.spouse_age) : ""} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Spouse Contact</label>
                  <input name="spouse_contact" className={inputClass} defaultValue={v(a.spouse_contact)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Number of Children</label>
                  <input name="number_of_children" type="number" className={inputClass} defaultValue={a.number_of_children != null ? String(a.number_of_children) : ""} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Children Ages</label>
                  <input name="children_ages" className={inputClass} defaultValue={v(a.children_ages)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Children Caretaker</label>
                  <input name="children_caretaker" className={inputClass} defaultValue={v(a.children_caretaker)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Name</label>
                  <input name="emergency_contact_name" className={inputClass} defaultValue={v(a.emergency_contact_name)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Relationship</label>
                  <input name="emergency_contact_relationship" className={inputClass} defaultValue={v(a.emergency_contact_relationship)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Contact Number</label>
                  <input name="emergency_contact_number" className={inputClass} defaultValue={v(a.emergency_contact_number)} />
                </div>
                <div className="col-span-12">
                  <label className={labelClass}>Address</label>
                  <input name="emergency_contact_address" className={inputClass} defaultValue={v(a.emergency_contact_address)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Beneficiaries</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Beneficiary 1 Name</label>
                  <input name="beneficiary1_name" className={inputClass} defaultValue={v(a.beneficiary1_name)} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>DOB</label>
                  <input name="beneficiary1_dob" type="date" className={inputClass} defaultValue={v(a.beneficiary1_dob)?.slice(0, 10) ?? ""} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Age</label>
                  <input name="beneficiary1_age" type="number" className={inputClass} defaultValue={a.beneficiary1_age != null ? String(a.beneficiary1_age) : ""} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Relationship</label>
                  <input name="beneficiary1_relationship" className={inputClass} defaultValue={v(a.beneficiary1_relationship)} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Contact</label>
                  <input name="beneficiary1_contact" className={inputClass} defaultValue={v(a.beneficiary1_contact)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Beneficiary 2 Name</label>
                  <input name="beneficiary2_name" className={inputClass} defaultValue={v(a.beneficiary2_name)} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>DOB</label>
                  <input name="beneficiary2_dob" type="date" className={inputClass} defaultValue={v(a.beneficiary2_dob)?.slice(0, 10) ?? ""} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Age</label>
                  <input name="beneficiary2_age" type="number" className={inputClass} defaultValue={a.beneficiary2_age != null ? String(a.beneficiary2_age) : ""} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Relationship</label>
                  <input name="beneficiary2_relationship" className={inputClass} defaultValue={v(a.beneficiary2_relationship)} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelClass}>Contact</label>
                  <input name="beneficiary2_contact" className={inputClass} defaultValue={v(a.beneficiary2_contact)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Educational Background</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Elementary School</label>
                  <input name="elementary_school" className={inputClass} defaultValue={v(a.elementary_school)} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Elementary Address</label>
                  <input name="elementary_address" className={inputClass} defaultValue={v(a.elementary_address)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Year Graduated</label>
                  <input name="elementary_year_graduated" className={inputClass} defaultValue={v(a.elementary_year_graduated)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>High School</label>
                  <input name="high_school" className={inputClass} defaultValue={v(a.high_school)} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>High School Address</label>
                  <input name="high_school_address" className={inputClass} defaultValue={v(a.high_school_address)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Year Graduated</label>
                  <input name="high_school_year_graduated" className={inputClass} defaultValue={v(a.high_school_year_graduated)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>Vocational Course</label>
                  <input name="vocational_course" className={inputClass} defaultValue={v(a.vocational_course)} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Vocational School</label>
                  <input name="vocational_school" className={inputClass} defaultValue={v(a.vocational_school)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Year Graduated</label>
                  <input name="vocational_year_graduated" className={inputClass} defaultValue={v(a.vocational_year_graduated)} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelClass}>College Course</label>
                  <input name="college_course" className={inputClass} defaultValue={v(a.college_course)} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>College School</label>
                  <input name="college_school" className={inputClass} defaultValue={v(a.college_school)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Year Graduated</label>
                  <input name="college_year_graduated" className={inputClass} defaultValue={v(a.college_year_graduated)} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Work Experience</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-md border border-gray-200 p-4">
                    <div className="mb-3 text-xs font-bold text-gray-600">WORK {n}</div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-3">
                        <label className={labelClass}>Country</label>
                        <input name={`work${n}_country`} className={inputClass} defaultValue={v(a[`work${n}_country`])} />
                      </div>
                      <div className="col-span-12 md:col-span-5">
                        <label className={labelClass}>Company</label>
                        <input name={`work${n}_company`} className={inputClass} defaultValue={v(a[`work${n}_company`])} />
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label className={labelClass}>Position</label>
                        <input name={`work${n}_position`} className={inputClass} defaultValue={v(a[`work${n}_position`])} />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className={labelClass}>Date Started</label>
                        <input name={`work${n}_date_started`} type="date" className={inputClass} defaultValue={v(a[`work${n}_date_started`])?.slice(0, 10) ?? ""} />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className={labelClass}>Date Ended</label>
                        <input name={`work${n}_date_ended`} type="date" className={inputClass} defaultValue={v(a[`work${n}_date_ended`])?.slice(0, 10) ?? ""} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4">
                <h2 className={sectionClass}>Skills</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <input name="years_of_exp" type="number" min={0} className={inputClass} defaultValue={a.years_of_exp != null ? Number(a.years_of_exp) : 0} />
                  </div>
                  <div>
                    <label className={labelClass}>Skills (comma-separated)</label>
                    <input name="skills" className={inputClass} placeholder="e.g. Cooking, Child Care, Driving" defaultValue={v(a.skills)} />
                  </div>
                  <div>
                    <label className={labelClass}>Notes</label>
                    <input name="notes" className={inputClass} defaultValue={v(a.notes)} />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h2 className={sectionClass}>Speaking Language</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>English Level</label>
                    <input name="english_level" className={inputClass} defaultValue={v(a.english_level)} />
                  </div>
                  <div>
                    <label className={labelClass}>Arabic Level</label>
                    <input name="arabic_level" className={inputClass} defaultValue={v(a.arabic_level)} />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h2 className={sectionClass}>Passport Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Passport Number</label>
                    <input name="passport_number" className={inputClass} defaultValue={v(a.passport_number)} />
                  </div>
                  <div>
                    <label className={labelClass}>Date Issued</label>
                    <input name="passport_date_issued" type="date" className={inputClass} defaultValue={v(a.passport_date_issued)?.slice(0, 10) ?? ""} />
                  </div>
                  <div>
                    <label className={labelClass}>Date Expired</label>
                    <input name="passport_date_expired" type="date" className={inputClass} defaultValue={v(a.passport_date_expired)?.slice(0, 10) ?? ""} />
                  </div>
                  <div>
                    <label className={labelClass}>Place Issued</label>
                    <input name="passport_place_issued" className={inputClass} defaultValue={v(a.passport_place_issued)} />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Interview</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelClass}>Remarks</label>
                  <input name="interview_remarks" className={inputClass} defaultValue={v(a.interview_remarks)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Interviewer Name</label>
                  <input name="interviewer_name" className={inputClass} defaultValue={v(a.interviewer_name)} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelClass}>Date Interviewed</label>
                  <input name="date_interviewed" type="date" className={inputClass} defaultValue={v(a.date_interviewed)?.slice(0, 10) ?? ""} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Applicant Type</label>
                <select name="applicant_type" className={inputClass} defaultValue={v(a.applicant_type) || "Domestic Helper"}>
                  {APPLICANT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass} defaultValue={v(a.status) || "New Applicant"}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Date Applied</label>
                <input name="date_applied" type="date" className={inputClass} defaultValue={v(a.date_applied)?.slice(0, 10) ?? ""} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button type="submit" className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Update Applicant
            </button>
            <Link href="/applicants" className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

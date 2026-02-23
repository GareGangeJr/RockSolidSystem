import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { FolderOpen } from "lucide-react"

const v = (x: unknown) => (x != null && x !== "" ? String(x) : "—")
const d = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "—")

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServer()
  const { id: idParam } = await params
  const id = Number(idParam)

  if (Number.isNaN(id)) {
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Invalid applicant ID</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const { data, error } = await supabase.from("applicants").select("*").eq("id", id).maybeSingle()

  if (error) {
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Error: {error.message}</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="font-semibold text-red-500">Applicant not found.</p>
        <Link href="/applicants" className="text-blue-600 hover:underline">Back</Link>
      </div>
    )
  }

  const a = data as Record<string, unknown>

  const { data: files } = await supabase
    .from("applicant_files")
    .select("id, file_name")
    .eq("applicant_id", id)

  const labelClass = "block text-xs font-medium text-gray-500"
  const valueClass = "mt-0.5 text-sm text-gray-900"
  const sectionClass = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
  const gridClass = "grid grid-cols-12 gap-4"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">View Applicant</h1>
          <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <div className={gridClass}>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelClass}>Position Applied For</span>
                  <p className={valueClass}>{v(a.position_applied)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelClass}>Second Choice</span>
                  <p className={valueClass}>{v(a.second_choice_position)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelClass}>Preferred Branch</span>
                  <p className={valueClass}>{v(a.preferred_branch)}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className={labelClass}>Country Applying For</span>
                  <p className={valueClass}>{v(a.country_applying_for)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelClass}>Applicant Type</span>
                  <p className={valueClass}>{v(a.applicant_type)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelClass}>Status</span>
                  <p className={valueClass}>{v(a.status)}</p>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className={labelClass}>Date Applied</span>
                  <p className={valueClass}>{d(a.date_applied) !== "—" ? d(a.date_applied) : d(a.created_at)}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Personal Information</h2>
              <div className={gridClass}>
                <div className="col-span-4"><span className={labelClass}>Last Name</span><p className={valueClass}>{v(a.last_name)}</p></div>
                <div className="col-span-4"><span className={labelClass}>First Name</span><p className={valueClass}>{v(a.first_name)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Middle Name</span><p className={valueClass}>{v(a.middle_name)}</p></div>
                <div className="col-span-8"><span className={labelClass}>Current Complete Address</span><p className={valueClass}>{v(a.current_address)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Provincial Address</span><p className={valueClass}>{v(a.provincial_address)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Contact Number</span><p className={valueClass}>{v(a.contact_number)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Active Cellphone</span><p className={valueClass}>{v(a.active_cellphone)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Email</span><p className={valueClass}>{v(a.email)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Active Email</span><p className={valueClass}>{v(a.active_email)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Date of Birth</span><p className={valueClass}>{d(a.date_of_birth)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Age</span><p className={valueClass}>{v(a.age)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Place of Birth</span><p className={valueClass}>{v(a.place_of_birth)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Religion</span><p className={valueClass}>{v(a.religion)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Civil Status</span><p className={valueClass}>{v(a.civil_status)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Height (cm)</span><p className={valueClass}>{v(a.height_cm)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Weight (kg)</span><p className={valueClass}>{v(a.weight_kg)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Facebook Account</span><p className={valueClass}>{v(a.facebook_account)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Family Information</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>Mother Full Name</span><p className={valueClass}>{v(a.mother_full_name)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Mother Contact</span><p className={valueClass}>{v(a.mother_contact)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Father Full Name</span><p className={valueClass}>{v(a.father_full_name)}</p></div>
                <div className="col-span-6"><span className={labelClass}>Father Contact</span><p className={valueClass}>{v(a.father_contact)}</p></div>
                <div className="col-span-5"><span className={labelClass}>Spouse Name</span><p className={valueClass}>{v(a.spouse_name)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Spouse Age</span><p className={valueClass}>{v(a.spouse_age)}</p></div>
                <div className="col-span-5"><span className={labelClass}>Spouse Contact</span><p className={valueClass}>{v(a.spouse_contact)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Number of Children</span><p className={valueClass}>{v(a.number_of_children)}</p></div>
                <div className="col-span-5"><span className={labelClass}>Children Ages</span><p className={valueClass}>{v(a.children_ages)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Children Caretaker</span><p className={valueClass}>{v(a.children_caretaker)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className={gridClass}>
                <div className="col-span-5"><span className={labelClass}>Name</span><p className={valueClass}>{v(a.emergency_contact_name)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Relationship</span><p className={valueClass}>{v(a.emergency_contact_relationship)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Contact Number</span><p className={valueClass}>{v(a.emergency_contact_number)}</p></div>
                <div className="col-span-12"><span className={labelClass}>Address</span><p className={valueClass}>{v(a.emergency_contact_address)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Beneficiaries</h2>
              <div className={gridClass}>
                <div className="col-span-4"><span className={labelClass}>Beneficiary 1 Name</span><p className={valueClass}>{v(a.beneficiary1_name)}</p></div>
                <div className="col-span-2"><span className={labelClass}>DOB</span><p className={valueClass}>{d(a.beneficiary1_dob)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Age</span><p className={valueClass}>{v(a.beneficiary1_age)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Relationship</span><p className={valueClass}>{v(a.beneficiary1_relationship)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Contact</span><p className={valueClass}>{v(a.beneficiary1_contact)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Beneficiary 2 Name</span><p className={valueClass}>{v(a.beneficiary2_name)}</p></div>
                <div className="col-span-2"><span className={labelClass}>DOB</span><p className={valueClass}>{d(a.beneficiary2_dob)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Age</span><p className={valueClass}>{v(a.beneficiary2_age)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Relationship</span><p className={valueClass}>{v(a.beneficiary2_relationship)}</p></div>
                <div className="col-span-2"><span className={labelClass}>Contact</span><p className={valueClass}>{v(a.beneficiary2_contact)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Educational Background</h2>
              <div className={gridClass}>
                <div className="col-span-4"><span className={labelClass}>Elementary School</span><p className={valueClass}>{v(a.elementary_school)}</p></div>
                <div className="col-span-5"><span className={labelClass}>Elementary Address</span><p className={valueClass}>{v(a.elementary_address)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Year Graduated</span><p className={valueClass}>{v(a.elementary_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelClass}>High School</span><p className={valueClass}>{v(a.high_school)}</p></div>
                <div className="col-span-5"><span className={labelClass}>High School Address</span><p className={valueClass}>{v(a.high_school_address)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Year Graduated</span><p className={valueClass}>{v(a.high_school_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelClass}>Vocational Course</span><p className={valueClass}>{v(a.vocational_course)}</p></div>
                <div className="col-span-5"><span className={labelClass}>Vocational School</span><p className={valueClass}>{v(a.vocational_school)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Year Graduated</span><p className={valueClass}>{v(a.vocational_year_graduated)}</p></div>
                <div className="col-span-4"><span className={labelClass}>College Course</span><p className={valueClass}>{v(a.college_course)}</p></div>
                <div className="col-span-5"><span className={labelClass}>College School</span><p className={valueClass}>{v(a.college_school)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Year Graduated</span><p className={valueClass}>{v(a.college_year_graduated)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Work Experience</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-md border border-gray-200 p-4">
                    <div className="mb-2 text-xs font-bold text-gray-600">WORK {n}</div>
                    <div className={gridClass}>
                      <div className="col-span-3"><span className={labelClass}>Country</span><p className={valueClass}>{v(a[`work${n}_country`])}</p></div>
                      <div className="col-span-5"><span className={labelClass}>Company</span><p className={valueClass}>{v(a[`work${n}_company`])}</p></div>
                      <div className="col-span-4"><span className={labelClass}>Position</span><p className={valueClass}>{v(a[`work${n}_position`])}</p></div>
                      <div className="col-span-3"><span className={labelClass}>Date Started</span><p className={valueClass}>{d(a[`work${n}_date_started`])}</p></div>
                      <div className="col-span-3"><span className={labelClass}>Date Ended</span><p className={valueClass}>{d(a[`work${n}_date_ended`])}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <h2 className={sectionClass}>Skills</h2>
                <div className="space-y-3">
                  <div><span className={labelClass}>Years of Experience</span><p className={valueClass}>{v(a.years_of_exp)}</p></div>
                  <div><span className={labelClass}>Skills</span><p className={valueClass}>{v(a.skills)}</p></div>
                  <div><span className={labelClass}>Notes</span><p className={valueClass}>{v(a.notes)}</p></div>
                </div>
              </div>
              <div className="col-span-4">
                <h2 className={sectionClass}>Speaking Language</h2>
                <div className="space-y-3">
                  <div><span className={labelClass}>English Level</span><p className={valueClass}>{v(a.english_level)}</p></div>
                  <div><span className={labelClass}>Arabic Level</span><p className={valueClass}>{v(a.arabic_level)}</p></div>
                </div>
              </div>
              <div className="col-span-4">
                <h2 className={sectionClass}>Passport Details</h2>
                <div className="space-y-3">
                  <div><span className={labelClass}>Passport Number</span><p className={valueClass}>{v(a.passport_number)}</p></div>
                  <div><span className={labelClass}>Date Issued</span><p className={valueClass}>{d(a.passport_date_issued)}</p></div>
                  <div><span className={labelClass}>Date Expired</span><p className={valueClass}>{d(a.passport_date_expired)}</p></div>
                  <div><span className={labelClass}>Place Issued</span><p className={valueClass}>{v(a.passport_place_issued)}</p></div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Interview</h2>
              <div className={gridClass}>
                <div className="col-span-6"><span className={labelClass}>Remarks</span><p className={valueClass}>{v(a.interview_remarks)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Interviewer Name</span><p className={valueClass}>{v(a.interviewer_name)}</p></div>
                <div className="col-span-3"><span className={labelClass}>Date Interviewed</span><p className={valueClass}>{d(a.date_interviewed)}</p></div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionClass}>Files</h2>
              {files?.length ? (
                <ul className="list-disc space-y-1 pl-6">
                  {files.map((f: { id: number; file_name: string }) => (
                    <li key={f.id}>{f.file_name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No files</p>
              )}
              <Link
                href={`/applicants/${id}/files`}
                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <FolderOpen className="h-4 w-4" />
                Manage files
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

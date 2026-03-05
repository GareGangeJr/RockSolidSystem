import Link from "next/link"
import { addApplicant } from "../actions"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS, POSITION_OPTIONS, BRANCH_OPTIONS, COUNTRY_OPTIONS, CIVIL_STATUS_OPTIONS, SPEAKING_LEVEL_OPTIONS } from "@/lib/status-options"
import { WorkExperienceForm } from "@/components/applicants/work-experience-form"

export default function AddApplicantPage() {
  const inputFieldStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelStyles = "block text-sm font-medium text-gray-700"
  const sectionHeaderStyles = "mb-3 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Applicant</h1>
          <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Applicants Page
          </Link>
        </div>

        <form action={addApplicant} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Position Applied For</label>
                  <select name="position_applied" className={inputFieldStyles} required>
                    <option value="">Select Position</option>
                    {POSITION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Second Choice</label>
                  <select name="second_choice_position" className={inputFieldStyles}>
                    <option value="">Select Position</option>
                    {POSITION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Preferred Branch</label>
                  <select name="preferred_branch" className={inputFieldStyles}>
                    <option value="">Select Branch</option>
                    {BRANCH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Country Applying For</label>
                  <select name="country_applying_for" className={inputFieldStyles}>
                    <option value="">Select Country</option>
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Personal Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Last Name</label>
                  <input name="last_name" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>First Name</label>
                  <input name="first_name" className={inputFieldStyles} required />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Middle Name</label>
                  <input name="middle_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-8">
                  <label className={labelStyles}>Current Complete Address</label>
                  <input name="current_address" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Provincial Address</label>
                  <input name="provincial_address" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Contact Number</label>
                  <input name="contact_number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Active Cellphone</label>
                  <input name="active_cellphone" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Email</label>
                  <input name="email" type="email" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Date of Birth</label>
                  <input name="date_of_birth" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Place of Birth</label>
                  <input name="place_of_birth" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Religion</label>
                  <input name="religion" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Civil Status</label>
                  <select name="civil_status" className={inputFieldStyles}>
                    <option value="">Select civil status...</option>
                    {CIVIL_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Height (cm)</label>
                  <input name="height_cm" type="number" step="0.01" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Weight (kg)</label>
                  <input name="weight_kg" type="number" step="0.01" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Facebook Account</label>
                  <input name="facebook_account" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Family Information</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Mother Full Name</label>
                  <input name="mother_full_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Mother Contact</label>
                  <input name="mother_contact" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Father Full Name</label>
                  <input name="father_full_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Father Contact</label>
                  <input name="father_contact" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Spouse Name</label>
                  <input name="spouse_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Spouse Age</label>
                  <input name="spouse_age" type="number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Spouse Contact</label>
                  <input name="spouse_contact" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Number of Children</label>
                  <input name="number_of_children" type="number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Children Ages</label>
                  <input name="children_ages" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Children Caretaker</label>
                  <input name="children_caretaker" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Emergency Contact</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Name</label>
                  <input name="emergency_contact_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Relationship</label>
                  <input name="emergency_contact_relationship" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Contact Number</label>
                  <input name="emergency_contact_number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12">
                  <label className={labelStyles}>Address</label>
                  <input name="emergency_contact_address" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Beneficiaries</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Beneficiary 1 Name</label>
                  <input name="beneficiary1_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>DOB</label>
                  <input name="beneficiary1_dob" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Age</label>
                  <input name="beneficiary1_age" type="number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Relationship</label>
                  <input name="beneficiary1_relationship" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Contact</label>
                  <input name="beneficiary1_contact" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Beneficiary 2 Name</label>
                  <input name="beneficiary2_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>DOB</label>
                  <input name="beneficiary2_dob" type="date" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Age</label>
                  <input name="beneficiary2_age" type="number" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Relationship</label>
                  <input name="beneficiary2_relationship" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className={labelStyles}>Contact</label>
                  <input name="beneficiary2_contact" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Educational Background</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Elementary School</label>
                  <input name="elementary_school" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Elementary Address</label>
                  <input name="elementary_address" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Year Graduated</label>
                  <input name="elementary_year_graduated" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>High School</label>
                  <input name="high_school" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>High School Address</label>
                  <input name="high_school_address" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Year Graduated</label>
                  <input name="high_school_year_graduated" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>Vocational Course</label>
                  <input name="vocational_course" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>Vocational School</label>
                  <input name="vocational_school" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Year Graduated</label>
                  <input name="vocational_year_graduated" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className={labelStyles}>College Course</label>
                  <input name="college_course" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className={labelStyles}>College School</label>
                  <input name="college_school" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Year Graduated</label>
                  <input name="college_year_graduated" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Work Experience</h2>
              <WorkExperienceForm />
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4">
                <h2 className={sectionHeaderStyles}>Skills</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelStyles}>Years of Experience</label>
                    <input name="years_of_exp" type="number" min={0} defaultValue={0} className={inputFieldStyles} />
                  </div>
                  <div>
                    <label className={labelStyles}>Skills (comma-separated)</label>
                    <input name="skills" className={inputFieldStyles} placeholder="e.g. Cooking, Child Care, Driving" />
                  </div>
                  <div>
                    <label className={labelStyles}>Notes</label>
                    <input name="notes" className={inputFieldStyles} />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h2 className={sectionHeaderStyles}>Speaking Language</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelStyles}>English Level</label>
                    <select name="english_level" className={inputFieldStyles}>
                      <option value="">Select level</option>
                      {SPEAKING_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelStyles}>Arabic Level</label>
                    <select name="arabic_level" className={inputFieldStyles}>
                      <option value="">Select level</option>
                      {SPEAKING_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
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
                    <input name="passport_number" className={inputFieldStyles} />
                  </div>
                  <div>
                    <label className={labelStyles}>Date Issued</label>
                    <input name="passport_date_issued" type="date" className={inputFieldStyles} />
                  </div>
                  <div>
                    <label className={labelStyles}>Date Expired</label>
                    <input name="passport_date_expired" type="date" className={inputFieldStyles} />
                  </div>
                  <div>
                    <label className={labelStyles}>Place Issued</label>
                    <input name="passport_place_issued" className={inputFieldStyles} />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className={sectionHeaderStyles}>Interview</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className={labelStyles}>Remarks</label>
                  <input name="interview_remarks" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Interviewer Name</label>
                  <input name="interviewer_name" className={inputFieldStyles} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className={labelStyles}>Date Interviewed</label>
                  <input name="date_interviewed" type="date" className={inputFieldStyles} />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className={labelStyles}>Applicant Type</label>
                <select name="applicant_type" className={inputFieldStyles} defaultValue="Domestic Helper">
                  {APPLICANT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className={labelStyles}>Status</label>
                <select name="status" className={inputFieldStyles} defaultValue="New Applicant">
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className={labelStyles}>Date Applied</label>
                <input name="date_applied" type="date" className={inputFieldStyles} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Applicant
            </button>
            <Link
              href="/applicants"
              className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

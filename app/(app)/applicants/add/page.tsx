import Link from "next/link"
import { addApplicant } from "../actions"

export default function AddApplicantPage() {
  const label = "text-[11px] font-semibold uppercase text-gray-700"
  const box = "border border-gray-400 rounded-sm px-2 py-1 text-sm w-full"
  const boxDate = "border border-gray-400 rounded-sm px-2 py-1 text-sm w-[170px]"
  const sectionTitle = "text-[12px] font-bold uppercase tracking-wide text-gray-800"

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Add Applicant</h1>
          <Link href="/applicants" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>

        <form action={addApplicant} className="bg-white shadow-md border border-gray-300 p-6">
          {/* HEADER */}
          <div>
            <div className="text-2xl font-extrabold leading-tight">ROCK SOLID MANPOWER</div>
            <div className="text-xs text-gray-700">Network & Consultancy Inc.</div>

            <div className="mt-4 grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6">
                <div className={label}>Position Applied For</div>
                <input name="position_applied" className={box} required />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className={label}>Second Choice</div>
                <input name="second_choice_position" className={box} />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className={label}>Preferred Branch</div>
                <input name="preferred_branch" className={box} />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className={label}>Country Applying For</div>
                <input name="country_applying_for" className={box} />
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* PERSONAL INFORMATION */}
          <div className={sectionTitle}>Personal Information</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Last Name</div>
              <input name="last_name" className={box} required />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>First Name</div>
              <input name="first_name" className={box} required />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Middle Name</div>
              <input name="middle_name" className={box} />
            </div>

            <div className="col-span-12 md:col-span-8">
              <div className={label}>Current Complete Address</div>
              <input name="current_address" className={box} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Provincial Address</div>
              <input name="provincial_address" className={box} />
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className={label}>Contact Number</div>
              <input name="contact_number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Active Cellphone</div>
              <input name="active_cellphone" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Email</div>
              <input name="email" type="email" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Active Email</div>
              <input name="active_email" type="email" className={box} />
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className={label}>Date of Birth</div>
              <input name="date_of_birth" type="date" className={boxDate} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Age</div>
              <input name="age" type="number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Place of Birth</div>
              <input name="place_of_birth" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Religion</div>
              <input name="religion" className={box} />
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className={label}>Civil Status</div>
              <input name="civil_status" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Height (cm)</div>
              <input name="height_cm" type="number" step="0.01" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Weight (kg)</div>
              <input name="weight_kg" type="number" step="0.01" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Facebook Account</div>
              <input name="facebook_account" className={box} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* FAMILY INFO */}
          <div className={sectionTitle}>Family Information</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6">
              <div className={label}>Mother Full Name</div>
              <input name="mother_full_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className={label}>Mother Contact</div>
              <input name="mother_contact" className={box} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className={label}>Father Full Name</div>
              <input name="father_full_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className={label}>Father Contact</div>
              <input name="father_contact" className={box} />
            </div>

            <div className="col-span-12 md:col-span-5">
              <div className={label}>Spouse Name</div>
              <input name="spouse_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Spouse Age</div>
              <input name="spouse_age" type="number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>Spouse Contact</div>
              <input name="spouse_contact" className={box} />
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className={label}>Number of Children</div>
              <input name="number_of_children" type="number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>Children Ages</div>
              <input name="children_ages" className={box} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Children Caretaker</div>
              <input name="children_caretaker" className={box} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* EMERGENCY */}
          <div className={sectionTitle}>Emergency Contact</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-5">
              <div className={label}>Name</div>
              <input name="emergency_contact_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Relationship</div>
              <input name="emergency_contact_relationship" className={box} />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Contact Number</div>
              <input name="emergency_contact_number" className={box} />
            </div>
            <div className="col-span-12">
              <div className={label}>Address</div>
              <input name="emergency_contact_address" className={box} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* BENEFICIARIES */}
          <div className={sectionTitle}>Beneficiaries</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Beneficiary 1 Name</div>
              <input name="beneficiary1_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>DOB</div>
              <input name="beneficiary1_dob" type="date" className={boxDate} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Age</div>
              <input name="beneficiary1_age" type="number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Relationship</div>
              <input name="beneficiary1_relationship" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Contact</div>
              <input name="beneficiary1_contact" className={box} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={label}>Beneficiary 2 Name</div>
              <input name="beneficiary2_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>DOB</div>
              <input name="beneficiary2_dob" type="date" className={boxDate} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Age</div>
              <input name="beneficiary2_age" type="number" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Relationship</div>
              <input name="beneficiary2_relationship" className={box} />
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className={label}>Contact</div>
              <input name="beneficiary2_contact" className={box} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* EDUCATION */}
          <div className={sectionTitle}>Educational Background</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Elementary School</div>
              <input name="elementary_school" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>Elementary Address</div>
              <input name="elementary_address" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Year Graduated</div>
              <input name="elementary_year_graduated" className={box} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={label}>High School</div>
              <input name="high_school" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>High School Address</div>
              <input name="high_school_address" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Year Graduated</div>
              <input name="high_school_year_graduated" className={box} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={label}>Vocational Course</div>
              <input name="vocational_course" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>Vocational School</div>
              <input name="vocational_school" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Year Graduated</div>
              <input name="vocational_year_graduated" className={box} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={label}>College Course</div>
              <input name="college_course" className={box} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className={label}>College School</div>
              <input name="college_school" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Year Graduated</div>
              <input name="college_year_graduated" className={box} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* WORK EXPERIENCE (FIXED / NOT UGLY) */}
          <div className={sectionTitle}>Work Experience</div>
          <div className="mt-3 space-y-4">
            {/* WORK 1 */}
            <div className="border border-gray-300 p-3 rounded-sm">
              <div className="text-xs font-bold mb-2">WORK 1</div>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Country</div>
                  <input name="work1_country" className={box} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className={label}>Company</div>
                  <input name="work1_company" className={box} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className={label}>Position</div>
                  <input name="work1_position" className={box} />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Started</div>
                  <input name="work1_date_started" type="date" className={boxDate} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Ended</div>
                  <input name="work1_date_ended" type="date" className={boxDate} />
                </div>
              </div>
            </div>

            {/* WORK 2 */}
            <div className="border border-gray-300 p-3 rounded-sm">
              <div className="text-xs font-bold mb-2">WORK 2</div>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Country</div>
                  <input name="work2_country" className={box} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className={label}>Company</div>
                  <input name="work2_company" className={box} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className={label}>Position</div>
                  <input name="work2_position" className={box} />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Started</div>
                  <input name="work2_date_started" type="date" className={boxDate} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Ended</div>
                  <input name="work2_date_ended" type="date" className={boxDate} />
                </div>
              </div>
            </div>

            {/* WORK 3 */}
            <div className="border border-gray-300 p-3 rounded-sm">
              <div className="text-xs font-bold mb-2">WORK 3</div>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Country</div>
                  <input name="work3_country" className={box} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className={label}>Company</div>
                  <input name="work3_company" className={box} />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className={label}>Position</div>
                  <input name="work3_position" className={box} />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Started</div>
                  <input name="work3_date_started" type="date" className={boxDate} />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div className={label}>Date Ended</div>
                  <input name="work3_date_ended" type="date" className={boxDate} />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* SKILLS / LANGUAGE / PASSPORT */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <div className={sectionTitle}>Skills</div>
              <div className="mt-2">
                <div className={label}>Years of Experience</div>
                <input name="years_of_exp" type="number" min={0} defaultValue={0} className={box} />
              </div>
              <div className="mt-3">
                <div className={label}>Skills (comma-separated)</div>
                <input name="skills" className={box} placeholder="e.g. Cooking, Child Care, Driving" />
              </div>
              <div className="mt-3">
                <div className={label}>Notes</div>
                <input name="notes" className={box} />
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={sectionTitle}>Speaking Language</div>
              <div className="mt-2">
                <div className={label}>English Level</div>
                <input name="english_level" className={box} />
              </div>
              <div className="mt-3">
                <div className={label}>Arabic Level</div>
                <input name="arabic_level" className={box} />
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className={sectionTitle}>Passport Details</div>
              <div className="mt-2">
                <div className={label}>Passport Number</div>
                <input name="passport_number" className={box} />
              </div>
              <div className="mt-3">
                <div className={label}>Date Issued</div>
                <input name="passport_date_issued" type="date" className={boxDate} />
              </div>
              <div className="mt-3">
                <div className={label}>Date Expired</div>
                <input name="passport_date_expired" type="date" className={boxDate} />
              </div>
              <div className="mt-3">
                <div className={label}>Place Issued</div>
                <input name="passport_place_issued" className={box} />
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* INTERVIEW */}
          <div className={sectionTitle}>Interview</div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6">
              <div className={label}>Remarks</div>
              <input name="interview_remarks" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Interviewer Name</div>
              <input name="interviewer_name" className={box} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className={label}>Date Interviewed</div>
              <input name="date_interviewed" type="date" className={boxDate} />
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* STATUS + DATE APPLIED */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Status</div>
              <select name="status" className={box}>
                <option>For Processing</option>
                <option>Deployed</option>
                <option>For Deployment</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className={label}>Date Applied</div>
              <input name="date_applied" type="date" className={boxDate} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              Save Applicant
            </button>
            <Link
              href="/applicants"
              className="px-6 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

const formatValue = (x: unknown) => (x != null && x !== "" ? String(x) : "—")
const formatDate = (x: unknown) => (x != null && String(x).length >= 10 ? String(x).slice(0, 10) : "—")

function getAgeFromDob(dob: unknown): string {
  if (!dob || String(dob).length < 10) return "—"
  const birth = new Date(String(dob).slice(0, 10))
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age < 0 ? "—" : String(age)
}

type WorkExp = { country?: string; company?: string; position?: string; date_started?: string; date_ended?: string }

const MARGIN = 50
const LINE_HEIGHT = 14
const FONT_SIZE = 10
const TITLE_SIZE = 11

const CHARS_PER_LINE = 75
function splitLongText(text: string): string[] {
  if (!text || text.length <= CHARS_PER_LINE) return [text || ""]
  const lines: string[] = []
  let remain = text
  while (remain.length > CHARS_PER_LINE) {
    const chunk = remain.slice(0, CHARS_PER_LINE)
    const lastSpace = chunk.lastIndexOf(" ")
    const cut = lastSpace > CHARS_PER_LINE / 2 ? lastSpace : CHARS_PER_LINE
    lines.push(remain.slice(0, cut).trim())
    remain = remain.slice(cut).trim()
  }
  if (remain) lines.push(remain)
  return lines
}

export async function applicantToPdf(applicant: Record<string, unknown>): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let page = pdfDoc.addPage([595, 842])
  const { height } = page.getSize()
  let y = height - MARGIN

  const addLine = (text: string, bold = false) => {
    if (y < MARGIN + 30) {
      page = pdfDoc.addPage([595, 842])
      y = height - MARGIN
    }
    const font = bold ? helveticaBold : helvetica
    page.drawText(text, {
      x: MARGIN,
      y,
      size: FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    })
    y -= LINE_HEIGHT
  }

  const add = (label: string, value: unknown) => {
    const val = formatValue(value)
    const full = `${label}: ${val}`
    for (const line of splitLongText(full)) addLine(line)
  }
  const addDate = (label: string, value: unknown) => {
    add(label, formatDate(value))
  }
  const section = (title: string) => {
    y -= 8
    if (y < MARGIN + 30) {
      page = pdfDoc.addPage([595, 842])
      y = height - MARGIN
    }
    page.drawText(title, {
      x: MARGIN,
      y,
      size: TITLE_SIZE,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    })
    y -= LINE_HEIGHT
  }

  addLine(`APPLICANT: ${formatValue(applicant.first_name)} ${formatValue(applicant.last_name)}`, true)
  y -= 4

  section("APPLICATION")
  add("Position Applied For", applicant.position_applied)
  add("Second Choice", applicant.second_choice_position)
  add("Preferred Branch", applicant.preferred_branch)
  add("Country Applying For", applicant.country_applying_for)
  add("Applicant Type", applicant.applicant_type)
  add("Status", applicant.status)
  addDate("Date Applied", applicant.date_applied ?? applicant.created_at)

  section("PERSONAL INFORMATION")
  add("Last Name", applicant.last_name)
  add("First Name", applicant.first_name)
  add("Middle Name", applicant.middle_name)
  add("Current Complete Address", applicant.current_address)
  add("Provincial Address", applicant.provincial_address)
  add("Contact Number", applicant.contact_number)
  add("Active Cellphone", applicant.active_cellphone)
  add("Email", applicant.email)
  addDate("Date of Birth", applicant.date_of_birth)
  add("Age", getAgeFromDob(applicant.date_of_birth))
  add("Place of Birth", applicant.place_of_birth)
  add("Religion", applicant.religion)
  add("Civil Status", applicant.civil_status)
  add("Height (cm)", applicant.height_cm)
  add("Weight (kg)", applicant.weight_kg)
  add("Facebook Account", applicant.facebook_account)

  section("FAMILY INFORMATION")
  add("Mother Full Name", applicant.mother_full_name)
  add("Mother Contact", applicant.mother_contact)
  add("Father Full Name", applicant.father_full_name)
  add("Father Contact", applicant.father_contact)
  add("Spouse Name", applicant.spouse_name)
  add("Spouse Age", applicant.spouse_age)
  add("Spouse Contact", applicant.spouse_contact)
  add("Number of Children", applicant.number_of_children)
  add("Children Ages", applicant.children_ages)
  add("Children Caretaker", applicant.children_caretaker)

  section("EMERGENCY CONTACT")
  add("Name", applicant.emergency_contact_name)
  add("Relationship", applicant.emergency_contact_relationship)
  add("Contact Number", applicant.emergency_contact_number)
  add("Address", applicant.emergency_contact_address)

  section("BENEFICIARIES")
  add("Beneficiary 1 Name", applicant.beneficiary1_name)
  addDate("Beneficiary 1 DOB", applicant.beneficiary1_dob)
  add("Beneficiary 1 Age", applicant.beneficiary1_age)
  add("Beneficiary 1 Relationship", applicant.beneficiary1_relationship)
  add("Beneficiary 1 Contact", applicant.beneficiary1_contact)
  add("Beneficiary 2 Name", applicant.beneficiary2_name)
  addDate("Beneficiary 2 DOB", applicant.beneficiary2_dob)
  add("Beneficiary 2 Age", applicant.beneficiary2_age)
  add("Beneficiary 2 Relationship", applicant.beneficiary2_relationship)
  add("Beneficiary 2 Contact", applicant.beneficiary2_contact)

  section("EDUCATIONAL BACKGROUND")
  add("Elementary School", applicant.elementary_school)
  add("Elementary Address", applicant.elementary_address)
  add("Elementary Year Graduated", applicant.elementary_year_graduated)
  add("High School", applicant.high_school)
  add("High School Address", applicant.high_school_address)
  add("High School Year Graduated", applicant.high_school_year_graduated)
  add("Vocational Course", applicant.vocational_course)
  add("Vocational School", applicant.vocational_school)
  add("Vocational Year Graduated", applicant.vocational_year_graduated)
  add("College Course", applicant.college_course)
  add("College School", applicant.college_school)
  add("College Year Graduated", applicant.college_year_graduated)

  section("WORK EXPERIENCE")
  const workExps = (applicant.work_experiences as WorkExp[] | undefined) ?? []
  if (workExps.length === 0) {
    addLine("No work experience recorded.")
  } else {
    workExps.forEach((w, idx) => {
      addLine(`Work ${idx + 1}:`, true)
      add("  Country", w.country)
      add("  Company", w.company)
      add("  Position", w.position)
      addDate("  Date Started", w.date_started)
      addDate("  Date Ended", w.date_ended)
      y -= 4
    })
  }

  section("SKILLS & LANGUAGE")
  add("Years of Experience", applicant.years_of_exp)
  add("Skills", applicant.skills)
  add("Notes", applicant.notes)
  add("English Level", applicant.english_level)
  add("Arabic Level", applicant.arabic_level)

  section("PASSPORT")
  add("Passport Number", applicant.passport_number)
  addDate("Date Issued", applicant.passport_date_issued)
  addDate("Date Expired", applicant.passport_date_expired)
  add("Place Issued", applicant.passport_place_issued)

  section("INTERVIEW")
  add("Remarks", applicant.interview_remarks)
  add("Interviewer Name", applicant.interviewer_name)
  addDate("Date Interviewed", applicant.date_interviewed)

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

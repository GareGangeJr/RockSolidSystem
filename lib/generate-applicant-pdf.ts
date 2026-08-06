import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { formatApplicantRef } from "@/lib/format-applicant-ref"

const COMPANY = "Rock Solid Manpower Network & Consultancy Inc."

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 48
const LABEL_X = MARGIN
const VALUE_X = 190
const VALUE_MAX_WIDTH = PAGE_WIDTH - MARGIN - VALUE_X
const LINE_HEIGHT = 13
const SECTION_GAP = 10
const FONT_SIZE = 9
const TITLE_SIZE = 16
const SECTION_SIZE = 10

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

type WorkExp = {
  country?: string
  company?: string
  position?: string
  date_started?: string
  date_ended?: string
}

type PdfContext = {
  pdfDoc: PDFDocument
  page: PDFPage
  y: number
  helvetica: PDFFont
  helveticaBold: PDFFont
  pageNumber: number
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : [""]
}

function newPage(ctx: PdfContext): PdfContext {
  const page = ctx.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const next = { ...ctx, page, y: PAGE_HEIGHT - MARGIN, pageNumber: ctx.pageNumber + 1 }
  drawFooter(next)
  return next
}

function ensureSpace(ctx: PdfContext, needed: number): PdfContext {
  if (ctx.y - needed < MARGIN + 24) return newPage(ctx)
  return ctx
}

function drawFooter(ctx: PdfContext) {
  const text = `Page ${ctx.pageNumber}`
  const width = ctx.helvetica.widthOfTextAtSize(text, 8)
  ctx.page.drawText(text, {
    x: (PAGE_WIDTH - width) / 2,
    y: 28,
    size: 8,
    font: ctx.helvetica,
    color: rgb(0.45, 0.45, 0.45),
  })
}

function drawCompanyHeader(ctx: PdfContext, applicantName: string, ref: string) {
  const { page } = ctx
  let y = ctx.y

  page.drawText(COMPANY, {
    x: MARGIN,
    y,
    size: 11,
    font: ctx.helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 18

  page.drawText("Applicant Application Form", {
    x: MARGIN,
    y,
    size: TITLE_SIZE,
    font: ctx.helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 20

  page.drawText(applicantName, {
    x: MARGIN,
    y,
    size: 12,
    font: ctx.helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  })
  y -= 16

  page.drawText(`Reference: ${ref}`, {
    x: MARGIN,
    y,
    size: 8,
    font: ctx.helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  y -= 8

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  })
  y -= SECTION_GAP

  drawFooter(ctx)
  return { ...ctx, y }
}

function drawSection(ctx: PdfContext, title: string): PdfContext {
  const next = ensureSpace(ctx, SECTION_GAP + LINE_HEIGHT + 6)
  next.y -= SECTION_GAP

  next.page.drawText(title, {
    x: LABEL_X,
    y: next.y,
    size: SECTION_SIZE,
    font: next.helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  })
  next.y -= 6

  next.page.drawLine({
    start: { x: LABEL_X, y: next.y },
    end: { x: PAGE_WIDTH - MARGIN, y: next.y },
    thickness: 0.5,
    color: rgb(0.82, 0.82, 0.82),
  })
  next.y -= LINE_HEIGHT

  return next
}

function drawField(ctx: PdfContext, label: string, value: unknown): PdfContext {
  const display = formatValue(value)
  const valueLines = wrapText(display, ctx.helvetica, FONT_SIZE, VALUE_MAX_WIDTH)
  const blockHeight = Math.max(LINE_HEIGHT, valueLines.length * LINE_HEIGHT)
  const next = ensureSpace(ctx, blockHeight + 2)

  next.page.drawText(label, {
    x: LABEL_X,
    y: next.y,
    size: FONT_SIZE,
    font: next.helveticaBold,
    color: rgb(0.35, 0.35, 0.35),
  })

  valueLines.forEach((line, index) => {
    next.page.drawText(line, {
      x: VALUE_X,
      y: next.y - index * LINE_HEIGHT,
      size: FONT_SIZE,
      font: next.helvetica,
      color: rgb(0.1, 0.1, 0.1),
    })
  })

  next.y -= blockHeight + 2
  return next
}

function drawDateField(ctx: PdfContext, label: string, value: unknown): PdfContext {
  return drawField(ctx, label, formatDate(value))
}

export async function applicantToPdf(applicant: Record<string, unknown>): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Applicant - ${formatValue(applicant.first_name)} ${formatValue(applicant.last_name)}`)
  pdfDoc.setAuthor(COMPANY)

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const fullName = [applicant.first_name, applicant.middle_name, applicant.last_name]
    .filter((part) => part != null && String(part).trim() !== "")
    .map(String)
    .join(" ")
  const ref = formatApplicantRef(Number(applicant.id))

  let ctx: PdfContext = {
    pdfDoc,
    page: pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: PAGE_HEIGHT - MARGIN,
    helvetica,
    helveticaBold,
    pageNumber: 1,
  }

  ctx = drawCompanyHeader(ctx, fullName.trim() ? fullName : "Applicant", ref)

  ctx = drawSection(ctx, "APPLICATION")
  ctx = drawField(ctx, "Position Applied For", applicant.position_applied)
  ctx = drawField(ctx, "Second Choice", applicant.second_choice_position)
  ctx = drawField(ctx, "Preferred Branch", applicant.preferred_branch)
  ctx = drawField(ctx, "Country Applying For", applicant.country_applying_for)
  ctx = drawField(ctx, "Applicant Type", applicant.applicant_type)
  ctx = drawField(ctx, "Status", applicant.status)
  ctx = drawDateField(ctx, "Date Applied", applicant.date_applied ?? applicant.created_at)

  ctx = drawSection(ctx, "PERSONAL INFORMATION")
  ctx = drawField(ctx, "Last Name", applicant.last_name)
  ctx = drawField(ctx, "First Name", applicant.first_name)
  ctx = drawField(ctx, "Middle Name", applicant.middle_name)
  ctx = drawField(ctx, "Current Address", applicant.current_address)
  ctx = drawField(ctx, "Provincial Address", applicant.provincial_address)
  ctx = drawField(ctx, "Contact Number", applicant.contact_number)
  ctx = drawField(ctx, "Active Cellphone", applicant.active_cellphone)
  ctx = drawField(ctx, "Email", applicant.email)
  ctx = drawDateField(ctx, "Date of Birth", applicant.date_of_birth)
  ctx = drawField(ctx, "Age", getAgeFromDob(applicant.date_of_birth))
  ctx = drawField(ctx, "Place of Birth", applicant.place_of_birth)
  ctx = drawField(ctx, "Religion", applicant.religion)
  ctx = drawField(ctx, "Civil Status", applicant.civil_status)
  ctx = drawField(ctx, "Sex", applicant.gender)
  ctx = drawField(ctx, "Height (cm)", applicant.height_cm)
  ctx = drawField(ctx, "Weight (kg)", applicant.weight_kg)
  ctx = drawField(ctx, "Facebook Account", applicant.facebook_account)

  ctx = drawSection(ctx, "FAMILY INFORMATION")
  ctx = drawField(ctx, "Mother", applicant.mother_full_name)
  ctx = drawField(ctx, "Mother Contact", applicant.mother_contact)
  ctx = drawField(ctx, "Father", applicant.father_full_name)
  ctx = drawField(ctx, "Father Contact", applicant.father_contact)
  ctx = drawField(ctx, "Spouse", applicant.spouse_name)
  ctx = drawField(ctx, "Spouse Age", applicant.spouse_age)
  ctx = drawField(ctx, "Spouse Contact", applicant.spouse_contact)
  ctx = drawField(ctx, "Number of Children", applicant.number_of_children)
  ctx = drawField(ctx, "Children Ages", applicant.children_ages)
  ctx = drawField(ctx, "Children Caretaker", applicant.children_caretaker)

  ctx = drawSection(ctx, "EMERGENCY CONTACT")
  ctx = drawField(ctx, "Name", applicant.emergency_contact_name)
  ctx = drawField(ctx, "Relationship", applicant.emergency_contact_relationship)
  ctx = drawField(ctx, "Contact Number", applicant.emergency_contact_number)
  ctx = drawField(ctx, "Address", applicant.emergency_contact_address)

  ctx = drawSection(ctx, "BENEFICIARIES")
  ctx = drawField(ctx, "Beneficiary 1", applicant.beneficiary1_name)
  ctx = drawDateField(ctx, "Beneficiary 1 DOB", applicant.beneficiary1_dob)
  ctx = drawField(ctx, "Beneficiary 1 Age", applicant.beneficiary1_age)
  ctx = drawField(ctx, "Beneficiary 1 Relationship", applicant.beneficiary1_relationship)
  ctx = drawField(ctx, "Beneficiary 1 Contact", applicant.beneficiary1_contact)
  ctx = drawField(ctx, "Beneficiary 2", applicant.beneficiary2_name)
  ctx = drawDateField(ctx, "Beneficiary 2 DOB", applicant.beneficiary2_dob)
  ctx = drawField(ctx, "Beneficiary 2 Age", applicant.beneficiary2_age)
  ctx = drawField(ctx, "Beneficiary 2 Relationship", applicant.beneficiary2_relationship)
  ctx = drawField(ctx, "Beneficiary 2 Contact", applicant.beneficiary2_contact)

  ctx = drawSection(ctx, "EDUCATION")
  ctx = drawField(ctx, "Elementary", applicant.elementary_school)
  ctx = drawField(ctx, "Elementary Address", applicant.elementary_address)
  ctx = drawField(ctx, "Elementary Year", applicant.elementary_year_graduated)
  ctx = drawField(ctx, "High School", applicant.high_school)
  ctx = drawField(ctx, "High School Address", applicant.high_school_address)
  ctx = drawField(ctx, "High School Year", applicant.high_school_year_graduated)
  ctx = drawField(ctx, "Vocational Course", applicant.vocational_course)
  ctx = drawField(ctx, "Vocational School", applicant.vocational_school)
  ctx = drawField(ctx, "Vocational Year", applicant.vocational_year_graduated)
  ctx = drawField(ctx, "College Course", applicant.college_course)
  ctx = drawField(ctx, "College School", applicant.college_school)
  ctx = drawField(ctx, "College Year", applicant.college_year_graduated)

  ctx = drawSection(ctx, "WORK EXPERIENCE")
  const workExps = (applicant.work_experiences as WorkExp[] | undefined) ?? []
  if (workExps.length === 0) {
    ctx = drawField(ctx, "Experience", "None recorded")
  } else {
    for (const [index, work] of workExps.entries()) {
      ctx = ensureSpace(ctx, LINE_HEIGHT * 6)
      ctx.page.drawText(`Entry ${index + 1}`, {
        x: LABEL_X,
        y: ctx.y,
        size: FONT_SIZE,
        font: ctx.helveticaBold,
        color: rgb(0.2, 0.2, 0.2),
      })
      ctx.y -= LINE_HEIGHT
      ctx = drawField(ctx, "Country", work.country)
      ctx = drawField(ctx, "Company", work.company)
      ctx = drawField(ctx, "Position", work.position)
      ctx = drawDateField(ctx, "Date Started", work.date_started)
      ctx = drawDateField(ctx, "Date Ended", work.date_ended)
      ctx.y -= 4
    }
  }

  ctx = drawSection(ctx, "SKILLS & LANGUAGE")
  ctx = drawField(ctx, "Years of Experience", applicant.years_of_exp)
  ctx = drawField(ctx, "Skills", applicant.skills)
  ctx = drawField(ctx, "English Level", applicant.english_level)
  ctx = drawField(ctx, "Arabic Level", applicant.arabic_level)
  ctx = drawField(ctx, "Notes", applicant.notes)

  ctx = drawSection(ctx, "PASSPORT")
  ctx = drawField(ctx, "Passport Number", applicant.passport_number)
  ctx = drawDateField(ctx, "Date Issued", applicant.passport_date_issued)
  ctx = drawDateField(ctx, "Date Expired", applicant.passport_date_expired)
  ctx = drawField(ctx, "Place Issued", applicant.passport_place_issued)

  ctx = drawSection(ctx, "INTERVIEW")
  ctx = drawField(ctx, "Interviewer", applicant.interviewer_name)
  ctx = drawDateField(ctx, "Date Interviewed", applicant.date_interviewed)
  ctx = drawField(ctx, "Remarks", applicant.interview_remarks)

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

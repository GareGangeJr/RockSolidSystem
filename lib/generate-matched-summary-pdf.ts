import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"

const COMPANY = "Rock Solid Manpower Network & Consultancy Inc."

const PAGE_WIDTH = 842
const PAGE_HEIGHT = 595
const MARGIN = 36
const ROW_HEIGHT = 16
const HEADER_HEIGHT = 18
const FONT_SIZE = 8
const TITLE_SIZE = 14

export type MatchedApplicantSummaryRow = {
  id: number
  ref: string
  name: string
  position: string | null
  country: string | null
  yearsExp: number | null
  gender: string | null
  status: string | null
  contact: string | null
}

type SummaryInput = {
  jobOrderId: number
  jobTitle: string | null
  company: string | null
  country: string | null
  applicants: MatchedApplicantSummaryRow[]
}

type Column = { header: string; width: number; getValue: (row: MatchedApplicantSummaryRow, index: number) => string }

function display(value: unknown) {
  if (value == null || value === "") return "—"
  return String(value)
}

function truncate(text: string, font: PDFFont, size: number, maxWidth: number) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text
  let trimmed = text
  while (trimmed.length > 0 && font.widthOfTextAtSize(`${trimmed}…`, size) > maxWidth) {
    trimmed = trimmed.slice(0, -1)
  }
  return trimmed ? `${trimmed}…` : "…"
}

const COLUMNS: Column[] = [
  { header: "#", width: 24, getValue: (_row, index) => String(index + 1) },
  { header: "Applicant ID", width: 72, getValue: (row) => row.ref },
  { header: "Name", width: 110, getValue: (row) => row.name },
  { header: "Position", width: 72, getValue: (row) => display(row.position) },
  { header: "Country", width: 72, getValue: (row) => display(row.country) },
  { header: "Yrs Exp", width: 44, getValue: (row) => display(row.yearsExp) },
  { header: "Gender", width: 44, getValue: (row) => display(row.gender) },
  { header: "Status", width: 88, getValue: (row) => display(row.status) },
  { header: "Contact", width: 80, getValue: (row) => display(row.contact) },
]

type PdfContext = {
  pdfDoc: PDFDocument
  page: PDFPage
  y: number
  helvetica: PDFFont
  helveticaBold: PDFFont
}

function newPage(ctx: PdfContext): PdfContext {
  const page = ctx.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  return { ...ctx, page, y: PAGE_HEIGHT - MARGIN }
}

function drawTableHeader(ctx: PdfContext): PdfContext {
  let updated = ctx
  if (updated.y - HEADER_HEIGHT < MARGIN + 24) {
    updated = newPage(updated)
  }

  let x = MARGIN
  const y = updated.y - HEADER_HEIGHT + 4

  for (const column of COLUMNS) {
    updated.page.drawText(column.header, {
      x: x + 4,
      y,
      size: FONT_SIZE,
      font: updated.helveticaBold,
      color: rgb(0.15, 0.15, 0.15),
    })
    x += column.width
  }

  updated.y -= HEADER_HEIGHT
  return updated
}

function drawTableRow(ctx: PdfContext, row: MatchedApplicantSummaryRow, index: number): PdfContext {
  let updated = ctx
  if (updated.y - ROW_HEIGHT < MARGIN + 24) {
    updated = newPage(updated)
    updated = drawTableHeader(updated)
  }

  let x = MARGIN
  const y = updated.y - ROW_HEIGHT + 4

  updated.page.drawLine({
    start: { x: MARGIN, y: updated.y - ROW_HEIGHT },
    end: { x: PAGE_WIDTH - MARGIN, y: updated.y - ROW_HEIGHT },
    thickness: 0.5,
    color: rgb(0.88, 0.88, 0.88),
  })

  for (const column of COLUMNS) {
    const value = truncate(column.getValue(row, index), updated.helvetica, FONT_SIZE, column.width - 8)
    updated.page.drawText(value, {
      x: x + 4,
      y,
      size: FONT_SIZE,
      font: updated.helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })
    x += column.width
  }

  updated.y -= ROW_HEIGHT
  return updated
}

export async function generateMatchedSummaryPdf(input: SummaryInput) {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const firstPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let ctx: PdfContext = {
    pdfDoc,
    page: firstPage,
    y: PAGE_HEIGHT - MARGIN,
    helvetica,
    helveticaBold,
  }

  ctx.page.drawText(COMPANY, {
    x: MARGIN,
    y: ctx.y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  ctx.y -= 18

  ctx.page.drawText("Matched Applicants Summary", {
    x: MARGIN,
    y: ctx.y,
    size: TITLE_SIZE,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  ctx.y -= 22

  const jobLine = `JO-${input.jobOrderId} · ${display(input.jobTitle)}${input.company ? ` · ${input.company}` : ""}`
  ctx.page.drawText(truncate(jobLine, helvetica, 10, PAGE_WIDTH - MARGIN * 2), {
    x: MARGIN,
    y: ctx.y,
    size: 10,
    font: helvetica,
    color: rgb(0.25, 0.25, 0.25),
  })
  ctx.y -= 14

  if (input.country) {
    ctx.page.drawText(`Country: ${input.country}`, {
      x: MARGIN,
      y: ctx.y,
      size: 9,
      font: helvetica,
      color: rgb(0.35, 0.35, 0.35),
    })
    ctx.y -= 14
  }

  ctx.page.drawText(`Total matched: ${input.applicants.length}`, {
    x: MARGIN,
    y: ctx.y,
    size: 9,
    font: helvetica,
    color: rgb(0.35, 0.35, 0.35),
  })
  ctx.y -= 24

  ctx = drawTableHeader(ctx)
  input.applicants.forEach((row, index) => {
    ctx = drawTableRow(ctx, row, index)
  })

  const bytes = await pdfDoc.save()
  return bytes
}

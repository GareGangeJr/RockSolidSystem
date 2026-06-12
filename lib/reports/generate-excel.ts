import ExcelJS from "exceljs"
import type {
  ApplicantReportRow,
  CountryCount,
  DeploymentReportRow,
  JobOrderReportRow,
  PlacementReportRow,
  PlacementStatusCount,
  ReportSummary,
} from "@/lib/reports/types"

const COMPANY = "Rock Solid Manpower Network & Consultancy Inc."

type ColumnDef<T> = {
  header: string
  key: keyof T
  width?: number
}

function thinBorder(): Partial<ExcelJS.Borders> {
  return {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
}

function display(value: unknown) {
  if (value == null || value === "") return "--"
  return value
}

function addPlainHeader(sheet: ExcelJS.Worksheet, title: string, colCount: number) {
  const lastCol = sheet.getColumn(colCount).letter

  sheet.mergeCells(`A1:${lastCol}1`)
  const companyCell = sheet.getCell("A1")
  companyCell.value = COMPANY
  companyCell.font = { bold: true, size: 12 }
  companyCell.alignment = { vertical: "middle", horizontal: "left" }
  sheet.getRow(1).height = 22

  sheet.mergeCells(`A2:${lastCol}2`)
  const titleCell = sheet.getCell("A2")
  titleCell.value = title
  titleCell.font = { bold: true, size: 14 }
  titleCell.alignment = { vertical: "middle", horizontal: "left" }
  sheet.getRow(2).height = 24

  sheet.getRow(3).height = 6
}

function styleHeaderRow(row: ExcelJS.Row, headers: string[]) {
  headers.forEach((header, index) => {
    const cell = row.getCell(index + 1)
    cell.value = header
    cell.font = { bold: true, size: 10 }
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }
    cell.border = thinBorder()
  })
  row.height = 24
}

function styleDataRow(row: ExcelJS.Row, colCount: number) {
  for (let col = 1; col <= colCount; col += 1) {
    const cell = row.getCell(col)
    cell.alignment = { vertical: "top", wrapText: true }
    cell.border = thinBorder()
    cell.font = { size: 10 }
  }
}

function addFooterRow(sheet: ExcelJS.Worksheet, rowNumber: number, colCount: number, text: string) {
  sheet.mergeCells(rowNumber, 1, rowNumber, colCount)
  const cell = sheet.getCell(rowNumber, 1)
  cell.value = text
  cell.font = { italic: true, size: 9 }
  cell.alignment = { horizontal: "left", vertical: "middle" }
  sheet.getRow(rowNumber).height = 18
}

function addDataSheet<T>(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  title: string,
  columns: ColumnDef<T>[],
  rows: T[],
  landscape = false
) {
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 4, activeCell: "A5" }],
    pageSetup: landscape
      ? { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
      : { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  })

  addPlainHeader(sheet, title, columns.length)
  styleHeaderRow(
    sheet.getRow(4),
    columns.map((column) => column.header)
  )

  columns.forEach((column, index) => {
    sheet.getColumn(index + 1).width = column.width ?? Math.max(14, Math.min(28, column.header.length + 4))
  })

  rows.forEach((row) => {
    const values = columns.map((column) => display(row[column.key]))
    const dataRow = sheet.addRow(values)
    styleDataRow(dataRow, columns.length)
  })

  const headerRowNumber = 4
  if (rows.length > 0) {
    sheet.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: columns.length },
    }
  }

  addFooterRow(
    sheet,
    headerRowNumber + rows.length + 1,
    columns.length,
    `Total records: ${rows.length}`
  )

  return sheet
}

const DEPLOYMENT_COLUMNS: ColumnDef<DeploymentReportRow>[] = [
  { header: "Monitoring ID", key: "monitoringId", width: 14 },
  { header: "Deployment Status", key: "deploymentStatus", width: 18 },
  { header: "Deployment Date", key: "deploymentDate", width: 16 },
  { header: "Last Status Update", key: "lastStatusUpdate", width: 18 },
  { header: "Applicant Ref", key: "applicantRef", width: 16 },
  { header: "Applicant Name", key: "applicantName", width: 22 },
  { header: "Middle Name", key: "middleName", width: 16 },
  { header: "Position Applied", key: "positionApplied", width: 18 },
  { header: "Second Choice", key: "secondChoicePosition", width: 16 },
  { header: "Preferred Branch", key: "preferredBranch", width: 16 },
  { header: "Applicant Type", key: "applicantType", width: 16 },
  { header: "Applicant Status", key: "applicantStatus", width: 18 },
  { header: "Contact Number", key: "contactNumber", width: 16 },
  { header: "Active Cellphone", key: "activeCellphone", width: 16 },
  { header: "Email", key: "email", width: 24 },
  { header: "Country Applying", key: "countryApplyingFor", width: 16 },
  { header: "Current Address", key: "currentAddress", width: 28 },
  { header: "Provincial Address", key: "provincialAddress", width: 24 },
  { header: "Date of Birth", key: "dateOfBirth", width: 14 },
  { header: "Age", key: "age", width: 10 },
  { header: "Gender", key: "gender", width: 12 },
  { header: "Civil Status", key: "civilStatus", width: 14 },
  { header: "Years of Experience", key: "yearsOfExp", width: 16 },
  { header: "Skills", key: "skills", width: 24 },
  { header: "English Level", key: "englishLevel", width: 14 },
  { header: "Arabic Level", key: "arabicLevel", width: 14 },
  { header: "Passport Number", key: "passportNumber", width: 16 },
  { header: "Passport Issued", key: "passportDateIssued", width: 14 },
  { header: "Passport Expiry", key: "passportDateExpired", width: 14 },
  { header: "Date Applied", key: "dateApplied", width: 14 },
  { header: "Date Interviewed", key: "dateInterviewed", width: 16 },
  { header: "Interview Remarks", key: "interviewRemarks", width: 24 },
  { header: "Job Order Ref", key: "jobOrderRef", width: 14 },
  { header: "Job Title", key: "jobTitle", width: 20 },
  { header: "Company", key: "company", width: 22 },
  { header: "Destination Country", key: "destinationCountry", width: 18 },
  { header: "Job Order Status", key: "jobOrderStatus", width: 16 },
  { header: "Gender Required", key: "genderRequired", width: 14 },
  { header: "Workers Needed", key: "workersNeeded", width: 14 },
  { header: "Years Exp Required", key: "yearsExpRequired", width: 16 },
  { header: "Skills Required", key: "skillsRequired", width: 24 },
  { header: "Job Salary", key: "jobSalary", width: 16 },
  { header: "Job Created", key: "jobCreatedAt", width: 14 },
  { header: "Employer Name", key: "employerName", width: 20 },
  { header: "Contract Duration", key: "contractDuration", width: 16 },
  { header: "Deployment Salary", key: "deploymentSalary", width: 16 },
  { header: "Date of Departure", key: "dateOfDeparture", width: 16 },
  { header: "Date of Arrival", key: "dateOfArrival", width: 16 },
  { header: "Welfare Officer", key: "welfareOfficer", width: 18 },
  { header: "Concern Type", key: "concernType", width: 16 },
  { header: "Concern Date", key: "concernDateReported", width: 14 },
  { header: "Concern Status", key: "concernStatus", width: 16 },
  { header: "Action Taken", key: "actionTaken", width: 28 },
  { header: "Expected Return", key: "expectedReturnDate", width: 16 },
  { header: "Actual Return", key: "actualReturnDate", width: 14 },
  { header: "Reason for Return", key: "reasonForReturn", width: 20 },
  { header: "Will Extend Contract", key: "willExtendContract", width: 18 },
]

const JOB_ORDER_COLUMNS: ColumnDef<JobOrderReportRow>[] = [
  { header: "Job Order Ref", key: "ref", width: 14 },
  { header: "Company", key: "company", width: 24 },
  { header: "Country", key: "country", width: 16 },
  { header: "Job Title", key: "jobTitle", width: 22 },
  { header: "Status", key: "status", width: 14 },
  { header: "Gender", key: "gender", width: 12 },
  { header: "Workers Needed", key: "noWorkers", width: 14 },
  { header: "Matched Applicants", key: "matchedCount", width: 16 },
  { header: "Slots Remaining", key: "slotsRemaining", width: 16 },
  { header: "Fulfillment %", key: "fulfillmentPercent", width: 14 },
  { header: "Years Exp Required", key: "yearsExpRequired", width: 16 },
  { header: "Skills Required", key: "skillsRequired", width: 28 },
  { header: "Salary", key: "salary", width: 16 },
  { header: "Date Created", key: "createdAt", width: 14 },
]

const APPLICANT_COLUMNS: ColumnDef<ApplicantReportRow>[] = [
  { header: "Applicant Ref", key: "ref", width: 16 },
  { header: "Last Name", key: "lastName", width: 18 },
  { header: "First Name", key: "firstName", width: 18 },
  { header: "Middle Name", key: "middleName", width: 16 },
  { header: "Position Applied", key: "positionApplied", width: 18 },
  { header: "Second Choice", key: "secondChoicePosition", width: 16 },
  { header: "Preferred Branch", key: "preferredBranch", width: 16 },
  { header: "Country Applying", key: "countryApplyingFor", width: 16 },
  { header: "Applicant Type", key: "applicantType", width: 16 },
  { header: "Status", key: "status", width: 18 },
  { header: "Contact Number", key: "contactNumber", width: 16 },
  { header: "Active Cellphone", key: "activeCellphone", width: 16 },
  { header: "Email", key: "email", width: 24 },
  { header: "Current Address", key: "currentAddress", width: 28 },
  { header: "Provincial Address", key: "provincialAddress", width: 24 },
  { header: "Date of Birth", key: "dateOfBirth", width: 14 },
  { header: "Age", key: "age", width: 10 },
  { header: "Place of Birth", key: "placeOfBirth", width: 18 },
  { header: "Religion", key: "religion", width: 14 },
  { header: "Civil Status", key: "civilStatus", width: 14 },
  { header: "Gender", key: "gender", width: 12 },
  { header: "Height (cm)", key: "heightCm", width: 12 },
  { header: "Weight (kg)", key: "weightKg", width: 12 },
  { header: "Years of Experience", key: "yearsOfExp", width: 16 },
  { header: "Skills", key: "skills", width: 24 },
  { header: "English Level", key: "englishLevel", width: 14 },
  { header: "Arabic Level", key: "arabicLevel", width: 14 },
  { header: "Passport Number", key: "passportNumber", width: 16 },
  { header: "Passport Issued", key: "passportDateIssued", width: 14 },
  { header: "Passport Expiry", key: "passportDateExpired", width: 14 },
  { header: "Passport Place Issued", key: "passportPlaceIssued", width: 18 },
  { header: "Date Applied", key: "dateApplied", width: 14 },
  { header: "Date Interviewed", key: "dateInterviewed", width: 16 },
  { header: "Interviewer", key: "interviewerName", width: 18 },
  { header: "Interview Remarks", key: "interviewRemarks", width: 24 },
  { header: "Emergency Contact", key: "emergencyContactName", width: 20 },
  { header: "Emergency Number", key: "emergencyContactNumber", width: 16 },
  { header: "Work Experience", key: "workExperienceSummary", width: 36 },
  { header: "Education", key: "educationSummary", width: 36 },
  { header: "Notes", key: "notes", width: 28 },
]

const PLACEMENT_COLUMNS: ColumnDef<PlacementReportRow>[] = [
  { header: "Applicant Ref", key: "applicantRef", width: 16 },
  { header: "Applicant Name", key: "applicantName", width: 22 },
  { header: "Position Applied", key: "positionApplied", width: 18 },
  { header: "Job Order Ref", key: "jobOrderRef", width: 14 },
  { header: "Job Title", key: "jobTitle", width: 22 },
  { header: "Company", key: "company", width: 22 },
  { header: "Country", key: "country", width: 16 },
  { header: "Job Order Status", key: "jobOrderStatus", width: 16 },
]

function addPlainTable(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  headers: string[],
  rows: (string | number)[][]
) {
  const headerRow = sheet.getRow(startRow)
  styleHeaderRow(headerRow, headers)

  rows.forEach((values, index) => {
    const dataRow = sheet.getRow(startRow + 1 + index)
    dataRow.values = values
    styleDataRow(dataRow, headers.length)
  })

  return startRow + rows.length
}

function addOverviewSheet(
  workbook: ExcelJS.Workbook,
  summary: ReportSummary,
  countryCounts: CountryCount[],
  statusCounts: PlacementStatusCount[]
) {
  const sheet = workbook.addWorksheet("Summary", {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  })

  addPlainHeader(sheet, "Deployment Report", 5)

  const metrics: [string, number | string][] = [
    ["Total deployments", summary.totalPlacements],
    ["Currently deployed", summary.totalDeployed],
    ["Deployed with concerns", summary.withConcerns],
    ["Deployed this month", summary.deployedThisMonth],
    ["Matched to a job", summary.matchedApplicants],
    ["Total applicants", summary.totalApplicants],
    ["Total job orders", summary.totalJobOrders],
    ["Open job orders", summary.openJobOrders],
  ]

  sheet.getCell("A4").value = "Quick summary"
  sheet.getCell("A4").font = { bold: true, size: 11 }

  const metricsEnd = addPlainTable(
    sheet,
    5,
    ["Metric", "Count"],
    metrics.map(([label, value]) => [label, value])
  )

  const countryStart = metricsEnd + 3
  sheet.getCell(`A${countryStart}`).value = "Deployments by country"
  sheet.getCell(`A${countryStart}`).font = { bold: true, size: 11 }

  const countryEnd = addPlainTable(
    sheet,
    countryStart + 1,
    ["Country", "Deployments"],
    countryCounts.map((row) => [row.country, row.count])
  )

  const statusStart = countryEnd + 3
  sheet.getCell(`A${statusStart}`).value = "Applicants by status"
  sheet.getCell(`A${statusStart}`).font = { bold: true, size: 11 }

  addPlainTable(
    sheet,
    statusStart + 1,
    ["Status", "Count"],
    statusCounts.map((row) => [row.status, row.count])
  )

  sheet.getColumn(1).width = 28
  sheet.getColumn(2).width = 16
}

export async function generateReportsExcel(options: {
  generatedAt: string
  summary: ReportSummary
  countryCounts: CountryCount[]
  statusCounts: PlacementStatusCount[]
  deployments: DeploymentReportRow[]
  jobOrders: JobOrderReportRow[]
  applicants: ApplicantReportRow[]
  placements: PlacementReportRow[]
}) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = COMPANY
  workbook.created = new Date(options.generatedAt)
  workbook.company = COMPANY

  addOverviewSheet(workbook, options.summary, options.countryCounts, options.statusCounts)

  addDataSheet(
    workbook,
    "Deployments",
    "Deployment Report",
    DEPLOYMENT_COLUMNS,
    options.deployments,
    true
  )

  addDataSheet(
    workbook,
    "Job Orders",
    "Job Orders",
    JOB_ORDER_COLUMNS,
    options.jobOrders,
    true
  )

  addDataSheet(
    workbook,
    "Applicants",
    "Applicants",
    APPLICANT_COLUMNS,
    options.applicants,
    true
  )

  addDataSheet(
    workbook,
    "Placements",
    "Placements",
    PLACEMENT_COLUMNS,
    options.placements,
    true
  )

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

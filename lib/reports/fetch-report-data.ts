import { formatApplicantRef } from "@/lib/format-applicant-ref"
import {
  concernEntryHasData,
  historyEntryHasData,
  normalizeConcernEntriesFromRecord,
  normalizeHistoryEntriesFromRecord,
} from "@/lib/monitoring-entries"
import { createSupabaseServer } from "@/lib/supabase/server"
import type {
  ApplicantReportRow,
  CountryCount,
  DeploymentReportRow,
  JobOrderReportRow,
  MonitoringReportRow,
  PlacementStatusCount,
  ReportData,
  ReportSummary,
} from "@/lib/reports/types"
import { isDeploymentInDateRange } from "@/lib/reports/date-range"

function cell(value: unknown) {
  if (value == null || value === "") return null
  return String(value)
}

function dateOnly(value: string | null | undefined) {
  if (!value) return null
  return value.slice(0, 10)
}

function jobOrderRef(id: number) {
  return `JO-${id}`
}

function formatWorkExperiences(exps: unknown) {
  if (!Array.isArray(exps) || exps.length === 0) return null
  return exps
    .map((item, index) => {
      const w = item as Record<string, unknown>
      const parts = [
        w.company,
        w.position,
        w.country,
        w.date_started && w.date_ended ? `${String(w.date_started).slice(0, 10)} to ${String(w.date_ended).slice(0, 10)}` : null,
      ].filter(Boolean)
      return `#${index + 1} ${parts.join(" | ")}`
    })
    .join("; ")
}

function formatEducation(applicant: Record<string, unknown>) {
  const parts = [
    applicant.elementary_school ? `Elem: ${applicant.elementary_school}` : null,
    applicant.high_school ? `HS: ${applicant.high_school}` : null,
    applicant.vocational_course ? `Voc: ${applicant.vocational_course}` : null,
    applicant.college_course ? `College: ${applicant.college_course}` : null,
  ].filter(Boolean)
  return parts.length ? parts.join("; ") : null
}

function formatAllConcerns(record: Record<string, unknown>) {
  const entries = normalizeConcernEntriesFromRecord(record).filter(concernEntryHasData)
  if (entries.length === 0) return null
  return entries
    .map((entry, index) => {
      const parts = [
        entry.concern_type,
        entry.concern_date_reported,
        entry.concern_status,
        entry.action_taken || null,
      ].filter(Boolean)
      return `#${index + 1} ${parts.join(" | ")}`
    })
    .join("; ")
}

function formatAllHistory(record: Record<string, unknown>) {
  const entries = normalizeHistoryEntriesFromRecord(record).filter(historyEntryHasData)
  if (entries.length === 0) return null
  return entries
    .map((entry, index) => {
      const parts = [
        entry.entry_date ? `Entry: ${entry.entry_date}` : null,
        entry.date_of_arrival ? `Arrival: ${entry.date_of_arrival}` : null,
        entry.expected_return_date ? `ETA: ${entry.expected_return_date}` : null,
        entry.actual_return_date ? `Return: ${entry.actual_return_date}` : null,
        entry.reason_for_return || null,
        entry.will_extend_contract ? `Extend: ${entry.will_extend_contract}` : null,
        entry.notes || null,
      ].filter(Boolean)
      return `#${index + 1} ${parts.join(" | ")}`
    })
    .join("; ")
}

function mapApplicantRow(applicant: Record<string, unknown>): ApplicantReportRow {
  const id = Number(applicant.id)
  return {
    id,
    ref: formatApplicantRef(id),
    lastName: cell(applicant.last_name),
    firstName: cell(applicant.first_name),
    middleName: cell(applicant.middle_name),
    positionApplied: cell(applicant.position_applied),
    secondChoicePosition: cell(applicant.second_choice_position),
    preferredBranch: cell(applicant.preferred_branch),
    countryApplyingFor: cell(applicant.country_applying_for),
    applicantType: cell(applicant.applicant_type),
    status: cell(applicant.status),
    contactNumber: cell(applicant.contact_number),
    activeCellphone: cell(applicant.active_cellphone),
    email: cell(applicant.email),
    currentAddress: cell(applicant.current_address),
    provincialAddress: cell(applicant.provincial_address),
    dateOfBirth: dateOnly(applicant.date_of_birth as string | null),
    age: cell(applicant.age),
    placeOfBirth: cell(applicant.place_of_birth),
    religion: cell(applicant.religion),
    civilStatus: cell(applicant.civil_status),
    gender: cell(applicant.gender),
    heightCm: cell(applicant.height_cm),
    weightKg: cell(applicant.weight_kg),
    yearsOfExp: cell(applicant.years_of_exp),
    skills: cell(applicant.skills),
    englishLevel: cell(applicant.english_level),
    arabicLevel: cell(applicant.arabic_level),
    passportNumber: cell(applicant.passport_number),
    passportDateIssued: dateOnly(applicant.passport_date_issued as string | null),
    passportDateExpired: dateOnly(applicant.passport_date_expired as string | null),
    passportPlaceIssued: cell(applicant.passport_place_issued),
    dateApplied: dateOnly(applicant.date_applied as string | null),
    dateInterviewed: dateOnly(applicant.date_interviewed as string | null),
    interviewerName: cell(applicant.interviewer_name),
    interviewRemarks: cell(applicant.interview_remarks),
    emergencyContactName: cell(applicant.emergency_contact_name),
    emergencyContactNumber: cell(applicant.emergency_contact_number),
    workExperienceSummary: formatWorkExperiences(applicant.work_experiences),
    educationSummary: formatEducation(applicant),
    notes: cell(applicant.notes),
  }
}

export async function fetchReportData(): Promise<ReportData> {
  const supabase = await createSupabaseServer()

  const [
    { data: monitoringRecords },
    { data: applicants },
    { data: jobOrders },
    { data: placements },
    { count: matchedCount },
  ] = await Promise.all([
    supabase.from("monitoring").select("*").is("archived_at", null).order("deployment_date", { ascending: false }),
    supabase.from("applicants").select("*").is("archived_at", null).order("created_at", { ascending: false }),
    supabase.from("job_orders").select("*").is("archived_at", null).order("created_at", { ascending: false }),
    supabase.from("placements").select("*"),
    supabase.from("placements").select("*", { count: "exact", head: true }),
  ])

  const applicantRows = (applicants ?? []).map((row) => mapApplicantRow(row as Record<string, unknown>))
  const applicantById = new Map(applicantRows.map((row) => [row.id, row]))
  const jobOrderById = new Map((jobOrders ?? []).map((order) => [order.id, order]))

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const deployments: DeploymentReportRow[] = (monitoringRecords ?? []).map((record) => {
    const row = record as Record<string, unknown>
    const applicant = applicantById.get(record.applicant_id)
    const jobOrder = jobOrderById.get(record.job_order_id)
    const name = [applicant?.firstName, applicant?.lastName].filter(Boolean).join(" ") || "--"
    const departureDate = dateOnly(record.deployment_date) ?? dateOnly(record.date_of_departure)

    return {
      monitoringId: record.id,
      deploymentStatus: cell(record.deployment_status) ?? "--",
      deploymentDate: departureDate,
      lastStatusUpdate: dateOnly(record.last_status_update),
      applicantId: record.applicant_id,
      applicantRef: formatApplicantRef(record.applicant_id),
      applicantName: name,
      middleName: applicant?.middleName ?? null,
      positionApplied: applicant?.positionApplied ?? "--",
      secondChoicePosition: applicant?.secondChoicePosition ?? null,
      preferredBranch: applicant?.preferredBranch ?? null,
      applicantType: applicant?.applicantType ?? null,
      applicantStatus: applicant?.status ?? "--",
      contactNumber: applicant?.contactNumber ?? null,
      activeCellphone: applicant?.activeCellphone ?? null,
      email: applicant?.email ?? null,
      countryApplyingFor: applicant?.countryApplyingFor ?? null,
      currentAddress: applicant?.currentAddress ?? null,
      provincialAddress: applicant?.provincialAddress ?? null,
      dateOfBirth: applicant?.dateOfBirth ?? null,
      age: applicant?.age ?? null,
      gender: applicant?.gender ?? null,
      civilStatus: applicant?.civilStatus ?? null,
      yearsOfExp: applicant?.yearsOfExp ?? null,
      skills: applicant?.skills ?? null,
      englishLevel: applicant?.englishLevel ?? null,
      arabicLevel: applicant?.arabicLevel ?? null,
      passportNumber: applicant?.passportNumber ?? null,
      passportDateIssued: applicant?.passportDateIssued ?? null,
      passportDateExpired: applicant?.passportDateExpired ?? null,
      dateApplied: applicant?.dateApplied ?? null,
      dateInterviewed: applicant?.dateInterviewed ?? null,
      interviewRemarks: applicant?.interviewRemarks ?? null,
      jobOrderId: record.job_order_id,
      jobOrderRef: jobOrderRef(record.job_order_id),
      jobTitle: cell(jobOrder?.job_title) ?? "--",
      company: cell(jobOrder?.company) ?? "--",
      destinationCountry: cell(jobOrder?.country) ?? "--",
      jobOrderStatus: cell(jobOrder?.status),
      genderRequired: cell(jobOrder?.gender),
      workersNeeded: cell(jobOrder?.no_workers),
      yearsExpRequired: cell(jobOrder?.years_exp_required),
      skillsRequired: cell(jobOrder?.skills_required),
      jobSalary: cell(jobOrder?.salary),
      jobCreatedAt: dateOnly(jobOrder?.created_at),
      employerName: cell(record.employer_name),
      contractDuration: cell(record.contract_duration),
      deploymentSalary: cell(record.salary_amount),
      dateOfDeparture: departureDate,
      dateOfArrival: dateOnly(record.date_of_arrival),
      welfareOfficer: cell(record.welfare_officer),
      concernType: cell(record.concern_type),
      concernDateReported: dateOnly(record.concern_date_reported),
      concernStatus: cell(record.concern_status),
      actionTaken: cell(record.action_taken),
      expectedReturnDate: dateOnly(record.expected_return_date),
      actualReturnDate: dateOnly(record.actual_return_date),
      reasonForReturn: cell(record.reason_for_return),
      willExtendContract: cell(record.will_extend_contract),
      allConcernsSummary: formatAllConcerns(row),
      allHistorySummary: formatAllHistory(row),
    }
  })

  const monitoring: MonitoringReportRow[] = (monitoringRecords ?? []).map((record) => {
    const row = record as Record<string, unknown>
    const applicant = applicantById.get(record.applicant_id)
    const jobOrder = jobOrderById.get(record.job_order_id)
    const name = [applicant?.firstName, applicant?.lastName].filter(Boolean).join(" ") || "--"
    const departureDate = dateOnly(record.deployment_date) ?? dateOnly(record.date_of_departure)

    return {
      monitoringId: record.id,
      applicantRef: formatApplicantRef(record.applicant_id),
      applicantName: name,
      contactNumber: applicant?.contactNumber ?? null,
      passportNumber: applicant?.passportNumber ?? null,
      jobOrderRef: jobOrderRef(record.job_order_id),
      jobTitle: cell(jobOrder?.job_title) ?? "--",
      company: cell(jobOrder?.company) ?? "--",
      country: cell(jobOrder?.country) ?? "--",
      deploymentStatus: cell(record.deployment_status) ?? "--",
      departureDate,
      employerName: cell(record.employer_name),
      contractDuration: cell(record.contract_duration),
      salaryAmount: cell(record.salary_amount),
      welfareOfficer: cell(record.welfare_officer),
      lastStatusUpdate: dateOnly(record.last_status_update),
      concernStatus: cell(record.concern_status),
      concernType: cell(record.concern_type),
      concernDateReported: dateOnly(record.concern_date_reported),
      actionTaken: cell(record.action_taken),
      allConcernsSummary: formatAllConcerns(row),
      expectedReturnDate: dateOnly(record.expected_return_date),
      actualReturnDate: dateOnly(record.actual_return_date),
      dateOfArrival: dateOnly(record.date_of_arrival),
      reasonForReturn: cell(record.reason_for_return),
      willExtendContract: cell(record.will_extend_contract),
      allHistorySummary: formatAllHistory(row),
    }
  })

  const countryMap = new Map<string, number>()
  for (const row of deployments) {
    const country = row.destinationCountry === "--" ? "Unknown" : row.destinationCountry
    countryMap.set(country, (countryMap.get(country) ?? 0) + 1)
  }
  const countryCounts: CountryCount[] = [...countryMap.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  const statusMap = new Map<string, number>()
  for (const applicant of applicantRows) {
    const status = applicant.status?.trim() || "Unknown"
    statusMap.set(status, (statusMap.get(status) ?? 0) + 1)
  }
  const statusCounts: PlacementStatusCount[] = [...statusMap.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)

  const deployedThisMonth = deployments.filter((row) => {
    if (!row.deploymentDate) return false
    return new Date(row.deploymentDate) >= monthStart
  }).length

  const matchCountByJob = new Map<number, number>()
  for (const placement of placements ?? []) {
    matchCountByJob.set(
      placement.job_order_id,
      (matchCountByJob.get(placement.job_order_id) ?? 0) + 1
    )
  }

  const jobOrderRows: JobOrderReportRow[] = (jobOrders ?? []).map((order) => {
    const matchedCount = matchCountByJob.get(order.id) ?? 0
    const needed = order.no_workers ?? 0
    const slotsRemaining = needed > 0 ? Math.max(needed - matchedCount, 0) : null
    const fulfillmentPercent =
      needed > 0 ? `${Math.min(100, Math.round((matchedCount / needed) * 100))}%` : null

    return {
      id: order.id,
      ref: jobOrderRef(order.id),
      company: cell(order.company),
      country: cell(order.country),
      jobTitle: cell(order.job_title),
      status: cell(order.status),
      gender: cell(order.gender),
      noWorkers: order.no_workers ?? null,
      yearsExpRequired: order.years_exp_required ?? null,
      skillsRequired: cell(order.skills_required),
      salary: cell(order.salary),
      commercialRegistration: cell(order.commercial_registration),
      companyAddress: cell(order.company_address),
      companyContact: cell(order.company_contact),
      jobOrderDate: dateOnly(order.job_order_date),
      visaNumber: cell(order.visa_number),
      visaDate: dateOnly(order.visa_date),
      visaCategory: cell(order.visa_category),
      contractPeriod: cell(order.contract_period),
      workSite: cell(order.work_site),
      workingHours: cell(order.working_hours),
      benefitsAndTerms: cell(order.benefits_and_terms),
      createdAt: dateOnly(order.created_at),
      matchedCount,
      slotsRemaining,
      fulfillmentPercent,
    }
  })

  const summary: ReportSummary = {
    totalPlacements: deployments.length,
    totalDeployed: deployments.filter((r) => r.deploymentStatus === "Deployed").length,
    withConcerns: deployments.filter((r) => r.deploymentStatus === "Deployed(With Concerns)").length,
    deployedThisMonth,
    matchedApplicants: matchedCount ?? 0,
    totalApplicants: applicantRows.length,
    totalJobOrders: jobOrderRows.length,
    openJobOrders: jobOrderRows.filter((row) => row.status === "Open").length,
  }

  return {
    generatedAt: now.toISOString(),
    summary,
    countryCounts,
    statusCounts,
    deployments,
    monitoring,
    jobOrders: jobOrderRows,
    applicants: applicantRows,
  }
}

export function filterMonitoring(
  monitoring: MonitoringReportRow[],
  countryFilter?: string | null,
  statusFilter?: string | null
) {
  let list = monitoring
  if (countryFilter && countryFilter !== "All") {
    list = list.filter((row) => row.country === countryFilter)
  }
  if (statusFilter && statusFilter !== "All") {
    list = list.filter((row) => row.deploymentStatus === statusFilter)
  }
  return list
}

export function filterMonitoringByDateRange(
  monitoring: MonitoringReportRow[],
  fromDate: string | null,
  toDate: string | null
) {
  if (!fromDate && !toDate) return monitoring
  return monitoring.filter((row) => isDeploymentInDateRange(row.departureDate, fromDate, toDate))
}

export function filterDeployments(
  deployments: DeploymentReportRow[],
  countryFilter?: string | null,
  statusFilter?: string | null
) {
  let list = deployments
  if (countryFilter && countryFilter !== "All") {
    list = list.filter((row) => row.destinationCountry === countryFilter)
  }
  if (statusFilter && statusFilter !== "All") {
    list = list.filter((row) => row.deploymentStatus === statusFilter)
  }
  return list
}

export type ReportSummary = {
  totalPlacements: number
  totalDeployed: number
  withConcerns: number
  deployedThisMonth: number
  matchedApplicants: number
  totalApplicants: number
  totalJobOrders: number
  openJobOrders: number
}

export type CountryCount = {
  country: string
  count: number
}

export type PlacementStatusCount = {
  status: string
  count: number
}

export type DeploymentReportRow = {
  monitoringId: number
  deploymentStatus: string
  deploymentDate: string | null
  lastStatusUpdate: string | null
  applicantId: number
  applicantRef: string
  applicantName: string
  middleName: string | null
  positionApplied: string
  secondChoicePosition: string | null
  preferredBranch: string | null
  applicantType: string | null
  applicantStatus: string
  contactNumber: string | null
  activeCellphone: string | null
  email: string | null
  countryApplyingFor: string | null
  currentAddress: string | null
  provincialAddress: string | null
  dateOfBirth: string | null
  age: string | null
  gender: string | null
  civilStatus: string | null
  yearsOfExp: string | null
  skills: string | null
  englishLevel: string | null
  arabicLevel: string | null
  passportNumber: string | null
  passportDateIssued: string | null
  passportDateExpired: string | null
  dateApplied: string | null
  dateInterviewed: string | null
  interviewRemarks: string | null
  jobOrderId: number
  jobOrderRef: string
  jobTitle: string
  company: string
  destinationCountry: string
  jobOrderStatus: string | null
  genderRequired: string | null
  workersNeeded: string | null
  yearsExpRequired: string | null
  skillsRequired: string | null
  jobSalary: string | null
  jobCreatedAt: string | null
  employerName: string | null
  contractDuration: string | null
  deploymentSalary: string | null
  dateOfDeparture: string | null
  dateOfArrival: string | null
  welfareOfficer: string | null
  concernType: string | null
  concernDateReported: string | null
  concernStatus: string | null
  actionTaken: string | null
  expectedReturnDate: string | null
  actualReturnDate: string | null
  reasonForReturn: string | null
  willExtendContract: string | null
  allConcernsSummary: string | null
  allHistorySummary: string | null
}

export type MonitoringReportRow = {
  monitoringId: number
  applicantRef: string
  applicantName: string
  contactNumber: string | null
  passportNumber: string | null
  jobOrderRef: string
  jobTitle: string
  company: string
  country: string
  deploymentStatus: string
  departureDate: string | null
  employerName: string | null
  contractDuration: string | null
  salaryAmount: string | null
  welfareOfficer: string | null
  lastStatusUpdate: string | null
  concernStatus: string | null
  concernType: string | null
  concernDateReported: string | null
  actionTaken: string | null
  allConcernsSummary: string | null
  expectedReturnDate: string | null
  actualReturnDate: string | null
  dateOfArrival: string | null
  reasonForReturn: string | null
  willExtendContract: string | null
  allHistorySummary: string | null
}

export type JobOrderReportRow = {
  id: number
  ref: string
  company: string | null
  country: string | null
  jobTitle: string | null
  status: string | null
  gender: string | null
  noWorkers: number | null
  yearsExpRequired: number | null
  skillsRequired: string | null
  salary: string | null
  commercialRegistration: string | null
  companyAddress: string | null
  companyContact: string | null
  jobOrderDate: string | null
  visaNumber: string | null
  visaDate: string | null
  visaCategory: string | null
  contractPeriod: string | null
  workSite: string | null
  workingHours: string | null
  benefitsAndTerms: string | null
  createdAt: string | null
  matchedCount: number
  slotsRemaining: number | null
  fulfillmentPercent: string | null
}

export type ApplicantReportRow = {
  id: number
  ref: string
  lastName: string | null
  firstName: string | null
  middleName: string | null
  positionApplied: string | null
  secondChoicePosition: string | null
  preferredBranch: string | null
  countryApplyingFor: string | null
  applicantType: string | null
  status: string | null
  contactNumber: string | null
  activeCellphone: string | null
  email: string | null
  currentAddress: string | null
  provincialAddress: string | null
  dateOfBirth: string | null
  age: string | null
  placeOfBirth: string | null
  religion: string | null
  civilStatus: string | null
  gender: string | null
  heightCm: string | null
  weightKg: string | null
  yearsOfExp: string | null
  skills: string | null
  englishLevel: string | null
  arabicLevel: string | null
  passportNumber: string | null
  passportDateIssued: string | null
  passportDateExpired: string | null
  passportPlaceIssued: string | null
  dateApplied: string | null
  dateInterviewed: string | null
  interviewerName: string | null
  interviewRemarks: string | null
  emergencyContactName: string | null
  emergencyContactNumber: string | null
  workExperienceSummary: string | null
  educationSummary: string | null
  notes: string | null
}

export type ReportData = {
  generatedAt: string
  summary: ReportSummary
  countryCounts: CountryCount[]
  statusCounts: PlacementStatusCount[]
  deployments: DeploymentReportRow[]
  monitoring: MonitoringReportRow[]
  jobOrders: JobOrderReportRow[]
  applicants: ApplicantReportRow[]
}

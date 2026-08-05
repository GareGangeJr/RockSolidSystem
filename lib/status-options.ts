export const STATUS_OPTIONS = [

  "New Applicant",

  "Selected",

  "With Visa & Contract",

  "Docs on Process",

  "For Booking",

  "Deployed",

  "Deployed(With Concerns)",

  "Finish Contract",

  "Cancelled",

  "Deported",

] as const

export const MATCH_EXCLUDED_STATUSES = new Set<string>([
  "Deployed",
  "Deployed(With Concerns)",
  "Finish Contract",
  "Cancelled",
  "Deported",
])

export const DEPLOY_VIA_MATCH_STATUSES = new Set<string>(["Deployed", "Deployed(With Concerns)"])

export function getSelectableApplicantStatusOptions(currentStatus?: string | null): string[] {
  const current = currentStatus?.trim() || null
  return STATUS_OPTIONS.filter((opt) => {
    if (!DEPLOY_VIA_MATCH_STATUSES.has(opt)) return true
    return opt === current
  }).map(String)
}

export function isEligibleForJobMatching(status: string | null | undefined) {
  if (!status) return true
  return !MATCH_EXCLUDED_STATUSES.has(status)
}

export const APPLICANT_TYPE_OPTIONS = [
  "Domestic Helper",
  "Skilled Worker",
  "Online Application - Domestic Helper",
  "Online Application - Skilled",
  "Online Application",
] as const

export const ONLINE_APPLICANT_TYPE = "Online Application" as const
export const ONLINE_APPLICANT_TYPE_DH = "Online Application - Domestic Helper" as const
export const ONLINE_APPLICANT_TYPE_SKILLED = "Online Application - Skilled" as const

export const ONLINE_APPLICANT_TYPES = new Set<string>([
  ONLINE_APPLICANT_TYPE,
  ONLINE_APPLICANT_TYPE_DH,
  ONLINE_APPLICANT_TYPE_SKILLED,
])

export function getOnlineApplicantType(positionApplied: string | null | undefined): string {
  if ((positionApplied ?? "").trim() === "Domestic Helper") {
    return ONLINE_APPLICANT_TYPE_DH
  }
  return ONLINE_APPLICANT_TYPE_SKILLED
}

export function resolveApplicantType(
  applicantType: string | null | undefined,
  positionApplied?: string | null
): string | null {
  const type = applicantType?.trim() || null
  if (type === ONLINE_APPLICANT_TYPE) {
    return getOnlineApplicantType(positionApplied)
  }
  return type
}

export const APPLICANT_TYPE_FILTER_OPTIONS = APPLICANT_TYPE_OPTIONS.filter(
  (option) => option !== ONLINE_APPLICANT_TYPE
)



export const JOB_ORDER_STATUS_OPTIONS = ["Open", "Filled", "Closed"] as const



export const POSITION_OPTIONS = [

  "Domestic Helper",

  "Cleaner",

  "Waiter",

  "Barista",

  "Caregiver",

  "Bus Attendant",

  "Baker",

  "Family",

  "Driver",

  "Florist",

  "Hair Dresser",

  "Car Mechanic",

  "Car Painter",

  "Car Denter",

  "Receptionist",

  "Guest Relation Operator",

  "Telephone Operator",

] as const



export const POSITION_OTHER_VALUE = "Other" as const



export function isPredefinedPosition(value: string | null | undefined): boolean {

  if (!value) return false

  return (POSITION_OPTIONS as readonly string[]).includes(value)

}



export const BRANCH_OPTIONS = [

  "Manila Main Branch",

  "Davao Branch",

  "Iloilo Branch",

] as const



export const GENDER_OPTIONS = ["Male", "Female"] as const



export const CIVIL_STATUS_OPTIONS = [

  "Single",

  "Married",

  "Widowed",

  "Divorced",

  "Legally Separated",

  "Annulled",

] as const



export const SPEAKING_LEVEL_OPTIONS = ["Poor", "Fair", "Fluent"] as const

export const APPLICANT_SKILL_OPTIONS = [
  "Cooking",
  "Child Care",
  "Elderly Care",
  "Baby Sitting",
  "Housekeeping",
  "Cleaning",
  "Laundry",
  "Ironing",
  "Food Preparation",
  "Driving",
  "Pet Care",
  "First Aid",
  "Basic Nursing",
  "Sewing",
  "Gardening",
  "Waitering",
  "Barista",
  "Baking",
  "Hair Dressing",
  "Massage Therapy",
  "Welding",
  "Plumbing",
  "Carpentry",
  "Electrical Work",
  "Auto Mechanic",
  "Painting",
  "Masonry",
] as const



export const EMPLOYMENT_STATUS_OPTIONS = ["Active", "On Leave", "Resigned", "Terminated"] as const



export const EMPLOYMENT_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract"] as const



export const JOB_ORDER_GENDER_OPTIONS = ["Any", "Male", "Female"] as const



export const DEFAULT_BRANCH = BRANCH_OPTIONS[0]

export const DEFAULT_POSITION = POSITION_OPTIONS[0]

export const DEFAULT_CIVIL_STATUS = CIVIL_STATUS_OPTIONS[0]

export const DEFAULT_GENDER = GENDER_OPTIONS[0]

export const DEFAULT_SPEAKING_LEVEL = SPEAKING_LEVEL_OPTIONS[0]

export const DEFAULT_APPLICANT_TYPE = APPLICANT_TYPE_OPTIONS[0]

export const DEFAULT_STATUS = STATUS_OPTIONS[0]

export const DEFAULT_JOB_ORDER_STATUS = JOB_ORDER_STATUS_OPTIONS[0]

export const DEFAULT_JOB_ORDER_GENDER = JOB_ORDER_GENDER_OPTIONS[0]

export const DEFAULT_EMPLOYMENT_TYPE = EMPLOYMENT_TYPE_OPTIONS[0]

export const DEFAULT_EMPLOYMENT_STATUS = EMPLOYMENT_STATUS_OPTIONS[0]


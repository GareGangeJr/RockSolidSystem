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



export const APPLICANT_TYPE_OPTIONS = ["Domestic Helper", "Skilled Worker", "Online Application"] as const

export const ONLINE_APPLICANT_TYPE = "Online Application" as const



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


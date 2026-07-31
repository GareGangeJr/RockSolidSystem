const OTHER_COUNTRIES = [
  "Australia",
  "Bahrain",
  "Brunei",
  "Canada",
  "China",
  "Cyprus",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Macau",
  "Malaysia",
  "New Zealand",
  "Oman",
  "Qatar",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Spain",
  "Taiwan",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
] as const

export const COUNTRY_OPTIONS = ["Philippines", ...[...OTHER_COUNTRIES].sort((a, b) => a.localeCompare(b))] as const

const GRADUATION_START_YEAR = 1950
const currentYear = new Date().getFullYear()

export const GRADUATION_YEAR_OPTIONS = Array.from(
  { length: currentYear - GRADUATION_START_YEAR + 1 },
  (_, index) => String(currentYear - index)
)

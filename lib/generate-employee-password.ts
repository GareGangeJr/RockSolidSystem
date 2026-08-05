type EmployeePasswordInput = {
  date_of_birth?: string | null
  employee_number?: string | null
}

export function generateEmployeePassword(employee: EmployeePasswordInput): string {
  const dob = employee.date_of_birth?.slice(0, 10) ?? ""
  const match = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    return `${month}${day}${year}`
  }

  const fallback = (employee.employee_number ?? "emp001").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  return fallback.length >= 6 ? fallback : `${fallback}123`
}

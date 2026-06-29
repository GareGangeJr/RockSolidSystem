export type JobOrderFormValues = {
  company: string
  country: string | null
  job_title: string
  gender: string
  no_workers: number
  years_exp_required: number
  skills_required: string | null
  salary: string
  status: string
  commercial_registration: string | null
  company_address: string | null
  company_contact: string | null
  job_order_date: string | null
  visa_number: string | null
  visa_date: string | null
  visa_category: string | null
  contract_period: string | null
  work_site: string | null
  working_hours: string | null
  benefits_and_terms: string | null
}

export const JOB_ORDER_BENEFITS_PLACEHOLDER = `Accommodation: Provided by company
Transportation: Provided by company
Food: Provided or allowance
Medical: Free medical benefits
Airfare: Provided after contract completion
Vacation leave: 21 days per year
Probation: Max 3 months
Iqama: Borne by company
End of service: Per host country labor law`

const getStr = (formData: FormData, key: string) => (formData.get(key) as string) ?? ""

const getStrOrNull = (formData: FormData, key: string) => {
  const value = formData.get(key) as string | null
  return value != null && value.trim() !== "" ? value.trim() : null
}

export function jobOrderFromFormData(formData: FormData): JobOrderFormValues {
  return {
    company: getStr(formData, "company"),
    country: getStrOrNull(formData, "country"),
    job_title: getStr(formData, "job_title"),
    gender: getStrOrNull(formData, "gender") ?? "Any",
    no_workers: Math.max(1, Number(formData.get("no_workers")) || 1),
    years_exp_required: Math.max(0, Number(formData.get("years_exp_required")) || 0),
    skills_required: getStrOrNull(formData, "skills_required"),
    salary: getStr(formData, "salary"),
    status: getStr(formData, "status") || "Open",
    commercial_registration: getStrOrNull(formData, "commercial_registration"),
    company_address: getStrOrNull(formData, "company_address"),
    company_contact: getStrOrNull(formData, "company_contact"),
    job_order_date: getStrOrNull(formData, "job_order_date"),
    visa_number: getStrOrNull(formData, "visa_number"),
    visa_date: getStrOrNull(formData, "visa_date"),
    visa_category: getStrOrNull(formData, "visa_category"),
    contract_period: getStrOrNull(formData, "contract_period"),
    work_site: getStrOrNull(formData, "work_site"),
    working_hours: getStrOrNull(formData, "working_hours"),
    benefits_and_terms: getStrOrNull(formData, "benefits_and_terms"),
  }
}

export function formatDateForInput(value: unknown) {
  if (value == null || value === "") return ""
  const text = String(value)
  return text.length >= 10 ? text.slice(0, 10) : text
}

export function formatDisplayDate(value: unknown) {
  if (value == null || value === "") return null
  const text = String(value)
  const datePart = text.length >= 10 ? text.slice(0, 10) : text
  const parsed = new Date(`${datePart}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return text
  return parsed.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

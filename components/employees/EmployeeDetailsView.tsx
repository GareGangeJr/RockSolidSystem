import type { ReactNode } from "react"
import { formGridClass, sectionTitleClassSm } from "@/lib/form-ui"

const labelStyles = "block text-xs font-medium text-gray-500"
const valueStyles = "mt-0.5 text-sm text-gray-900"
const gridLayoutStyles = formGridClass

type Props = {
  employee: Record<string, unknown>
}

function formatValue(value: unknown) {
  return value != null && value !== "" ? String(value) : "--"
}

function formatDate(value: unknown) {
  return value != null && String(value).length >= 10 ? String(value).slice(0, 10) : "--"
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <span className={labelStyles}>{label}</span>
      <p className={valueStyles}>{formatValue(value)}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className={sectionTitleClassSm}>{title}</h2>
      {children}
    </div>
  )
}

export function EmployeeDetailsView({ employee }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Employment Information">
        <div className={gridLayoutStyles}>
          <Field label="Employee Number" value={employee.employee_number} />
          <Field label="Position" value={employee.position} />
          <Field label="Department" value={employee.department} />
          <Field label="Date Hired" value={formatDate(employee.date_hired)} />
          <Field label="Employment Status" value={employee.employment_status} />
          <Field label="Employment Type" value={employee.employment_type} />
        </div>
      </Section>

      <Section title="Personal Information">
        <div className={gridLayoutStyles}>
          <Field label="Last Name" value={employee.last_name} />
          <Field label="First Name" value={employee.first_name} />
          <Field label="Middle Name" value={employee.middle_name} />
          <Field label="Date of Birth" value={formatDate(employee.date_of_birth)} />
          <Field label="Gender" value={employee.gender} />
          <Field label="Civil Status" value={employee.civil_status} />
          <Field label="Contact Number" value={employee.contact_number} />
          <Field label="Email" value={employee.email} />
          <div className="col-span-full">
            <span className={labelStyles}>Current Address</span>
            <p className={valueStyles}>{formatValue(employee.current_address)}</p>
          </div>
        </div>
      </Section>

      <Section title="Government IDs">
        <div className={gridLayoutStyles}>
          <Field label="SSS Number" value={employee.sss_number} />
          <Field label="PhilHealth Number" value={employee.philhealth_number} />
          <Field label="Pag-IBIG Number" value={employee.pagibig_number} />
          <Field label="TIN Number" value={employee.tin_number} />
        </div>
      </Section>

      <Section title="Compensation">
        <div className={gridLayoutStyles}>
          <Field label="Basic Salary" value={employee.basic_salary} />
          <Field label="Allowances" value={employee.allowances} />
        </div>
      </Section>

      <Section title="Emergency Contact">
        <div className={gridLayoutStyles}>
          <Field label="Name" value={employee.emergency_contact_name} />
          <Field label="Relationship" value={employee.emergency_contact_relationship} />
          <Field label="Contact Number" value={employee.emergency_contact_number} />
        </div>
      </Section>

      <Section title="Contract Details">
        <div className={gridLayoutStyles}>
          <Field label="Contract Start Date" value={formatDate(employee.contract_start_date)} />
          <Field label="Contract End Date" value={formatDate(employee.contract_end_date)} />
          <div className="col-span-full">
            <span className={labelStyles}>Notes/Remarks</span>
            <p className={valueStyles}>{formatValue(employee.notes)}</p>
          </div>
        </div>
      </Section>
    </div>
  )
}

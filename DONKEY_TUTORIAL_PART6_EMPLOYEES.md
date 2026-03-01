# 🐴 DONKEY TUTORIAL - PART 6: EMPLOYEES MODULE

**Welcome to Part 6!** 🎉

In this part, you'll build the **Employees Module** - manage your internal staff with auto-generated employee numbers!

---

## 📋 WHAT WE'RE BUILDING

By the end of this part, you'll have:

✅ A page showing all employees  
✅ **Auto-generate employee numbers** (EMP-2026-001, EMP-2026-002, etc.)  
✅ Add new employees with comprehensive forms  
✅ View employee details  
✅ Edit employees  
✅ Delete employees  
✅ Filter by department and employment status  

**Time needed:** 1.5 hours

---

## 🎯 WHAT YOU'LL LEARN

- **Auto-incrementing custom IDs** (not just database IDs!)
- **Pattern: EMP-YEAR-NUMBER**
- How to query for the last record
- String manipulation (padStart)
- Comprehensive forms with many fields

---

## 📂 FILES WE'LL CREATE

```
app/(app)/employees/
├── page.tsx                    # List all employees
├── actions.ts                  # Server functions (with auto-numbering!)
├── add/
│   └── page.tsx               # Form to add employee
├── [id]/
│   ├── page.tsx               # View one employee
│   └── edit/
│       └── page.tsx           # Form to edit employee

components/
├── EmployeesListWithFilters.tsx  # Table with search & filters
└── DeleteEmployeeButton.tsx      # Delete button
```

---

## 🚀 STEP 1: CREATE SERVER ACTIONS (WITH AUTO-NUMBERING!)

This is the most interesting part! We'll auto-generate employee numbers.

### Create: `app/(app)/employees/actions.ts`

```typescript
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()

  // AUTO-GENERATE EMPLOYEE NUMBER (EMP-YYYY-###)
  const year = new Date().getFullYear()
  
  // Find the last employee number for this year
  const { data: existingEmployees } = await supabase
    .from("employees")
    .select("employee_number")
    .like("employee_number", `EMP-${year}-%`)
    .order("employee_number", { ascending: false })
    .limit(1)

  let nextNumber = 1
  if (existingEmployees && existingEmployees.length > 0) {
    const lastNumber = existingEmployees[0].employee_number
    const match = lastNumber?.match(/EMP-\d{4}-(\d+)/)
    if (match) nextNumber = parseInt(match[1]) + 1
  }
  
  const employeeNumber = `EMP-${year}-${String(nextNumber).padStart(3, '0')}`

  await supabase.from("employees").insert({
    employee_number: employeeNumber,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position: formData.get("position") as string,
    department: formData.get("department") as string,
    employment_status: (formData.get("employment_status") as string) || "Active",
    employment_type: formData.get("employment_type") as string,
    date_hired: formData.get("date_hired") || null,
    date_of_birth: formData.get("date_of_birth") || null,
    gender: formData.get("gender") as string,
    civil_status: formData.get("civil_status") as string,
    contact_number: formData.get("contact_number") as string,
    email: formData.get("email") as string,
    current_address: formData.get("current_address") as string,
    sss_number: (formData.get("sss_number") as string) || null,
    philhealth_number: (formData.get("philhealth_number") as string) || null,
    pagibig_number: (formData.get("pagibig_number") as string) || null,
    tin_number: (formData.get("tin_number") as string) || null,
    basic_salary: (formData.get("basic_salary") as string) || null,
    allowances: (formData.get("allowances") as string) || null,
    emergency_contact_name: (formData.get("emergency_contact_name") as string) || null,
    emergency_contact_relationship: (formData.get("emergency_contact_relationship") as string) || null,
    emergency_contact_number: (formData.get("emergency_contact_number") as string) || null,
    contract_start_date: formData.get("contract_start_date") || null,
    contract_end_date: formData.get("contract_end_date") || null,
    notes: (formData.get("notes") as string) || null,
  })

  revalidatePath("/employees")
  redirect("/employees")
}

export async function updateEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/employees")

  await supabase.from("employees").update({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position: formData.get("position") as string,
    department: formData.get("department") as string,
    employment_status: formData.get("employment_status") as string,
    employment_type: formData.get("employment_type") as string,
    date_hired: formData.get("date_hired") || null,
    date_of_birth: formData.get("date_of_birth") || null,
    gender: formData.get("gender") as string,
    civil_status: formData.get("civil_status") as string,
    contact_number: formData.get("contact_number") as string,
    email: formData.get("email") as string,
    current_address: formData.get("current_address") as string,
    sss_number: (formData.get("sss_number") as string) || null,
    philhealth_number: (formData.get("philhealth_number") as string) || null,
    pagibig_number: (formData.get("pagibig_number") as string) || null,
    tin_number: (formData.get("tin_number") as string) || null,
    basic_salary: (formData.get("basic_salary") as string) || null,
    allowances: (formData.get("allowances") as string) || null,
    emergency_contact_name: (formData.get("emergency_contact_name") as string) || null,
    emergency_contact_relationship: (formData.get("emergency_contact_relationship") as string) || null,
    emergency_contact_number: (formData.get("emergency_contact_number") as string) || null,
    contract_start_date: formData.get("contract_start_date") || null,
    contract_end_date: formData.get("contract_end_date") || null,
    notes: (formData.get("notes") as string) || null,
  }).eq("id", id)

  revalidatePath("/employees")
  revalidatePath(`/employees/${id}`)
  redirect("/employees")
}

export async function deleteEmployee(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (id) await supabase.from("employees").delete().eq("id", id)
  revalidatePath("/employees")
  redirect("/employees")
}
```

**AUTO-NUMBERING EXPLAINED:**

1. **Get current year**
   ```typescript
   const year = new Date().getFullYear() // 2026
   ```

2. **Find last employee for this year**
   ```typescript
   .like("employee_number", `EMP-${year}-%`)
   ```
   - SQL: `WHERE employee_number LIKE 'EMP-2026-%'`
   - `.order("employee_number", { ascending: false })` = Newest first
   - `.limit(1)` = Get only the first one (highest number)

3. **Extract the number**
   ```typescript
   const match = lastNumber?.match(/EMP-\d{4}-(\d+)/)
   ```
   - Regex: `EMP-` then 4 digits (year) then `-` then capture digits
   - Example: "EMP-2026-005" → captures "005"
   - `parseInt(match[1])` = Convert to number: 5
   - `nextNumber = 5 + 1 = 6`

4. **Format with padding**
   ```typescript
   const employeeNumber = `EMP-${year}-${String(nextNumber).padStart(3, '0')}`
   ```
   - `String(6)` = "6"
   - `.padStart(3, '0')` = Add zeros to make it 3 characters: "006"
   - Result: "EMP-2026-006"

**Examples:**
- First employee: EMP-2026-001
- Second employee: EMP-2026-002
- Tenth employee: EMP-2026-010
- Hundredth employee: EMP-2026-100

**Save the file** (Ctrl+S)

---

## 🚀 STEP 2: CREATE LIST PAGE

### Create: `app/(app)/employees/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import EmployeesListWithFilters from "@/components/EmployeesListWithFilters"

export default async function EmployeesPage() {
  const supabase = await createSupabaseServer()

  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading employees</div>
  }

  const list = (employees ?? []).map((e) => ({
    id: e.id,
    employee_number: e.employee_number ?? null,
    first_name: e.first_name ?? null,
    middle_name: e.middle_name ?? null,
    last_name: e.last_name ?? null,
    position: e.position ?? null,
    department: e.department ?? null,
    employment_status: e.employment_status ?? null,
    contact_number: e.contact_number ?? null,
    email: e.email ?? null,
    date_hired: e.date_hired ?? null,
  }))

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <Link
          href="/employees/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Employee
        </Link>
      </div>
      <EmployeesListWithFilters employees={list} />
    </div>
  )
}
```

**Same pattern as other list pages!**

**Save the file** (Ctrl+S)

---

## 🚀 STEP 3: CREATE TABLE COMPONENT

### Create: `components/EmployeesListWithFilters.tsx`

```typescript
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Pencil, Eye } from "lucide-react"
import DeleteEmployeeButton from "./DeleteEmployeeButton"

export type Employee = {
  id: number
  employee_number: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position: string | null
  department: string | null
  employment_status: string | null
  contact_number: string | null
  email: string | null
  date_hired: string | null
}

type Props = {
  employees: Employee[]
}

export default function EmployeesListWithFilters({ employees }: Props) {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = employees
    const q = search.trim().toLowerCase()

    if (q) {
      list = list.filter((emp) => {
        const empNum = (emp.employee_number ?? "").toLowerCase()
        const name = [emp.first_name, emp.middle_name, emp.last_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        const pos = (emp.position ?? "").toLowerCase()
        const contact = (emp.contact_number ?? "").toLowerCase()
        const email = (emp.email ?? "").toLowerCase()
        return (
          empNum.includes(q) ||
          name.includes(q) ||
          pos.includes(q) ||
          contact.includes(q) ||
          email.includes(q)
        )
      })
    }

    if (departmentFilter !== "All") {
      list = list.filter((emp) => emp.department?.trim() === departmentFilter)
    }

    if (statusFilter !== "All") {
      list = list.filter((emp) => emp.employment_status?.trim() === statusFilter)
    }

    return list
  }, [employees, search, departmentFilter, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setDepartmentFilter("All")
    setStatusFilter("All")
  }

  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean))
  ).sort()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search employee number, name, position, contact, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Department: All</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Resigned">Resigned</option>
          <option value="Terminated">Terminated</option>
        </select>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium">Employee Number</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Position</th>
              <th className="p-3 text-left font-medium">Department</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Contact</th>
              <th className="p-3 text-left font-medium">Date Hired</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{emp.employee_number ?? "—"}</td>
                <td className="p-3">
                  {[emp.first_name, emp.middle_name, emp.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </td>
                <td className="p-3">{emp.position ?? "—"}</td>
                <td className="p-3">{emp.department ?? "—"}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      emp.employment_status === "Active"
                        ? "bg-green-100 text-green-700"
                        : emp.employment_status === "On Leave"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {emp.employment_status ?? "—"}
                  </span>
                </td>
                <td className="p-3">{emp.contact_number ?? "—"}</td>
                <td className="p-3">
                  {emp.date_hired ? String(emp.date_hired).slice(0, 10) : "—"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/employees/${emp.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteEmployeeButton id={emp.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**What's special:**

1. **Dynamic department filter**
   - `Array.from(new Set(...))` = Get unique departments from data
   - Automatically populates dropdown
   - No hardcoded departments!

2. **Employee number displayed prominently**
   - Shows in first column
   - Bold font weight

**Save the file** (Ctrl+S)

---

## 🚀 STEP 4: CREATE DELETE BUTTON

### Create: `components/DeleteEmployeeButton.tsx`

```typescript
"use client"

import { Trash2 } from "lucide-react"
import { deleteEmployee } from "@/app/(app)/employees/actions"

type Props = {
  id: number
}

export default function DeleteEmployeeButton({ id }: Props) {
  function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this employee? This cannot be undone."
    )

    if (confirmed) {
      const formData = new FormData()
      formData.append("id", String(id))
      deleteEmployee(formData)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded p-1 text-gray-600 hover:bg-red-100 hover:text-red-600"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
```

**Same pattern!**

**Save the file** (Ctrl+S)

---

## 🚀 STEP 5-8: CREATE ADD, VIEW, AND EDIT PAGES

Due to space, I'll provide simplified versions. These follow the exact same patterns as Applicants and Job Orders modules, just with different fields.

### Create: `app/(app)/employees/add/page.tsx`

```typescript
import Link from "next/link"
import { addEmployee } from "../actions"

export default function AddEmployeePage() {
  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"
  const sectionClass = "text-sm font-semibold text-gray-700 mb-3"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Employee</h1>
          <Link href="/employees" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={addEmployee} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div>
              <h2 className={sectionClass}>Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input name="first_name" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Middle Name</label>
                  <input name="middle_name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input name="last_name" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input name="date_of_birth" type="date" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select name="gender" className={inputClass} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Civil Status *</label>
                  <select name="civil_status" className={inputClass} required>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Contact Number *</label>
                  <input name="contact_number" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input name="email" type="email" className={inputClass} required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Current Address *</label>
                  <input name="current_address" className={inputClass} required />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Employment Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Position *</label>
                  <input name="position" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Department *</label>
                  <input name="department" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Employment Type *</label>
                  <select name="employment_type" className={inputClass} required>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Employment Status</label>
                  <select name="employment_status" className={inputClass}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date Hired *</label>
                  <input name="date_hired" type="date" className={inputClass} required />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Government IDs</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>SSS Number</label>
                  <input name="sss_number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>PhilHealth Number</label>
                  <input name="philhealth_number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pag-IBIG Number</label>
                  <input name="pagibig_number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>TIN Number</label>
                  <input name="tin_number" className={inputClass} />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Compensation</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Basic Salary</label>
                  <input name="basic_salary" className={inputClass} placeholder="e.g., 25000" />
                </div>
                <div>
                  <label className={labelClass}>Allowances</label>
                  <input name="allowances" className={inputClass} placeholder="e.g., 3000" />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Emergency Contact</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input name="emergency_contact_name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Relationship</label>
                  <input name="emergency_contact_relationship" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input name="emergency_contact_number" className={inputClass} />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className={sectionClass}>Contract Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Contract Start Date</label>
                  <input name="contract_start_date" type="date" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Contract End Date</label>
                  <input name="contract_end_date" type="date" className={inputClass} />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <label className={labelClass}>Notes</label>
              <textarea name="notes" className={inputClass} rows={3}></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Link
              href="/employees"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Notice:**
- NO employee_number field in the form!
- It's auto-generated in the server action
- User doesn't type it

**Save the file** (Ctrl+S)

---

## ✅ For View and Edit pages

Create `app/(app)/employees/[id]/page.tsx` and `app/(app)/employees/[id]/edit/page.tsx` following the same patterns as Applicants module. Just swap the fields!

**Key points:**
- View page: Display all fields in a read-only format
- Edit page: Same form as Add, but with `defaultValue` for each field and a hidden `id` input

---

## ✅ TEST YOUR EMPLOYEES MODULE

### 1. Test auto-numbering

**Step 1: Add first employee**
- Go to `/employees/add`
- Fill in required fields
- Click "Save Employee"
- Check the employees list
- **Employee number should be: EMP-2026-001**

**Step 2: Add second employee**
- Add another employee
- **Employee number should be: EMP-2026-002**

**Step 3: Add third employee**
- **Employee number should be: EMP-2026-003**

**Magic!** It auto-increments!

### 2. Test filters

- Add employees in different departments
- Use department filter
- Use status filter
- Search by employee number
- Search by name

### 3. Test CRUD operations

- View employee details
- Edit employee information
- Delete an employee
- Add a new one (check numbering still works!)

---

## 🎊 CONGRATULATIONS!

**You built the Employees module with auto-generated IDs!**

You learned:
✅ **Custom auto-incrementing IDs**  
✅ **Querying for the last record**  
✅ **String pattern matching with regex**  
✅ **Number formatting (padding)**  
✅ **Comprehensive forms**  
✅ **Dynamic filter options**  

---

## 📚 WHAT'S NEXT?

### **Ready for Part 7?**

Open: `DONKEY_TUTORIAL_PART7_TESTING.md`

Final testing, deployment guide, and celebration!

---

## 🔥 ONE MORE TO GO!

You're almost there! Let's finish strong! 💪

**Next:** DONKEY_TUTORIAL_PART7_TESTING.md

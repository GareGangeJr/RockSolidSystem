# 🐴 DONKEY TUTORIAL - PART 3: APPLICANTS MODULE

**Welcome to Part 3!** 🎉

In this part, you'll build the complete **Applicants Module** - the heart of your recruitment system!

---

## 📋 WHAT WE'RE BUILDING

By the end of this part, you'll have:

✅ A page that shows all applicants in a table  
✅ Search and filter functionality  
✅ Add new applicant with a detailed form  
✅ View applicant details  
✅ Edit applicant information  
✅ Delete applicants  
✅ Change applicant status with a dropdown  

**Time needed:** 2 hours

---

## 🎯 WHAT YOU'LL LEARN

- **Server Components** - Fetch data on the server
- **Client Components** - Interactive features
- **Server Actions** - Save, update, delete data
- **useState** - Store search text and filters
- **useMemo** - Optimize filtering performance
- **Forms** - Collect user input
- **Validation** - Ensure required fields are filled

---

## 📂 FILES WE'LL CREATE

```
app/(app)/applicants/
├── page.tsx                    # List all applicants (Server Component)
├── actions.ts                  # Server functions (add, update, delete)
├── add/
│   └── page.tsx               # Form to add new applicant
├── [id]/
│   ├── page.tsx               # View one applicant's details
│   └── edit/
│       └── page.tsx           # Form to edit applicant

components/
├── ApplicantsListWithFilters.tsx  # Table with search & filters (Client Component)
├── DeleteApplicantButton.tsx      # Delete button with confirmation
└── StatusDropdown.tsx             # Dropdown to change status

lib/
└── status-options.ts              # Status and type options (shared data)
```

---

## 🚀 STEP 1: CREATE STATUS OPTIONS FILE

First, let's create a file to store our dropdown options. This way, we can reuse them everywhere!

### Create: `lib/status-options.ts`

```typescript
export const STATUS_OPTIONS = [
  "New Applicant",
  "For Processing",
  "For Deployment",
  "Deployed",
  "Deployed(With Concerns)",
  "Cancelled",
  "Blacklisted"
]

export const APPLICANT_TYPE_OPTIONS = [
  "Domestic Helper",
  "Factory Worker",
  "Construction",
  "Hospitality",
  "Healthcare",
  "IT Professional",
  "Other"
]
```

**What this does:**
- `STATUS_OPTIONS` = All possible applicant statuses
- `APPLICANT_TYPE_OPTIONS` = All possible applicant types
- `export` = Makes these available to other files
- We can now use these in multiple places without retyping!

**Save the file** (Ctrl+S)

---

## 🚀 STEP 2: CREATE SERVER ACTIONS

Server actions are special functions that run on the server. They can save data to the database.

### Create: `app/(app)/applicants/actions.ts`

```typescript
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const optStr = (formData: FormData, key: string) => (formData.get(key) as string) || ""

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  
  await supabase.from("applicants").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: formData.get("position_applied") as string,
    status: (formData.get("status") as string) || "New Applicant",
    applicant_type: (formData.get("applicant_type") as string) || "Domestic Helper",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,
    date_applied: formData.get("date_applied") || null
  })

  revalidatePath("/applicants")
  redirect("/applicants")
}

export async function updateApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  await supabase.from("applicants").update({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    middle_name: (formData.get("middle_name") as string) || null,
    position_applied: formData.get("position_applied") as string,
    status: formData.get("status") as string,
    applicant_type: (formData.get("applicant_type") as string) || "Domestic Helper",
    contact_number: (formData.get("contact_number") as string) || null,
    email: (formData.get("email") as string) || null,
    years_of_exp: Number(formData.get("years_of_exp")) || 0,
    skills: (formData.get("skills") as string) || null,
    notes: (formData.get("notes") as string) || null,
    date_applied: formData.get("date_applied") || null
  }).eq("id", id)

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect("/applicants")
}

export async function deleteApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/applicants")

  await supabase.from("applicants").delete().eq("id", id)

  revalidatePath("/applicants")
  redirect("/applicants")
}

export async function updateApplicantStatus(applicantId: number, newStatus: string) {
  const supabase = await createSupabaseServer()
  
  const { error } = await supabase
    .from("applicants")
    .update({ status: newStatus })
    .eq("id", applicantId)
  
  if (error) {
    console.error("Error updating applicant status:", error)
    return { error }
  }
  
  revalidatePath("/applicants")
  return { error: null }
}
```

**What each function does:**

1. **`"use server"`** at the top
   - Tells Next.js this file contains server-only code
   - These functions run on the server, not in the browser

2. **`optStr` helper function**
   - Gets a form field value
   - Returns empty string if not found
   - Saves us from typing `|| ""` everywhere

3. **`addApplicant(formData)`**
   - Receives form data from the "Add Applicant" form
   - `formData.get("first_name")` = Gets the value from the input named "first_name"
   - `as string` = TypeScript: "treat this as a string"
   - `|| null` = If empty, store NULL in database
   - `Number(formData.get("years_of_exp"))` = Convert text to number
   - `supabase.from("applicants").insert()` = Add new row to applicants table
   - `revalidatePath("/applicants")` = Refresh the applicants page
   - `redirect("/applicants")` = Send user back to list page

4. **`updateApplicant(formData)`**
   - Similar to add, but updates existing applicant
   - `formData.get("id")` = Get the ID of applicant to update
   - `.update()` = Modify existing row
   - `.eq("id", id)` = WHERE id = id (SQL)

5. **`deleteApplicant(formData)`**
   - Gets applicant ID from form
   - `.delete()` = Remove row from table
   - `.eq("id", id)` = WHERE id = id

6. **`updateApplicantStatus(applicantId, newStatus)`**
   - Updates just the status field
   - Called when user changes status dropdown
   - Returns `{ error: null }` if successful

**Save the file** (Ctrl+S)

---

## 🚀 STEP 3: CREATE LIST PAGE (SERVER COMPONENT)

This page fetches all applicants from the database and displays them.

### Create: `app/(app)/applicants/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import ApplicantsListWithFilters from "@/components/ApplicantsListWithFilters"

export default async function ApplicantsPage() {
  const supabase = await createSupabaseServer()

  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading applicants</div>
  }

  const list = (applicants ?? []).map((a) => ({
    id: a.id,
    created_at: a.created_at,
    first_name: a.first_name ?? null,
    middle_name: a.middle_name ?? null,
    last_name: a.last_name ?? null,
    position_applied: a.position_applied ?? null,
    applicant_type: a.applicant_type ?? null,
    status: a.status ?? null,
    contact_number: a.contact_number ?? null,
    email: a.email ?? null,
    date_applied: a.date_applied ?? null,
  }))

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applicants</h1>
        <Link
          href="/applicants/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Applicant
        </Link>
      </div>
      <ApplicantsListWithFilters applicants={list} />
    </div>
  )
}
```

**Line-by-line explanation:**

- **Line 1:** `import Link from "next/link"` 
  - Import Link component for navigation

- **Line 2:** `import { createSupabaseServer }`
  - Import our Supabase server client

- **Line 3:** `import ApplicantsListWithFilters`
  - Import the table component (we'll create it next)

- **Line 5:** `export default async function ApplicantsPage()`
  - Define the page component
  - `async` = Can use `await` inside
  - This is a Server Component (runs on server)

- **Line 6:** `const supabase = await createSupabaseServer()`
  - Create Supabase client
  - `await` = Wait for it to be ready

- **Lines 8-11:** Fetch data
  - `.from("applicants")` = From applicants table
  - `.select("*")` = Get all columns
  - `.order("created_at", { ascending: false })` = Newest first

- **Lines 13-15:** Error handling
  - If error, show error message
  - Return early (don't continue)

- **Lines 17-29:** Transform data
  - `(applicants ?? [])` = If null, use empty array
  - `.map()` = Transform each applicant
  - `a.first_name ?? null` = If undefined, use null
  - This ensures consistent types for TypeScript

- **Lines 31-44:** Return JSX
  - `<div className="p-6">` = Padding on all sides
  - `flex items-center justify-between` = Flexbox layout
  - Title on left, button on right
  - `<Link href="/applicants/add">` = Navigate to add page
  - `<ApplicantsListWithFilters applicants={list} />` = Pass data to table component

**Save the file** (Ctrl+S)

---

## 🚀 STEP 4: CREATE TABLE COMPONENT (CLIENT COMPONENT)

This component displays applicants in a table with search and filters.

### Create: `components/ApplicantsListWithFilters.tsx`

```typescript
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Pencil, Eye, FolderOpen } from "lucide-react"
import DeleteApplicantButton from "./DeleteApplicantButton"
import StatusDropdown from "./StatusDropdown"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS } from "@/lib/status-options"

export type Applicant = {
  id: number
  created_at: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  position_applied: string | null
  applicant_type: string | null
  status: string | null
  contact_number: string | null
  email: string | null
  date_applied: string | null
}

type Props = {
  applicants: Applicant[]
}

function formatDate(dateApplied: string | null, createdAt: string | null): string {
  const val = dateApplied ?? createdAt
  if (!val) return "—"
  const s = String(val)
  if (s.length >= 10) return s.slice(0, 10)
  return s
}

export default function ApplicantsListWithFilters({ applicants }: Props) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = applicants
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((app) => {
        const idStr = `app-${new Date().getFullYear()}-${app.id}`.toLowerCase()
        const name = [app.first_name, app.middle_name, app.last_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        const pos = (app.position_applied ?? "").toLowerCase()
        const contact = (app.contact_number ?? "").toLowerCase()
        const email = (app.email ?? "").toLowerCase()
        return (
          idStr.includes(q) ||
          name.includes(q) ||
          pos.includes(q) ||
          contact.includes(q) ||
          email.includes(q)
        )
      })
    }
    if (typeFilter !== "All") {
      list = list.filter((app) => app.applicant_type?.trim() === typeFilter)
    }
    if (statusFilter !== "All") {
      list = list.filter((app) => app.status?.trim() === statusFilter)
    }
    return list
  }, [applicants, search, typeFilter, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setTypeFilter("All")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search name, applicant ID, position, contact, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Type: All</option>
          {APPLICANT_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
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
              <th className="p-3 text-left font-medium">Applicant ID</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Position</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Contact</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Date Applied</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-t border-gray-100">
                <td className="p-3">{`APP-${new Date().getFullYear()}-${app.id}`}</td>
                <td className="p-3">
                  {[app.first_name, app.middle_name, app.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </td>
                <td className="p-3">{app.position_applied ?? "—"}</td>
                <td className="p-3">{app.applicant_type ?? "—"}</td>
                <td className="p-3">
                  <StatusDropdown applicantId={app.id} currentStatus={app.status} />
                </td>
                <td className="p-3">{app.contact_number ?? "—"}</td>
                <td className="p-3">{app.email ?? "—"}</td>
                <td className="p-3">{formatDate(app.date_applied, app.created_at)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/applicants/${app.id}/files`}
                      className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                      title="Files"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/applicants/${app.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/applicants/${app.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteApplicantButton id={app.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">
                  No applicants found.
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

**Key concepts explained:**

1. **`"use client"`** at the top
   - This is a Client Component (runs in browser)
   - Needed because we use `useState` and interactive features

2. **`useState` for search and filters**
   - `const [search, setSearch] = useState("")` = Store search text
   - `search` = Current value
   - `setSearch` = Function to change value
   - `""` = Initial value (empty string)

3. **`useMemo` for filtering**
   - `const filtered = useMemo(() => { ... }, [applicants, search, typeFilter, statusFilter])`
   - Only recalculates when dependencies change
   - Improves performance (doesn't re-filter on every render)
   - `useMemo` = "memoize" = remember the result

4. **Filtering logic**
   - Start with all applicants
   - If search text exists, filter by name/ID/position/contact/email
   - If type filter is set, filter by type
   - If status filter is set, filter by status
   - Return the filtered list

5. **Search input**
   - `value={search}` = Controlled input (React manages value)
   - `onChange={(e) => setSearch(e.target.value)}` = Update state on type
   - `e.target.value` = The new text in the input

6. **Select dropdowns**
   - `value={typeFilter}` = Current selected option
   - `onChange={(e) => setTypeFilter(e.target.value)}` = Update on change
   - `.map()` = Loop through options and create `<option>` elements

7. **Table structure**
   - `<thead>` = Table header (column names)
   - `<tbody>` = Table body (data rows)
   - `<tr>` = Table row
   - `<th>` = Table header cell
   - `<td>` = Table data cell
   - `filtered.map()` = Create one row per applicant

8. **Action buttons**
   - Files icon = View applicant files
   - Eye icon = View applicant details
   - Pencil icon = Edit applicant
   - Trash icon = Delete applicant (in DeleteApplicantButton component)

**Save the file** (Ctrl+S)

---

## 🚀 STEP 5: CREATE STATUS DROPDOWN COMPONENT

This dropdown lets users change an applicant's status quickly.

### Create: `components/StatusDropdown.tsx`

```typescript
"use client"

import { useState } from "react"
import { updateApplicantStatus } from "@/app/(app)/applicants/actions"
import { STATUS_OPTIONS } from "@/lib/status-options"

type Props = {
  applicantId: number
  currentStatus: string | null
}

export default function StatusDropdown({ applicantId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus ?? "New Applicant")
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setStatus(newStatus)
    setLoading(true)

    const result = await updateApplicantStatus(applicantId, newStatus)

    setLoading(false)

    if (result.error) {
      alert(`Error: ${result.error.message}`)
      setStatus(currentStatus ?? "New Applicant")
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
```

**What this does:**

1. **Props**
   - `applicantId` = Which applicant to update
   - `currentStatus` = Current status from database

2. **State**
   - `status` = Current displayed status
   - `loading` = True while saving to database

3. **`handleChange` function**
   - Called when user selects new status
   - `e.target.value` = The newly selected status
   - Update local state immediately (optimistic UI)
   - Set loading to true
   - Call server action to update database
   - Set loading to false
   - If error, show alert and revert to old status

4. **Dropdown**
   - `value={status}` = Current selected value
   - `onChange={handleChange}` = Call function on change
   - `disabled={loading}` = Disable while saving
   - Loop through STATUS_OPTIONS to create options

**Save the file** (Ctrl+S)

---

## 🚀 STEP 6: CREATE DELETE BUTTON COMPONENT

This button deletes an applicant with confirmation.

### Create: `components/DeleteApplicantButton.tsx`

```typescript
"use client"

import { Trash2 } from "lucide-react"
import { deleteApplicant } from "@/app/(app)/applicants/actions"

type Props = {
  id: number
}

export default function DeleteApplicantButton({ id }: Props) {
  function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this applicant? This cannot be undone.")
    
    if (confirmed) {
      const formData = new FormData()
      formData.append("id", String(id))
      deleteApplicant(formData)
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

**What this does:**

1. **`handleDelete` function**
   - `confirm()` = Show browser confirmation dialog
   - Returns `true` if user clicks "OK", `false` if "Cancel"
   - If confirmed, create FormData
   - `formData.append("id", String(id))` = Add id to form
   - Call `deleteApplicant` server action

2. **Button**
   - `type="button"` = Don't submit any form
   - `onClick={handleDelete}` = Call function on click
   - Trash icon from lucide-react
   - Hover effects for visual feedback

**Save the file** (Ctrl+S)

---

## 🚀 STEP 7: CREATE ADD APPLICANT PAGE

This page has a form to add a new applicant.

### Create: `app/(app)/applicants/add/page.tsx`

```typescript
import Link from "next/link"
import { addApplicant } from "../actions"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS } from "@/lib/status-options"

export default function AddApplicantPage() {
  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Applicant</h1>
          <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={addApplicant} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="first_name" className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Last Name *</label>
                <input name="last_name" className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Middle Name</label>
                <input name="middle_name" className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Position Applied *</label>
                <input name="position_applied" className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Applicant Type</label>
                <select name="applicant_type" className={inputClass}>
                  {APPLICANT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Contact Number</label>
                <input name="contact_number" className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Years of Experience</label>
                <input name="years_of_exp" type="number" className={inputClass} defaultValue={0} />
              </div>
              
              <div>
                <label className={labelClass}>Date Applied</label>
                <input name="date_applied" type="date" className={inputClass} />
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Skills</label>
                <textarea name="skills" className={inputClass} rows={3}></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Notes</label>
                <textarea name="notes" className={inputClass} rows={3}></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Link
              href="/applicants"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Applicant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Key points:**

1. **`inputClass` and `labelClass`**
   - Define styles once, reuse everywhere
   - Keeps code DRY (Don't Repeat Yourself)

2. **Form with `action` prop**
   - `<form action={addApplicant}>`
   - When submitted, Next.js calls the server action
   - No need for `onSubmit` handler or `fetch()` calls!

3. **Input fields**
   - `name="first_name"` = This becomes the key in FormData
   - `required` = Browser validation (must fill in)
   - `type="email"` = Browser validation (must be valid email)
   - `type="number"` = Only allows numbers
   - `type="date"` = Shows date picker
   - `defaultValue={0}` = Initial value for years of experience

4. **Select dropdowns**
   - Loop through options arrays
   - Create `<option>` for each

5. **Textarea**
   - For longer text input
   - `rows={3}` = Show 3 rows initially

6. **Buttons**
   - Cancel = Link back to list
   - Save = Submit button (submits form)

**Save the file** (Ctrl+S)

---

## 🚀 STEP 8: CREATE VIEW APPLICANT PAGE

This page shows all details of one applicant.

### Create: `app/(app)/applicants/[id]/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function ViewApplicantPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: applicant, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !applicant) {
    notFound()
  }

  const fieldClass = "text-sm"
  const labelClass = "font-medium text-gray-500"
  const valueClass = "mt-1 text-gray-900"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Applicant: {applicant.first_name} {applicant.last_name}
          </h1>
          <div className="flex gap-2">
            <Link
              href={`/applicants/${id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/applicants"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={fieldClass}>
              <div className={labelClass}>Applicant ID</div>
              <div className={valueClass}>APP-{new Date().getFullYear()}-{applicant.id}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>First Name</div>
              <div className={valueClass}>{applicant.first_name ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Middle Name</div>
              <div className={valueClass}>{applicant.middle_name ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Last Name</div>
              <div className={valueClass}>{applicant.last_name ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Position Applied</div>
              <div className={valueClass}>{applicant.position_applied ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Applicant Type</div>
              <div className={valueClass}>{applicant.applicant_type ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Status</div>
              <div className={valueClass}>{applicant.status ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Contact Number</div>
              <div className={valueClass}>{applicant.contact_number ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Email</div>
              <div className={valueClass}>{applicant.email ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Years of Experience</div>
              <div className={valueClass}>{applicant.years_of_exp ?? 0}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Date Applied</div>
              <div className={valueClass}>
                {applicant.date_applied ? String(applicant.date_applied).slice(0, 10) : "—"}
              </div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Date Created</div>
              <div className={valueClass}>
                {applicant.created_at ? String(applicant.created_at).slice(0, 10) : "—"}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className={labelClass}>Skills</div>
              <div className={valueClass}>{applicant.skills ?? "—"}</div>
            </div>

            <div className="md:col-span-2">
              <div className={labelClass}>Notes</div>
              <div className={valueClass}>{applicant.notes ?? "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**What this does:**

1. **Dynamic route**
   - Folder name `[id]` = Dynamic segment
   - `params.id` = The actual ID from URL
   - `/applicants/5` → `params.id = "5"`

2. **Fetch single applicant**
   - `.eq("id", id)` = WHERE id = id
   - `.single()` = Expect exactly one result
   - If not found, call `notFound()` (shows 404 page)

3. **Display fields**
   - Use consistent styling with classes
   - `applicant.first_name ?? "—"` = Show "—" if null
   - `md:col-span-2` = Takes 2 columns on medium+ screens
   - Grid layout = 2 columns on desktop, 1 on mobile

**Save the file** (Ctrl+S)

---

## 🚀 STEP 9: CREATE EDIT APPLICANT PAGE

This page has a form to edit an existing applicant.

### Create: `app/(app)/applicants/[id]/edit/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateApplicant } from "../../actions"
import { STATUS_OPTIONS, APPLICANT_TYPE_OPTIONS } from "@/lib/status-options"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function EditApplicantPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: applicant, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !applicant) {
    notFound()
  }

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Applicant</h1>
          <Link href="/applicants" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={updateApplicant} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={id} />
          
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>First Name *</label>
                <input 
                  name="first_name" 
                  className={inputClass} 
                  required 
                  defaultValue={applicant.first_name ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Last Name *</label>
                <input 
                  name="last_name" 
                  className={inputClass} 
                  required 
                  defaultValue={applicant.last_name ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Middle Name</label>
                <input 
                  name="middle_name" 
                  className={inputClass} 
                  defaultValue={applicant.middle_name ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Position Applied *</label>
                <input 
                  name="position_applied" 
                  className={inputClass} 
                  required 
                  defaultValue={applicant.position_applied ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Applicant Type</label>
                <select 
                  name="applicant_type" 
                  className={inputClass}
                  defaultValue={applicant.applicant_type ?? "Domestic Helper"}
                >
                  {APPLICANT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Status</label>
                <select 
                  name="status" 
                  className={inputClass}
                  defaultValue={applicant.status ?? "New Applicant"}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Contact Number</label>
                <input 
                  name="contact_number" 
                  className={inputClass}
                  defaultValue={applicant.contact_number ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Email</label>
                <input 
                  name="email" 
                  type="email" 
                  className={inputClass}
                  defaultValue={applicant.email ?? ""}
                />
              </div>
              
              <div>
                <label className={labelClass}>Years of Experience</label>
                <input 
                  name="years_of_exp" 
                  type="number" 
                  className={inputClass}
                  defaultValue={applicant.years_of_exp ?? 0}
                />
              </div>
              
              <div>
                <label className={labelClass}>Date Applied</label>
                <input 
                  name="date_applied" 
                  type="date" 
                  className={inputClass}
                  defaultValue={applicant.date_applied ? String(applicant.date_applied).slice(0, 10) : ""}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Skills</label>
                <textarea 
                  name="skills" 
                  className={inputClass} 
                  rows={3}
                  defaultValue={applicant.skills ?? ""}
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Notes</label>
                <textarea 
                  name="notes" 
                  className={inputClass} 
                  rows={3}
                  defaultValue={applicant.notes ?? ""}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Link
              href="/applicants"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Update Applicant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Key differences from Add page:**

1. **Hidden ID field**
   - `<input type="hidden" name="id" value={id} />`
   - Includes the ID in form submission
   - updateApplicant action needs this to know which row to update

2. **`defaultValue` instead of `value`**
   - `defaultValue={applicant.first_name ?? ""}`
   - Sets initial value from database
   - `value` = controlled (need useState)
   - `defaultValue` = uncontrolled (simpler for forms)

3. **Form action**
   - `action={updateApplicant}` (not `addApplicant`)
   - Calls update server action instead of add

**Save the file** (Ctrl+S)

---

## ✅ TEST YOUR APPLICANTS MODULE

Now let's make sure everything works!

### 1. Start the development server (if not running)

```bash
npm run dev
```

### 2. Open browser

Go to: `http://localhost:3000/applicants`

### 3. Test each feature

**Test 1: View empty list**
- You should see "Applicants" heading
- "Add Applicant" button
- Empty table or "No applicants found" message

**Test 2: Add an applicant**
- Click "Add Applicant" button
- Fill in at least: First Name, Last Name, Position
- Click "Save Applicant"
- Should redirect to list
- Your new applicant should appear!

**Test 3: Search**
- Add a few more applicants
- Type a name in the search box
- Table should filter as you type
- Try searching by position, contact, email

**Test 4: Filters**
- Select a type from "Type: All" dropdown
- Table should filter
- Select a status from "Status: All" dropdown
- Click "Clear" to reset

**Test 5: Change status**
- In the table, click the status dropdown for an applicant
- Select a different status
- Should save immediately
- Refresh the page - status should persist

**Test 6: View applicant**
- Click the eye icon (View) for an applicant
- Should see all their details
- Click "Back to List" to return

**Test 7: Edit applicant**
- In the list, click the pencil icon (Edit)
- Or from view page, click "Edit" button
- Change some fields
- Click "Update Applicant"
- Should redirect to list with updated data

**Test 8: Delete applicant**
- Click the trash icon for an applicant
- Should show confirmation dialog
- Click "OK" to confirm
- Applicant should disappear from list
- Check database - record should be gone

### 4. Check for errors

Open browser console (F12 → Console tab)
- Should have no red errors
- If you see errors, read them carefully and fix

---

## 🎊 CONGRATULATIONS!

**You just built a complete CRUD module!**

You learned:
✅ Server Components (fetch data)  
✅ Client Components (interactivity)  
✅ Server Actions (save data)  
✅ Search and filtering  
✅ useState and useMemo  
✅ Forms with validation  
✅ Dynamic routes  
✅ Database operations  

**This is huge!** 🎉

The rest of your modules (Job Orders, Monitoring, Employees) follow the same pattern!

---

## 📚 WHAT'S NEXT?

### **Ready for Part 4?**

Open: `DONKEY_TUTORIAL_PART4_JOBORDERS.md`

You'll build the Job Orders module using the same patterns you just learned!

### **Need a break?**

That's totally fine! You covered a lot. Take a break, then come back when you're ready.

### **Want to understand more?**

Read these files:
- `BEGINNERS_GUIDE.md` - Concepts explained
- `CODE_WALKTHROUGH.md` - Your existing code explained

---

## 🔥 YOU'RE DOING AMAZING!

Keep going! You've got this! 💪

**Next:** DONKEY_TUTORIAL_PART4_JOBORDERS.md

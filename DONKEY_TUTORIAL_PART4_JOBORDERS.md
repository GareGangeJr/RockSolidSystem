# 🐴 DONKEY TUTORIAL - PART 4: JOB ORDERS MODULE

**Welcome to Part 4!** 🎉

In this part, you'll build the **Job Orders Module** - where companies post job openings and you match them with applicants!

---

## 📋 WHAT WE'RE BUILDING

By the end of this part, you'll have:

✅ A page that shows all job orders  
✅ Search and filter functionality  
✅ Add new job order form  
✅ View job order details  
✅ Edit job orders  
✅ Delete job orders  
✅ **Match applicants to job orders**  
✅ **View matched applicants for each job**  

**Time needed:** 1.5 hours

---

## 🎯 WHAT YOU'LL LEARN

- Same CRUD patterns from Applicants module
- **Relationships between tables** (job_orders ↔ placements ↔ applicants)
- **Joining tables** to show related data
- How to create a matching system

---

## 📂 FILES WE'LL CREATE

```
app/(app)/job-orders/
├── page.tsx                    # List all job orders
├── actions.ts                  # Server functions
├── add/
│   └── page.tsx               # Form to add job order
├── [id]/
│   ├── page.tsx               # View one job order
│   ├── edit/
│   │   └── page.tsx           # Form to edit job order
│   └── match/
│       └── page.tsx           # Match applicants to this job

components/
├── JobOrdersListWithFilters.tsx  # Table with search & filters
└── DeleteJobOrderButton.tsx      # Delete button
```

---

## 🚀 STEP 1: CREATE SERVER ACTIONS

These functions handle adding, updating, deleting job orders, and matching applicants.

### Create: `app/(app)/job-orders/actions.ts`

```typescript
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()

  await supabase.from("job_orders").insert({
    company: formData.get("company") as string,
    country: formData.get("country") as string,
    job_title: formData.get("job_title") as string,
    gender: formData.get("gender") as string,
    no_workers: Number(formData.get("no_workers")) || 1,
    years_exp_required: Number(formData.get("years_exp_required")) || 0,
    skills_required: (formData.get("skills_required") as string) || null,
    salary: formData.get("salary") as string,
    status: (formData.get("status") as string) || "Open",
  })

  revalidatePath("/job-orders")
  redirect("/job-orders")
}

export async function updateJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (!id) redirect("/job-orders")

  await supabase.from("job_orders").update({
    company: formData.get("company") as string,
    country: formData.get("country") as string,
    job_title: formData.get("job_title") as string,
    gender: formData.get("gender") as string,
    no_workers: Number(formData.get("no_workers")) || 1,
    years_exp_required: Number(formData.get("years_exp_required")) || 0,
    skills_required: (formData.get("skills_required") as string) || null,
    salary: formData.get("salary") as string,
    status: (formData.get("status") as string) || "Open",
  }).eq("id", id)

  revalidatePath("/job-orders")
  revalidatePath(`/job-orders/${id}`)
  redirect("/job-orders")
}

export async function deleteJobOrder(formData: FormData) {
  const supabase = await createSupabaseServer()
  const id = Number(formData.get("id"))
  if (id) await supabase.from("job_orders").delete().eq("id", id)
  revalidatePath("/job-orders")
  redirect("/job-orders")
}

export async function matchToJob(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))
  
  if (applicantId && jobOrderId) {
    await supabase.from("placements").insert({
      applicant_id: applicantId,
      job_order_id: jobOrderId
    })
  }
  
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match`)
}

export async function deleteMatch(formData: FormData) {
  const supabase = await createSupabaseServer()
  const applicantId = Number(formData.get("applicant_id"))
  const jobOrderId = Number(formData.get("job_order_id"))
  
  if (applicantId && jobOrderId) {
    await supabase.from("placements")
      .delete()
      .eq("applicant_id", applicantId)
      .eq("job_order_id", jobOrderId)
  }
  
  revalidatePath(`/job-orders/${jobOrderId}/match`)
  redirect(`/job-orders/${jobOrderId}/match`)
}
```

**What's new here:**

1. **Job Order fields**
   - `company` = Company name
   - `country` = Country where job is located
   - `job_title` = Position title
   - `gender` = Gender requirement (if any)
   - `no_workers` = Number of workers needed
   - `years_exp_required` = Experience requirement
   - `skills_required` = Required skills
   - `salary` = Salary offer
   - `status` = "Open", "Closed", "On Hold"

2. **`matchToJob` function**
   - Creates a record in `placements` table
   - Links an applicant to a job order
   - `placements` table is the "bridge" between applicants and job orders

3. **`deleteMatch` function**
   - Removes the match
   - Uses two `.eq()` conditions (both must be true)
   - `applicant_id = X AND job_order_id = Y`

**Save the file** (Ctrl+S)

---

## 🚀 STEP 2: CREATE LIST PAGE

This page shows all job orders.

### Create: `app/(app)/job-orders/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import JobOrdersListWithFilters from "@/components/JobOrdersListWithFilters"

export default async function JobOrdersPage() {
  const supabase = await createSupabaseServer()

  const { data: orders, error } = await supabase
    .from("job_orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error loading job orders</div>
  }

  const list = (orders ?? []).map((o) => ({
    id: o.id,
    created_at: o.created_at,
    company: o.company ?? null,
    country: o.country ?? null,
    job_title: o.job_title ?? null,
    no_workers: o.no_workers ?? null,
    status: o.status ?? null,
  }))

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Job Orders</h1>
        <Link
          href="/job-orders/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Job Order
        </Link>
      </div>
      <JobOrdersListWithFilters jobOrders={list} />
    </div>
  )
}
```

**This is very similar to the Applicants page!**

The pattern is the same:
1. Fetch data from database
2. Transform the data
3. Pass to a list component
4. Show "Add" button

**Save the file** (Ctrl+S)

---

## 🚀 STEP 3: CREATE TABLE COMPONENT

This displays job orders in a table with search and filters.

### Create: `components/JobOrdersListWithFilters.tsx`

```typescript
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Pencil, Eye, Users } from "lucide-react"
import DeleteJobOrderButton from "./DeleteJobOrderButton"

export type JobOrder = {
  id: number
  created_at: string
  company: string | null
  country: string | null
  job_title: string | null
  no_workers: number | null
  status: string | null
}

type Props = {
  jobOrders: JobOrder[]
}

export default function JobOrdersListWithFilters({ jobOrders }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = jobOrders
    const q = search.trim().toLowerCase()
    
    if (q) {
      list = list.filter((job) => {
        const idStr = `jo-${new Date().getFullYear()}-${job.id}`.toLowerCase()
        const company = (job.company ?? "").toLowerCase()
        const country = (job.country ?? "").toLowerCase()
        const title = (job.job_title ?? "").toLowerCase()
        return (
          idStr.includes(q) ||
          company.includes(q) ||
          country.includes(q) ||
          title.includes(q)
        )
      })
    }
    
    if (statusFilter !== "All") {
      list = list.filter((job) => job.status?.trim() === statusFilter)
    }
    
    return list
  }, [jobOrders, search, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search company, country, job title, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">Status: All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="On Hold">On Hold</option>
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
              <th className="p-3 text-left font-medium">Job Order ID</th>
              <th className="p-3 text-left font-medium">Company</th>
              <th className="p-3 text-left font-medium">Country</th>
              <th className="p-3 text-left font-medium">Job Title</th>
              <th className="p-3 text-left font-medium">Workers Needed</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr key={job.id} className="border-t border-gray-100">
                <td className="p-3">{`JO-${new Date().getFullYear()}-${job.id}`}</td>
                <td className="p-3">{job.company ?? "—"}</td>
                <td className="p-3">{job.country ?? "—"}</td>
                <td className="p-3">{job.job_title ?? "—"}</td>
                <td className="p-3">{job.no_workers ?? 0}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      job.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Closed"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status ?? "—"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/job-orders/${job.id}/match`}
                      className="rounded p-1 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                      title="Match Applicants"
                    >
                      <Users className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${job.id}`}
                      className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/job-orders/${job.id}/edit`}
                      className="rounded p-1 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteJobOrderButton id={job.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No job orders found.
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

**What's different from Applicants table:**

1. **Status badge with colors**
   - Green for "Open"
   - Gray for "Closed"
   - Yellow for "On Hold"
   - Uses conditional classes with template literals

2. **Users icon**
   - Links to the "Match Applicants" page
   - This is where you connect applicants to this job

**Save the file** (Ctrl+S)

---

## 🚀 STEP 4: CREATE DELETE BUTTON

### Create: `components/DeleteJobOrderButton.tsx`

```typescript
"use client"

import { Trash2 } from "lucide-react"
import { deleteJobOrder } from "@/app/(app)/job-orders/actions"

type Props = {
  id: number
}

export default function DeleteJobOrderButton({ id }: Props) {
  function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this job order? This cannot be undone."
    )

    if (confirmed) {
      const formData = new FormData()
      formData.append("id", String(id))
      deleteJobOrder(formData)
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

**Same pattern as DeleteApplicantButton!**

Just imports a different action function.

**Save the file** (Ctrl+S)

---

## 🚀 STEP 5: CREATE ADD JOB ORDER PAGE

### Create: `app/(app)/job-orders/add/page.tsx`

```typescript
import Link from "next/link"
import { addJobOrder } from "../actions"

export default function AddJobOrderPage() {
  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Add Job Order</h1>
          <Link href="/job-orders" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={addJobOrder} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input name="company" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Country *</label>
                <input name="country" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Job Title *</label>
                <input name="job_title" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Gender Requirement</label>
                <select name="gender" className={inputClass}>
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Number of Workers *</label>
                <input 
                  name="no_workers" 
                  type="number" 
                  className={inputClass} 
                  required 
                  defaultValue={1}
                  min={1}
                />
              </div>

              <div>
                <label className={labelClass}>Years of Experience Required</label>
                <input 
                  name="years_exp_required" 
                  type="number" 
                  className={inputClass}
                  defaultValue={0}
                  min={0}
                />
              </div>

              <div>
                <label className={labelClass}>Salary *</label>
                <input name="salary" className={inputClass} required placeholder="e.g., $2000/month" />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass}>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Skills Required</label>
                <textarea 
                  name="skills_required" 
                  className={inputClass} 
                  rows={3}
                  placeholder="e.g., Cooking, Cleaning, Child Care"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Link
              href="/job-orders"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Job Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Key fields:**

- **Company** = Who is hiring
- **Country** = Where the job is
- **Job Title** = What position
- **Gender** = Any/Male/Female
- **Number of Workers** = How many needed
- **Years Experience** = Experience requirement
- **Salary** = Pay offered
- **Skills Required** = What skills they need
- **Status** = Open/Closed/On Hold

**Save the file** (Ctrl+S)

---

## 🚀 STEP 6: CREATE VIEW JOB ORDER PAGE

### Create: `app/(app)/job-orders/[id]/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function ViewJobOrderPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: job, error } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !job) {
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
            Job Order: {job.company} - {job.job_title}
          </h1>
          <div className="flex gap-2">
            <Link
              href={`/job-orders/${id}/match`}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
            >
              Match Applicants
            </Link>
            <Link
              href={`/job-orders/${id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/job-orders"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={fieldClass}>
              <div className={labelClass}>Job Order ID</div>
              <div className={valueClass}>JO-{new Date().getFullYear()}-{job.id}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Company</div>
              <div className={valueClass}>{job.company ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Country</div>
              <div className={valueClass}>{job.country ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Job Title</div>
              <div className={valueClass}>{job.job_title ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Gender Requirement</div>
              <div className={valueClass}>{job.gender ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Number of Workers Needed</div>
              <div className={valueClass}>{job.no_workers ?? 0}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Years of Experience Required</div>
              <div className={valueClass}>{job.years_exp_required ?? 0} years</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Salary</div>
              <div className={valueClass}>{job.salary ?? "—"}</div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Status</div>
              <div className={valueClass}>
                <span
                  className={`inline-block rounded px-2 py-1 text-xs ${
                    job.status === "Open"
                      ? "bg-green-100 text-green-700"
                      : job.status === "Closed"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.status ?? "—"}
                </span>
              </div>
            </div>

            <div className={fieldClass}>
              <div className={labelClass}>Date Created</div>
              <div className={valueClass}>
                {job.created_at ? String(job.created_at).slice(0, 10) : "—"}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className={labelClass}>Skills Required</div>
              <div className={valueClass}>{job.skills_required ?? "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Notice the "Match Applicants" button!**

This will take us to a special page where we can connect applicants to this job.

**Save the file** (Ctrl+S)

---

## 🚀 STEP 7: CREATE EDIT JOB ORDER PAGE

### Create: `app/(app)/job-orders/[id]/edit/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateJobOrder } from "../../actions"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function EditJobOrderPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: job, error } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !job) {
    notFound()
  }

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Edit Job Order</h1>
          <Link href="/job-orders" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>

        <form action={updateJobOrder} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <input type="hidden" name="id" value={id} />
          
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input 
                  name="company" 
                  className={inputClass} 
                  required 
                  defaultValue={job.company ?? ""}
                />
              </div>

              <div>
                <label className={labelClass}>Country *</label>
                <input 
                  name="country" 
                  className={inputClass} 
                  required 
                  defaultValue={job.country ?? ""}
                />
              </div>

              <div>
                <label className={labelClass}>Job Title *</label>
                <input 
                  name="job_title" 
                  className={inputClass} 
                  required 
                  defaultValue={job.job_title ?? ""}
                />
              </div>

              <div>
                <label className={labelClass}>Gender Requirement</label>
                <select 
                  name="gender" 
                  className={inputClass}
                  defaultValue={job.gender ?? "Any"}
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Number of Workers *</label>
                <input 
                  name="no_workers" 
                  type="number" 
                  className={inputClass} 
                  required 
                  defaultValue={job.no_workers ?? 1}
                  min={1}
                />
              </div>

              <div>
                <label className={labelClass}>Years of Experience Required</label>
                <input 
                  name="years_exp_required" 
                  type="number" 
                  className={inputClass}
                  defaultValue={job.years_exp_required ?? 0}
                  min={0}
                />
              </div>

              <div>
                <label className={labelClass}>Salary *</label>
                <input 
                  name="salary" 
                  className={inputClass} 
                  required 
                  defaultValue={job.salary ?? ""}
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select 
                  name="status" 
                  className={inputClass}
                  defaultValue={job.status ?? "Open"}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Skills Required</label>
                <textarea 
                  name="skills_required" 
                  className={inputClass} 
                  rows={3}
                  defaultValue={job.skills_required ?? ""}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Link
              href="/job-orders"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Update Job Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Same pattern as edit applicant:**
- Hidden ID field
- Pre-filled with `defaultValue`
- Calls `updateJobOrder` action

**Save the file** (Ctrl+S)

---

## 🚀 STEP 8: CREATE MATCH APPLICANTS PAGE

**This is the cool part!** This page lets you match applicants to a job order.

### Create: `app/(app)/job-orders/[id]/match/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { matchToJob, deleteMatch } from "../../actions"
import { notFound } from "next/navigation"
import { X } from "lucide-react"

type Props = {
  params: { id: string }
}

export default async function MatchApplicantsPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: job } = await supabase
    .from("job_orders")
    .select("*")
    .eq("id", id)
    .single()

  if (!job) notFound()

  const { data: placements } = await supabase
    .from("placements")
    .select("applicant_id, applicants(id, first_name, last_name, position_applied, status)")
    .eq("job_order_id", id)

  const matched = (placements ?? []).map((p: any) => p.applicants).filter(Boolean)

  const { data: allApplicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name, position_applied, status")
    .order("created_at", { ascending: false })

  const matchedIds = new Set(matched.map((a: any) => a.id))
  const available = (allApplicants ?? []).filter((a) => !matchedIds.has(a.id))

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/job-orders" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Job Orders
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Match Applicants: {job.company} - {job.job_title}
          </h1>
          <p className="text-sm text-gray-600">
            {matched.length} / {job.no_workers} workers matched
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Matched Applicants</h2>
            {matched.length === 0 ? (
              <p className="text-sm text-gray-500">No applicants matched yet.</p>
            ) : (
              <div className="space-y-2">
                {matched.map((applicant: any) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between rounded border border-gray-200 p-3"
                  >
                    <div>
                      <div className="font-medium">
                        {applicant.first_name} {applicant.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {applicant.position_applied} • {applicant.status}
                      </div>
                    </div>
                    <form action={deleteMatch}>
                      <input type="hidden" name="applicant_id" value={applicant.id} />
                      <input type="hidden" name="job_order_id" value={id} />
                      <button
                        type="submit"
                        className="rounded p-1 text-red-600 hover:bg-red-100"
                        title="Remove match"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Available Applicants</h2>
            {available.length === 0 ? (
              <p className="text-sm text-gray-500">All applicants have been matched or no applicants available.</p>
            ) : (
              <div className="space-y-2">
                {available.map((applicant: any) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between rounded border border-gray-200 p-3"
                  >
                    <div>
                      <div className="font-medium">
                        {applicant.first_name} {applicant.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {applicant.position_applied} • {applicant.status}
                      </div>
                    </div>
                    <form action={matchToJob}>
                      <input type="hidden" name="applicant_id" value={applicant.id} />
                      <input type="hidden" name="job_order_id" value={id} />
                      <button
                        type="submit"
                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Match
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**What's happening here:**

1. **Fetch job order**
   - Get the job details to show in heading

2. **Fetch matched applicants**
   - Query `placements` table
   - `.select("applicant_id, applicants(...)")` = **JOIN with applicants table!**
   - Get applicant details for each placement
   - This is a **relation** in Supabase

3. **Fetch all applicants**
   - Get list of all applicants

4. **Calculate available applicants**
   - `matchedIds = Set of already matched IDs`
   - `available = all applicants - matched applicants`
   - Only show applicants not yet matched to this job

5. **Two columns**
   - Left: Matched applicants (with remove button)
   - Right: Available applicants (with match button)

6. **Forms for each applicant**
   - Small form with hidden inputs
   - `applicant_id` and `job_order_id`
   - Submit to either `matchToJob` or `deleteMatch`

**Save the file** (Ctrl+S)

---

## ✅ TEST YOUR JOB ORDERS MODULE

### 1. Start server (if not running)

```bash
npm run dev
```

### 2. Go to Job Orders page

`http://localhost:3000/job-orders`

### 3. Test features

**Test 1: Add a job order**
- Click "Add Job Order"
- Fill in: Company, Country, Job Title, Salary
- Set "Number of Workers" to 2
- Click "Save Job Order"
- Should appear in list

**Test 2: Search**
- Add a few more job orders
- Search by company name
- Search by country
- Search by job title

**Test 3: Filter by status**
- Change some job orders to "Closed" or "On Hold"
- Use status filter
- Try "Clear" button

**Test 4: View job order**
- Click eye icon
- Should see all details
- Notice the colored status badge

**Test 5: Edit job order**
- Click pencil icon or "Edit" button
- Change some fields
- Click "Update Job Order"
- Changes should save

**Test 6: Match applicants** (THE COOL PART!)
- Make sure you have some applicants (add them if needed)
- Click Users icon or "Match Applicants" button
- You should see:
  - Left side: Matched applicants (empty at first)
  - Right side: Available applicants
- Click "Match" on an applicant
- They should move to "Matched" column!
- Click X to remove the match
- They should go back to "Available"

**Test 7: Delete job order**
- Click trash icon
- Confirm deletion
- Job order should disappear

---

## 🎊 CONGRATULATIONS!

**You built the Job Orders module with a matching system!**

You learned:
✅ Same CRUD patterns  
✅ **Table relationships (JOIN queries)**  
✅ **Many-to-many relationships** (placements table)  
✅ Calculating available vs. matched items  
✅ Two-column layout  
✅ Conditional rendering (empty states)  

---

## 📚 WHAT'S NEXT?

### **Ready for Part 5?**

Open: `DONKEY_TUTORIAL_PART5_MONITORING.md`

You'll build the Monitoring module to track deployed workers!

### **Take a break!**

You've built two complete modules now. That's impressive!

---

## 🔥 YOU'RE HALFWAY THERE!

Keep up the great work! 💪

**Next:** DONKEY_TUTORIAL_PART5_MONITORING.md

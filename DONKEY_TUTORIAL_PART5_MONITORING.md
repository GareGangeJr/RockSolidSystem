# 🐴 DONKEY TUTORIAL - PART 5: MONITORING MODULE

**Welcome to Part 5!** 🎉

In this part, you'll build the **Monitoring Module** - track deployed workers and their performance!

---

## 📋 WHAT WE'RE BUILDING

By the end of this part, you'll have:

✅ A page showing all deployed workers  
✅ View which applicant is working for which company  
✅ Track deployment dates and status  
✅ Filter by deployment status  
✅ View detailed monitoring records  

**Time needed:** 1 hour

---

## 🎯 WHAT YOU'LL LEARN

- **Automatic record creation** (when applicant status changes to "Deployed")
- **Joining three tables** (monitoring, applicants, job_orders)
- **Read-only list views** (no add/edit, records auto-created)
- **Date tracking**

---

## 📂 FILES WE'LL CREATE

```
app/(app)/monitoring/
├── page.tsx                    # List all monitoring records
└── [id]/
    └── page.tsx               # View one monitoring record

components/
└── MonitoringListWithFilters.tsx  # Table with filters
```

**Note:** No add/edit pages! Monitoring records are automatically created when you change an applicant's status to "Deployed" in the Applicants module.

---

## 🚀 STEP 1: CREATE LIST PAGE

This page shows all monitoring records with applicant and job details.

### Create: `app/(app)/monitoring/page.tsx`

```typescript
import { createSupabaseServer } from "@/lib/supabase/server"
import MonitoringListWithFilters from "@/components/MonitoringListWithFilters"

export default async function MonitoringPage() {
  const supabase = await createSupabaseServer()

  const { data: monitoringRecords, error: monitoringError } = await supabase
    .from("monitoring")
    .select("*")
    .order("deployment_date", { ascending: false })

  if (monitoringError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-red-500">Error: {monitoringError.message}</p>
      </div>
    )
  }

  const applicantIds = monitoringRecords?.map((r: any) => r.applicant_id) || []
  const jobOrderIds = monitoringRecords?.map((r: any) => r.job_order_id) || []

  const { data: applicants } = await supabase
    .from("applicants")
    .select("id, first_name, last_name")
    .in("id", applicantIds.length > 0 ? applicantIds : [0])

  const { data: jobOrders } = await supabase
    .from("job_orders")
    .select("id, job_title, company, country")
    .in("id", jobOrderIds.length > 0 ? jobOrderIds : [0])

  const records = monitoringRecords?.map((m: any) => {
    const applicant = applicants?.find((a: any) => a.id === m.applicant_id)
    const jobOrder = jobOrders?.find((j: any) => j.id === m.job_order_id)
    return { ...m, applicant, jobOrder }
  }) || []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deployment Monitoring</h1>
      <MonitoringListWithFilters records={records} />
    </div>
  )
}
```

**What's different here:**

1. **Manual JOIN approach**
   - Fetch monitoring records first
   - Extract all `applicant_id` values
   - Extract all `job_order_id` values
   - Fetch applicants where ID is in the list
   - Fetch job orders where ID is in the list
   - Combine them in JavaScript

2. **Why this approach?**
   - More control over what data we fetch
   - Can optimize by selecting only needed fields
   - Easier to understand for beginners

3. **`.in("id", [1, 2, 3])`**
   - SQL: `WHERE id IN (1, 2, 3)`
   - Fetch multiple records at once
   - `[0]` as fallback if empty (prevents errors)

**Save the file** (Ctrl+S)

---

## 🚀 STEP 2: CREATE TABLE COMPONENT

### Create: `components/MonitoringListWithFilters.tsx`

```typescript
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

export type MonitoringRecord = {
  id: number
  applicant_id: number
  job_order_id: number
  deployment_status: string | null
  deployment_date: string | null
  contract_end_date: string | null
  performance_notes: string | null
  created_at: string
  applicant?: {
    id: number
    first_name: string | null
    last_name: string | null
  }
  jobOrder?: {
    id: number
    job_title: string | null
    company: string | null
    country: string | null
  }
}

type Props = {
  records: MonitoringRecord[]
}

export default function MonitoringListWithFilters({ records }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = records
    const q = search.trim().toLowerCase()

    if (q) {
      list = list.filter((rec) => {
        const applicantName = `${rec.applicant?.first_name || ""} ${rec.applicant?.last_name || ""}`.toLowerCase()
        const company = (rec.jobOrder?.company ?? "").toLowerCase()
        const country = (rec.jobOrder?.country ?? "").toLowerCase()
        const jobTitle = (rec.jobOrder?.job_title ?? "").toLowerCase()
        return (
          applicantName.includes(q) ||
          company.includes(q) ||
          country.includes(q) ||
          jobTitle.includes(q)
        )
      })
    }

    if (statusFilter !== "All") {
      list = list.filter((rec) => rec.deployment_status?.trim() === statusFilter)
    }

    return list
  }, [records, search, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search applicant, company, country, job title..."
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
          <option value="Deployed">Deployed</option>
          <option value="Deployed(With Concerns)">Deployed (With Concerns)</option>
          <option value="Completed Contract">Completed Contract</option>
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
              <th className="p-3 text-left font-medium">Applicant Name</th>
              <th className="p-3 text-left font-medium">Company</th>
              <th className="p-3 text-left font-medium">Country</th>
              <th className="p-3 text-left font-medium">Job Title</th>
              <th className="p-3 text-left font-medium">Deployment Date</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec) => (
              <tr key={rec.id} className="border-t border-gray-100">
                <td className="p-3">
                  {rec.applicant
                    ? `${rec.applicant.first_name || ""} ${rec.applicant.last_name || ""}`
                    : "—"}
                </td>
                <td className="p-3">{rec.jobOrder?.company ?? "—"}</td>
                <td className="p-3">{rec.jobOrder?.country ?? "—"}</td>
                <td className="p-3">{rec.jobOrder?.job_title ?? "—"}</td>
                <td className="p-3">
                  {rec.deployment_date ? String(rec.deployment_date).slice(0, 10) : "—"}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      rec.deployment_status === "Deployed"
                        ? "bg-green-100 text-green-700"
                        : rec.deployment_status === "Deployed(With Concerns)"
                        ? "bg-yellow-100 text-yellow-700"
                        : rec.deployment_status === "Completed Contract"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {rec.deployment_status ?? "—"}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/monitoring/${rec.id}`}
                    className="rounded p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No monitoring records found.
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

**Key features:**

1. **Type includes nested objects**
   - `applicant?:` = Optional applicant object
   - `jobOrder?:` = Optional job order object
   - `?` means it might be undefined

2. **Search across multiple fields**
   - Applicant name
   - Company
   - Country
   - Job title

3. **Status badges with colors**
   - Green for "Deployed"
   - Yellow for "Deployed(With Concerns)"
   - Blue for "Completed Contract"
   - Red for "Terminated"

4. **Only View action**
   - No edit or delete
   - These records are auto-managed

**Save the file** (Ctrl+S)

---

## 🚀 STEP 3: CREATE VIEW MONITORING PAGE

### Create: `app/(app)/monitoring/[id]/page.tsx`

```typescript
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function ViewMonitoringPage({ params }: Props) {
  const supabase = await createSupabaseServer()
  const id = Number(params.id)

  const { data: record, error } = await supabase
    .from("monitoring")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !record) {
    notFound()
  }

  const { data: applicant } = await supabase
    .from("applicants")
    .select("id, first_name, middle_name, last_name, position_applied, contact_number, email")
    .eq("id", record.applicant_id)
    .single()

  const { data: jobOrder } = await supabase
    .from("job_orders")
    .select("id, company, country, job_title, salary")
    .eq("id", record.job_order_id)
    .single()

  const fieldClass = "text-sm"
  const labelClass = "font-medium text-gray-500"
  const valueClass = "mt-1 text-gray-900"

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Monitoring Record</h1>
          <Link
            href="/monitoring"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to Monitoring
          </Link>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Deployment Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className={fieldClass}>
                <div className={labelClass}>Deployment Status</div>
                <div className={valueClass}>{record.deployment_status ?? "—"}</div>
              </div>

              <div className={fieldClass}>
                <div className={labelClass}>Deployment Date</div>
                <div className={valueClass}>
                  {record.deployment_date
                    ? String(record.deployment_date).slice(0, 10)
                    : "—"}
                </div>
              </div>

              <div className={fieldClass}>
                <div className={labelClass}>Contract End Date</div>
                <div className={valueClass}>
                  {record.contract_end_date
                    ? String(record.contract_end_date).slice(0, 10)
                    : "—"}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className={labelClass}>Performance Notes</div>
                <div className={valueClass}>{record.performance_notes ?? "—"}</div>
              </div>
            </div>
          </div>

          {applicant && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Applicant Details</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className={fieldClass}>
                  <div className={labelClass}>Full Name</div>
                  <div className={valueClass}>
                    {`${applicant.first_name || ""} ${applicant.middle_name || ""} ${applicant.last_name || ""}`.trim()}
                  </div>
                </div>

                <div className={fieldClass}>
                  <div className={labelClass}>Position Applied</div>
                  <div className={valueClass}>{applicant.position_applied ?? "—"}</div>
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
                  <div className={labelClass}>Applicant Link</div>
                  <div className={valueClass}>
                    <Link
                      href={`/applicants/${applicant.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Full Profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {jobOrder && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Job Order Details</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className={fieldClass}>
                  <div className={labelClass}>Company</div>
                  <div className={valueClass}>{jobOrder.company ?? "—"}</div>
                </div>

                <div className={fieldClass}>
                  <div className={labelClass}>Country</div>
                  <div className={valueClass}>{jobOrder.country ?? "—"}</div>
                </div>

                <div className={fieldClass}>
                  <div className={labelClass}>Job Title</div>
                  <div className={valueClass}>{jobOrder.job_title ?? "—"}</div>
                </div>

                <div className={fieldClass}>
                  <div className={labelClass}>Salary</div>
                  <div className={valueClass}>{jobOrder.salary ?? "—"}</div>
                </div>

                <div className={fieldClass}>
                  <div className={labelClass}>Job Order Link</div>
                  <div className={valueClass}>
                    <Link
                      href={`/job-orders/${jobOrder.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Full Job Order →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**What's special here:**

1. **Three sections**
   - Deployment info (from monitoring table)
   - Applicant details (from applicants table)
   - Job order details (from job_orders table)

2. **Links to related records**
   - "View Full Profile" → Goes to applicant page
   - "View Full Job Order" → Goes to job order page
   - This helps navigate between related data

3. **Read-only view**
   - No edit button
   - Just displaying information
   - Records are managed automatically

**Save the file** (Ctrl+S)

---

## ✅ TEST YOUR MONITORING MODULE

### 1. How to create monitoring records

**You don't create them directly!** They're auto-created when you:

1. Go to Applicants page
2. Match an applicant to a job order (in Job Orders module)
3. Change the applicant's status to "Deployed"
4. **Automatically**, a monitoring record is created!

### 2. Test the flow

**Step 1: Create test data**
- Make sure you have at least one applicant
- Make sure you have at least one job order
- Match the applicant to the job (Job Orders → Match Applicants)

**Step 2: Deploy the applicant**
- Go to Applicants page
- Find the matched applicant
- Change their status dropdown to "Deployed"
- Wait for it to save

**Step 3: Check monitoring**
- Go to Monitoring page: `http://localhost:3000/monitoring`
- You should see a new monitoring record!
- It shows the applicant and the job they're deployed to

**Step 4: View details**
- Click the eye icon on a monitoring record
- Should see three sections:
  - Deployment info
  - Applicant details with link
  - Job order details with link
- Click "View Full Profile" to go to applicant
- Click "View Full Job Order" to go to job

**Step 5: Test filters**
- Search by applicant name
- Search by company
- Filter by deployment status

---

## 🎊 CONGRATULATIONS!

**You built the Monitoring module!**

You learned:
✅ **Automatic record creation**  
✅ **Fetching related data from multiple tables**  
✅ **Combining data in JavaScript**  
✅ **Read-only views**  
✅ **Cross-module navigation**  

---

## 📚 WHAT'S NEXT?

### **Ready for Part 6?**

Open: `DONKEY_TUTORIAL_PART6_EMPLOYEES.md`

You'll build the Employees module with auto-generated employee numbers!

---

## 🔥 ALMOST DONE!

Only two more modules to go! Keep it up! 💪

**Next:** DONKEY_TUTORIAL_PART6_EMPLOYEES.md

# Today's Session — Code Reviewer for Beginners

This guide explains **everything we did today** in plain, beginner-friendly language. Each file and piece of code is broken down so you understand what it does and why it's there.

---

## Quick Overview: What We Did Today

1. **Status options** — Added a shared list of statuses and applicant types
2. **Applicant Type** — Domestic Helper / Skilled Worker dropdown on Add & Edit
3. **Applicants table** — New columns (Type, Date Applied), removed Notes, added search + filters
4. **Status dropdown in table** — Change status directly from the list
5. **Edit page** — Full form (same as Add) with all fields
6. **View page** — Full read-only display (same layout as Add/Edit)
7. **Cleanup** — Removed "Rock Solid Manpower" header, removed Files/Edit from View top

---

## File 1: `lib/status-options.ts`

**Where:** In the `lib` folder (shared code used by many pages)

**What it does:** Stores the **exact list** of statuses and applicant types in one place. If you change them here, they update everywhere (Add form, Edit form, table filters, status dropdown).

```ts
export const STATUS_OPTIONS = [
  "New Applicant",
  "Selected",
  "With Visa & Contract",
  // ... more options
] as const

export const APPLICANT_TYPE_OPTIONS = ["Domestic Helper", "Skilled Worker"] as const
```

- **`as const`** — Tells TypeScript these arrays never change. Helps with type safety.
- **Why one file?** So we don't copy-paste the same list in 4 different places. One source of truth.

---

## File 2: `app/(app)/applicants/actions.ts`

**Where:** Same folder as the applicant pages. Contains **server actions** (functions that run on the server).

### The `optStr` helper

```ts
const optStr = (formData: FormData, key: string) => (formData.get(key) as string) || ""
```

- **What it does:** Gets a value from the form. If the field is empty or missing, returns `""` instead of `null`.
- **Why?** Some database columns don't accept `null`. Empty string `""` is safer for optional text fields.

### `addApplicant(formData)`

- **What it does:** Runs when you submit the Add Applicant form.
- **Step 1:** Get Supabase client
- **Step 2:** Insert a new row into `applicants` table. Each `formData.get("field_name")` reads what the user typed.
- **Step 3:** `revalidatePath("/applicants")` — Refresh the list page so it shows the new applicant.
- **Step 4:** `redirect("/applicants")` — Send user back to the list.

**Important fields we added today:**
- `applicant_type` — Domestic Helper or Skilled Worker
- `status` — Default "New Applicant"
- `date_applied` — When they applied

### `updateApplicantStatus(applicantId, newStatus)`

- **What it does:** Updates **only** the status of one applicant. Used when you change the dropdown in the table.
- **Step 1:** Get Supabase
- **Step 2:** `.update({ status: newStatus }).eq("id", applicantId)` — Change the status for that id
- **Step 3:** Revalidate the list
- **Step 4:** Return `{ error }` so the dropdown knows if it succeeded

### `updateApplicant(formData)`

- **What it does:** Runs when you submit the Edit form. Updates **all** fields for that applicant.
- Same idea as `addApplicant`, but uses `.update()` and `.eq("id", id)` instead of `.insert()`.

---

## File 3: `components/StatusDropdown.tsx`

**Where:** In `components`. A reusable piece of UI.

**What it does:** Shows a dropdown in the applicants table. When you pick a new status, it updates the database right away.

```ts
"use client"
```

- **Why?** Because we use `onChange` (runs in the browser). That needs a **client component**.

```ts
async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
  const newStatus = e.target.value
  const { error } = await updateApplicantStatus(applicantId, newStatus)
  if (error) alert("Error updating status")
  else alert("Status updated")
}
```

- **Step 1:** Get the new value from the dropdown (`e.target.value`)
- **Step 2:** Call the server action `updateApplicantStatus`
- **Step 3:** Show alert based on success or error

```ts
const options = currentStatus && !isInList
  ? [currentStatus, ...STATUS_OPTIONS]
  : [...STATUS_OPTIONS]
```

- **What it does:** If the applicant has an old status (e.g. "For Processing") that's not in our new list, we add it to the options so it still shows. Otherwise we use the normal list.

---

## File 4: `components/ApplicantsListWithFilters.tsx`

**Where:** In `components`. Wraps the whole applicants table with search and filters.

**What it does:** Renders the search bar, filter dropdowns, and table. Filters the list **in the browser** (client-side) as you type or change filters.

### State (what changes when user interacts)

```ts
const [search, setSearch] = useState("")
const [typeFilter, setTypeFilter] = useState("All")
const [statusFilter, setStatusFilter] = useState("All")
```

- **search** — What the user typed in the search box
- **typeFilter** — All, Domestic Helper, or Skilled Worker
- **statusFilter** — All, or one of the status options

### `useMemo` — filter the list

```ts
const filtered = useMemo(() => {
  let list = applicants
  // 1. Search: match name, id, position, contact, email (case-insensitive)
  if (q) list = list.filter(...)
  // 2. Type filter
  if (typeFilter !== "All") list = list.filter(...)
  // 3. Status filter
  if (statusFilter !== "All") list = list.filter(...)
  return list
}, [applicants, search, typeFilter, statusFilter])
```

- **useMemo** — Re-runs the filter logic only when `applicants`, `search`, `typeFilter`, or `statusFilter` changes. Avoids unnecessary work.
- **filtered** — The list that actually gets shown in the table.

### `formatDate(dateApplied, createdAt)`

- **What it does:** Shows date as `YYYY-MM-DD`. Uses `date_applied` if it exists, else `created_at`. Shows "—" if both are empty.

### Table columns (in order)

1. Applicant ID  
2. Name  
3. Position  
4. **Type** (Domestic Helper / Skilled Worker)  
5. **Status** (dropdown — uses StatusDropdown component)  
6. Contact  
7. Email  
8. **Date Applied** (YYYY-MM-DD)  
9. Actions (Files, View, Edit, Delete)

- **Notes** column was removed (Notes are on the View page only).

---

## File 5: `app/(app)/applicants/page.tsx`

**Where:** The applicants list page. URL: `/applicants`

**What it does:**
1. Load applicants from Supabase (server-side)
2. Map the data to a simple shape (id, name, type, status, etc.)
3. Pass that list to `ApplicantsListWithFilters`

```ts
const list = (applicants ?? []).map((a) => ({
  id: a.id,
  applicant_type: a.applicant_type ?? null,
  date_applied: a.date_applied ?? null,
  // ... etc
}))
```

- We map so the component gets a clean object. `?? null` means "use null if undefined".

---

## File 6: `app/(app)/applicants/add/page.tsx`

**Where:** Add Applicant form. URL: `/applicants/add`

**What it does:** Full form with all sections (Job, Personal, Family, Emergency, Beneficiaries, Education, Work, Skills, Passport, Interview, Status, Applicant Type, Date Applied).

**Important parts:**
- `action={addApplicant}` — Form submits to the `addApplicant` server action
- `name="applicant_type"` — Must match what we use in `formData.get("applicant_type")`
- `defaultValue="Domestic Helper"` — Pre-selected option
- `defaultValue="New Applicant"` — Default status

**Styling:**
- `inputClass`, `labelClass`, `sectionClass` — Reused CSS classes so the form looks consistent

---

## File 7: `app/(app)/applicants/[id]/edit/page.tsx`

**Where:** Edit Applicant form. URL: `/applicants/123/edit` (123 = applicant id)

**What it does:** Same structure as Add, but:
1. Loads the applicant from the database
2. Fills every input with `defaultValue={v(a.field_name)}` so you see current data

**The `v()` helper:**
```ts
const v = (x: unknown): string => (x != null && x !== "" ? String(x) : "")
```
- Converts value to string. Returns `""` if null or empty. Used so `defaultValue` always gets a string.

---

## File 8: `app/(app)/applicants/[id]/page.tsx`

**Where:** View Applicant page. URL: `/applicants/123`

**What it does:** Shows all applicant data in **read-only** format. Same sections as Add/Edit, but as text instead of inputs.

**Helpers:**
- `v(x)` — Show value or "—" if empty
- `d(x)` — Format date as YYYY-MM-DD, or "—" if empty

**Layout:**
- Top: Title + "Back to list" only (Files and Edit buttons were removed from top)
- Bottom: Files section with "Manage files" link

---

## File 9: `supabase-add-applicant-type.sql`

**Where:** Project root

**What it does:** Run this in Supabase SQL Editor **once** if the `applicant_type` column doesn't exist:

```sql
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS applicant_type TEXT DEFAULT 'Domestic Helper';
```

- Adds a new column `applicant_type`
- Default value: "Domestic Helper"
- `IF NOT EXISTS` — Safe to run more than once

---

## Data Flow Summary

| Action | What Happens |
|--------|--------------|
| **Add applicant** | Form → `addApplicant` → Supabase INSERT → Redirect to list |
| **Edit applicant** | Form → `updateApplicant` → Supabase UPDATE → Redirect to list |
| **Change status in table** | Dropdown onChange → `updateApplicantStatus` → Supabase UPDATE → Alert |
| **Search/Filter** | User types/picks → `useMemo` filters list → Table re-renders with filtered rows |

---

## Key Concepts for Beginners

| Concept | Simple meaning |
|---------|----------------|
| **Server action** | Function with `"use server"`. Runs on the server. Used for forms and database updates. |
| **Client component** | Has `"use client"`. Runs in the browser. Needed for `onChange`, `useState`, etc. |
| **formData.get("name")** | Gets the value of the input with `name="name"` when the form is submitted. |
| **defaultValue** | Initial value of an input. Used for edit forms (pre-fill with existing data). |
| **useState** | Holds a value that can change. When it changes, the component re-renders. |
| **useMemo** | Runs a calculation only when certain values change. Used for filtering. |

---

## Where Each Thing Lives

| What | File |
|------|------|
| Status & applicant type lists | `lib/status-options.ts` |
| Add/Update/UpdateStatus logic | `app/(app)/applicants/actions.ts` |
| Status dropdown in table | `components/StatusDropdown.tsx` |
| Search, filters, table | `components/ApplicantsListWithFilters.tsx` |
| Applicants list page | `app/(app)/applicants/page.tsx` |
| Add form | `app/(app)/applicants/add/page.tsx` |
| Edit form | `app/(app)/applicants/[id]/edit/page.tsx` |
| View (read-only) | `app/(app)/applicants/[id]/page.tsx` |
| SQL for applicant_type | `supabase-add-applicant-type.sql` |

---

That's everything we did today. Re-read each section and follow the code in your editor to see how it all connects.

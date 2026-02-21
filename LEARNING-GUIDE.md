# Rock Solid System — Beginner's Learning Guide

This guide explains **what** the system does and **how** the code is organized, in simple terms.

---

## 1. What This System Does (In Plain Words)

**Rock Solid** is a **recruitment / manpower** web app. People use it to:

| What | Meaning |
|------|--------|
| **Applicants** | List of people who applied for jobs. You can add, view, edit, delete them and attach files. |
| **Job orders** | Jobs that need to be filled (company, position, number of slots). |
| **Matching** | Link applicants to job orders (who is placed in which job). |
| **Dashboard** | Summary numbers (total applicants, deployed, etc.). |

So: **you manage applicants, job orders, and who is matched to which job.**

---

## 2. Tech You Need to Know

| Term | Simple meaning |
|------|----------------|
| **Next.js** | A React framework. It turns your folders and files into **pages** (URLs). |
| **React** | Library for building the UI (buttons, forms, tables) with components. |
| **Supabase** | Backend: **database** (tables like `applicants`, `job_orders`), **auth** (login), and **file storage**. |
| **Tailwind** | CSS classes you put in your JSX (e.g. `className="p-4 bg-blue-500"`) to style the page. |

---

## 3. How the Code Is Organized

```
app/(app)/           → All the main pages (dashboard, applicants, job-orders, etc.)
app/(app)/applicants → Everything for the "Applicants" section
components/          → Reusable pieces (buttons, forms, layout)
lib/supabase/        → How we talk to the database (Supabase)
```

**Important idea:** In Next.js, **a folder with a `page.tsx` file = a page (a URL)**.

- `app/(app)/applicants/page.tsx`  → URL: `/applicants` (list of applicants)
- `app/(app)/applicants/add/page.tsx` → URL: `/applicants/add` (add new applicant)
- `app/(app)/applicants/[id]/page.tsx` → URL: `/applicants/123` (view applicant with id 123)

The `(app)` part is a **route group**: it doesn’t change the URL, it just groups routes and shares the same layout (sidebar + top bar).

---

## 4. One Complete Flow: Adding an Applicant

Follow this flow in the code to see how a **page**, **form**, and **server action** work together.

### Step 1: User clicks "Add Applicant"

- That link goes to **`/applicants/add`**.
- The file that runs is: **`app/(app)/applicants/add/page.tsx`**.
- That page shows a **form** with fields: first name, last name, position, status, contact, email, etc.

### Step 2: User fills the form and submits

- The form’s `action` is set to a **server action** (a function that runs on the server).
- The server action lives in: **`app/(app)/applicants/actions.ts`**.

### Step 3: What the server action does

Open **`app/(app)/applicants/actions.ts`**. You’ll see something like this:

```ts
"use server"   // ← This means: run this function on the server, not in the browser

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()   // 1. Get a connection to the database
  await supabase.from("applicants").insert({     // 2. INSERT a new row in the "applicants" table
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    position_applied: formData.get("position_applied") as string,
    status: (formData.get("status") as string) || "For Processing",
    // ... more fields
  })
  revalidatePath("/applicants")   // 3. Tell Next.js to refresh the applicants list
  redirect("/applicants")         // 4. Send the user back to the list page
}
```

In simple words:

1. **`"use server"`** — This function runs on the server (safe for database and secrets).
2. **`createSupabaseServer()`** — Gives you a Supabase client to talk to the database.
3. **`supabase.from("applicants").insert({...})`** — Inserts one new applicant into the `applicants` table. The data comes from **`formData`** (what the user typed in the form).
4. **`revalidatePath("/applicants")`** — So when the user is sent back to `/applicants`, the list is up to date.
5. **`redirect("/applicants")`** — After saving, the user is sent back to the applicants list.

So: **form → server action → database insert → refresh list → redirect.**

---

## 5. How the Applicants List Page Works

The list is in **`app/(app)/applicants/page.tsx`**.

- It’s a **server component** (default in Next.js): it runs on the server and can read from the database directly.
- It uses **`createSupabaseServer()`** to get Supabase, then:
  - **`supabase.from("applicants").select("*").order("created_at", { ascending: false })`**  
    → Load all applicants, newest first.
- The result is stored in `applicants`, and the page **maps** over them to render a **table** (one row per applicant).
- Each row has links to **View**, **Edit**, **Files**, and a **Delete** button (which uses a client component).

So: **page loads → fetch applicants from DB → render table.**

---

## 6. Concepts to Remember

| Concept | Where you see it |
|--------|-------------------|
| **Page** | A `page.tsx` file. Defines what appears at a URL. |
| **Server component** | Default for `page.tsx`. Can use `async` and fetch from DB (e.g. applicants list). |
| **Server action** | Function with `"use server"`. Runs on the server; used for forms (add, update, delete). |
| **Client component** | Has `"use client"`. Runs in the browser; used for buttons that need JavaScript (e.g. delete confirmation). |
| **Supabase** | `from("table_name").select()`, `.insert()`, `.update()`, `.delete()` — that’s how you read/write the database. |

---

## 7. What to Change to “Code This System”

- **Add a field to applicants**  
  - In **`actions.ts`**: add the field to `insert` and `update`.  
  - In **`applicants/add/page.tsx`** and **`applicants/[id]/edit/page.tsx`**: add an input and put its name in `formData.get("field_name")`.
- **Add a new page**  
  - Create a new folder under `app/(app)/` and add a `page.tsx` (and optionally an `actions.ts` if you have forms).
- **Change the list**  
  - Edit **`app/(app)/applicants/page.tsx`**: change the `select()`, the table headers, and the row cells.

---

## Lesson 1: Add a New Field (Notes) — Done Together

This is the **fastest way to learn**: add one field everywhere. We added **Notes** for applicants. Follow the 4 places we changed (and 1 step in Supabase).

### Step 0: Add the column in Supabase (you do this once)

The app reads/writes the **applicants** table. That table must have a **notes** column.

1. Open your **Supabase** project → **SQL Editor**.
2. Run this (creates the column if it doesn’t exist):

```sql
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS notes TEXT;
```

3. Save. Now the database is ready.

### Step 1: Server action — save the field

**File:** `app/(app)/applicants/actions.ts`

- In **`addApplicant`**: we added `notes: (formData.get("notes") as string) || null` to the `.insert({ ... })`.
- In **`updateApplicant`**: we added the same to the `.update({ ... })`.

So when the form is submitted, whatever the user typed in "Notes" is saved to the database.

### Step 2: Add form — show the input

**File:** `app/(app)/applicants/add/page.tsx`

- We added a new `<div>` with a **label** "Notes" and an **input** with `name="notes"`.
- The `name` must match what we use in `formData.get("notes")` in the action.

### Step 3: Edit form — show the input with current value

**File:** `app/(app)/applicants/[id]/edit/page.tsx`

- Same label + input, but we use **`defaultValue={a.notes ?? ""}`** so the existing note is shown when editing.

### Step 4: List page — show the column

**File:** `app/(app)/applicants/page.tsx`

- We added **`notes: string | null`** to the `Applicant` type.
- We added a **table header** "Notes".
- We added a **table cell** that shows `app.notes` (or "—" if empty). We used `truncate` and `title` so long notes don’t break the layout.

### What you learned in one go

| Step | Idea |
|------|------|
| Supabase | New field = new column in the table (SQL or Table Editor). |
| actions.ts | New field = add it to `insert` and `update` with `formData.get("field_name")`. |
| Add form | New field = new input with that `name`. |
| Edit form | Same + `defaultValue={row.field_name}`. |
| List page | New field = add to type, add header, add cell. |

To add **another** field later (e.g. "middle_name"), repeat: column in DB → actions → add form → edit form → list. Same pattern every time.

---

## 8. Quick Reference: Important Files

| What | File |
|------|------|
| Applicants list | `app/(app)/applicants/page.tsx` |
| Add applicant form + logic | `app/(app)/applicants/add/page.tsx` + `app/(app)/applicants/actions.ts` (addApplicant) |
| Edit applicant | `app/(app)/applicants/[id]/edit/page.tsx` + `actions.ts` (updateApplicant) |
| Delete applicant | `components/DeleteApplicantButton.tsx` (client) + server action |
| Job orders list | `app/(app)/job-orders/page.tsx` |
| Job order actions | `app/(app)/job-orders/actions.ts` |
| Layout (sidebar, topbar) | `components/layout/app-shell.tsx`, `sidebar.tsx`, `topbar.tsx` |
| Database connection (server) | `lib/supabase/server.ts` |

---

You’re not expected to understand everything at once. Start by:  
1) Running the app (`npm run dev`),  
2) Adding an applicant in the UI,  
3) Following that flow in the code (add page → actions.ts → list page).  
Then try changing one small thing (e.g. a label or one field) and see it in the app.

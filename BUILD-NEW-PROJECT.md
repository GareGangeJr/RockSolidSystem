# How to Build a New Project (Like This One) From Scratch

Use this guide when you want to create a **new** Next.js + Supabase project from zero.  
Every piece of code is included, with an explanation of **every word**.

---

## Order of Dependencies

```
8. Sidebar, filters, extras     ← polish
7. Delete                       ← list + server action
6. Edit page                    ← View + update action
5. View page                    ← Supabase + dynamic route [id]
4. Add form + server action     ← Supabase + table
3. List page                    ← Supabase + table
2. Supabase setup               ← project + .env
1. Root layout + globals.css    ← Next.js project
0. Next.js project              ← npm create next-app
```

**Rule:** Build from bottom up. Each phase needs everything below it.

---

## Phase 0: Create the Project

**Commands to run in your terminal:**

```bash
npx create-next-app@latest my-new-project --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd my-new-project
npm install @supabase/ssr @supabase/supabase-js
```

**What each word means:**

| Word | Meaning |
|------|---------|
| `npx` | Run a package without installing it globally |
| `create-next-app` | Next.js starter scaffolding |
| `@latest` | Use the newest version |
| `my-new-project` | Name of the folder it creates (you can change this) |
| `--typescript` | Use TypeScript |
| `--tailwind` | Use Tailwind CSS |
| `--eslint` | Add ESLint for linting |
| `--app` | Use App Router (the modern way) |
| `--no-src-dir` | Put everything in root, not inside a `src` folder |
| `--import-alias "@/*"` | Lets you write `@/components/...` instead of `../../components/...` |
| `cd my-new-project` | Enter the new folder |
| `npm install @supabase/ssr @supabase/supabase-js` | Install Supabase packages for server and client |

---

## Phase 1: Root Layout

### File: `app/layout.tsx`

```tsx
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `import "./globals.css"` | Load the CSS file. `./` = same folder as this file; `globals.css` = your styles |
| `export default` | This is the main thing this file provides. Next.js expects `layout.tsx` to export a default function |
| `function RootLayout` | Name of the component. Can be any name, but "RootLayout" makes it clear |
| `{ children }` | Destructuring. `children` = whatever content Next.js puts inside this layout (your pages) |
| `: { children: React.ReactNode }` | TypeScript: `children` is an object with a property `children` whose type is `React.ReactNode` (any valid React content) |
| `<html lang="en">` | HTML root. `lang="en"` tells browsers this page is in English |
| `<body>` | Where the visible content goes |
| `{children}` | Render the page content here. `{}` means "run JavaScript inside JSX" |
| `</body>` `</html>` | Closing tags |

---

### File: `app/globals.css`

```css
@import "tailwindcss";
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `@import` | CSS at-rule that loads another stylesheet |
| `"tailwindcss"` | The Tailwind CSS package. This brings in all utility classes like `p-4`, `text-blue-600`, etc. |

---

## Phase 2: Supabase Setup

### File: `lib/supabase/server.ts`

```ts
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `import { cookies }` | Get the `cookies` function from Next.js. Needed so Supabase can read/write auth cookies |
| `from "next/headers"` | Next.js module where `cookies()` lives |
| `import { createServerClient }` | Supabase function that creates a client that works on the server |
| `from "@supabase/ssr"` | Supabase package for Server-Side Rendering (SSR) |
| `export async function` | Exports an async function. `async` = can use `await` inside |
| `createSupabaseServer` | Name of the function. You call this in your pages to get a Supabase client |
| `()` | No parameters |
| `const cookieStore` | Variable to hold the cookie store |
| `await cookies()` | `cookies()` is async in Next.js 15, so you `await` it. Returns an object to read/write cookies |
| `return createServerClient(` | Returns a Supabase client configured for the server |
| `process.env.NEXT_PUBLIC_SUPABASE_URL!` | Reads the URL from `.env.local`. `!` tells TypeScript "I promise this exists" |
| `process.env` | Node.js object: all environment variables |
| `NEXT_PUBLIC_` | Prefix that makes the variable available in the browser too (but we use it on server) |
| `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!` | The anonymous/public API key from Supabase |
| `{ cookies: { ... } }` | Options object. Supabase needs to know how to handle cookies for auth |
| `getAll()` | Function Supabase will call to get all cookies |
| `return cookieStore.getAll()` | Passes the cookies to Supabase |
| `setAll(cookiesToSet)` | Function Supabase calls when it wants to set cookies |
| `cookiesToSet.forEach(...)` | Loop over each cookie Supabase wants to set |
| `({ name, value, options })` | Destructure each cookie: its name, value, and options |
| `cookieStore.set(name, value, options)` | Actually set the cookie in the response |

---

### File: `.env.local` (create in project root)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Variable name. Must match exactly what the code uses |
| `=` | Assigns the value on the right to the variable |
| `https://...supabase.co` | Your Supabase project URL. Get it from Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public API key. Same place in Supabase. It's safe to use in frontend code |
| `eyJ...` | A long JWT token. Paste your real key here |

**Important:** Never commit `.env.local` to git. Add it to `.gitignore` (Next.js does this by default).

---

### Create table in Supabase (SQL Editor in dashboard)

```sql
create table applicants (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  email text
);
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `create table` | Create a new table |
| `applicants` | Table name. You'll use this in `supabase.from("applicants")` |
| `id` | Column name |
| `bigint` | Integer type, can hold large numbers |
| `primary key` | Unique identifier for each row. No two rows can have the same id |
| `generated always as identity` | PostgreSQL: auto-generate id (1, 2, 3...) for each new row |
| `created_at` | Column to store when the row was created |
| `timestamptz` | Timestamp with timezone |
| `default now()` | If you don't provide a value, use the current time |
| `first_name text` | Column `first_name`, type `text` (string) |
| `last_name text` | Same |
| `email text` | Same |

---

## Phase 3: List Page

### File: `app/(app)/applicants/page.tsx`

Create the folders `app`, then `(app)`, then `applicants`.  
`(app)` is a route group: it doesn't change the URL. So this file = `/applicants`.

```tsx
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function ApplicantsPage() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      <Link
        href="/applicants/add"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Add Applicant
      </Link>
      <table className="border mt-4 w-full">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.first_name} {a.last_name}</td>
              <td className="border p-2">{a.email ?? "-"}</td>
              <td className="border p-2">
                <Link href={`/applicants/${a.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `import Link` | Next.js component for links. Better than `<a>` because it does client-side navigation |
| `from "next/link"` | Where `Link` comes from |
| `import { createSupabaseServer }` | The function we created in Phase 2 |
| `from "@/lib/supabase/server"` | `@/` = project root. So full path = `lib/supabase/server.ts` |
| `export default async function` | Default export, async so we can `await` |
| `ApplicantsPage` | Component name. Convention: PascalCase |
| `const supabase` | Variable to hold the Supabase client |
| `await createSupabaseServer()` | Call our function. It's async, so we await it |
| `const { data, error }` | Destructure the result. Supabase returns `{ data, error }` |
| `await supabase` | Start a Supabase query. The whole chain is a Promise, so we await |
| `.from("applicants")` | Which table to query |
| `.select("*")` | Select all columns. `*` = everything |
| `.order("created_at", { ascending: false })` | Sort by `created_at`, newest first |
| `if (error)` | If Supabase returned an error |
| `return <div...>` | Return early with an error message. Stops the rest of the function |
| `className="p-6 text-red-500"` | Tailwind: padding 6, red text |
| `{error.message}` | Show the error text. `{}` = JavaScript inside JSX |
| `return (` | Return the main JSX |
| `<div className="p-6">` | Container with padding |
| `<h1 className="text-2xl font-bold mb-4">` | Title. `text-2xl` = big text, `font-bold` = bold, `mb-4` = margin-bottom |
| `Link` | Next.js link component |
| `href="/applicants/add"` | Where the link goes. This will be our Add page |
| `className="rounded bg-blue-600..."` | Tailwind: rounded corners, blue background, white text, padding |
| `Add Applicant` | Text shown on the button |
| `<table>` | HTML table |
| `<thead>` | Table header section |
| `<tr>` | Table row |
| `<th>` | Table header cell |
| `<tbody>` | Table body |
| `{data?.map((a) => (` | If `data` exists, loop over each row. `a` = one applicant |
| `?` | Optional chaining: if `data` is null/undefined, don't call `.map` |
| `key={a.id}` | React needs a unique `key` for each item in a list |
| `{a.first_name} {a.last_name}` | Show first and last name. `a` = current row |
| `{a.email ?? "-"}` | Show email, or `-` if null. `??` = nullish coalescing |
| `href={\`/applicants/${a.id}\`}` | Template literal: builds URL like `/applicants/5` |
| `` ` `` | Backticks start a template literal. `${a.id}` inserts the id |
| `View` | Link text |

---

## Phase 4: Add Form + Server Action

### File: `app/(app)/applicants/actions.ts`

```ts
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addApplicant(formData: FormData) {
  const supabase = await createSupabaseServer()

  await supabase.from("applicants").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: (formData.get("email") as string) || null,
  })

  revalidatePath("/applicants")
  redirect("/applicants")
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `"use server"` | **Must be first line.** Tells Next.js: this file contains Server Actions only. These run on the server, never in the browser |
| `import { createSupabaseServer }` | Same as before |
| `import { revalidatePath }` | Next.js function to tell the cache "this path's data is stale, refetch it" |
| `from "next/cache"` | Where `revalidatePath` lives |
| `import { redirect }` | Next.js function to send the user to another URL |
| `from "next/navigation"` | Where `redirect` lives |
| `export async function addApplicant` | Export an async function. This is what the form will call |
| `formData: FormData` | Parameter. When a form submits, the browser sends data. Next.js turns it into a `FormData` object |
| `formData.get("first_name")` | Get the value of the input whose `name="first_name"` |
| `as string` | TypeScript: treat this as a string. `get()` returns `string | File | null`, we want string |
| `(formData.get("email") as string) \|\| null` | Get email. If empty string, use `null`. `\|\|` = "or" |
| `.insert({...})` | Insert a new row into the table. The object keys must match column names |
| `revalidatePath("/applicants")` | After inserting, the list page cache is wrong. This forces it to refetch |
| `redirect("/applicants")` | Send the user back to the list after adding |

---

### File: `app/(app)/applicants/add/page.tsx`

```tsx
import { addApplicant } from "../actions"
import Link from "next/link"

export default function AddApplicantPage() {
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add Applicant</h1>

      <form action={addApplicant} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Applicant
        </button>
      </form>

      <Link href="/applicants" className="mt-4 inline-block text-blue-600">
        Back to list
      </Link>
    </div>
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `import { addApplicant }` | Import the server action we just wrote |
| `from "../actions"` | `../` = up one folder (from `add` to `applicants`), then `actions` = `actions.ts` |
| `form action={addApplicant}` | When form submits, call `addApplicant` on the server. No `onSubmit` needed |
| `action={addApplicant}` | The `action` prop receives a Server Action. Next.js handles the submit |
| `className="space-y-4"` | Tailwind: vertical spacing of 4 between children |
| `label htmlFor="first_name"` | `htmlFor` links the label to the input with `id="first_name"`. Clicking label focuses input |
| `name="first_name"` | **Critical.** This is how `formData.get("first_name")` gets the value. Must match exactly |
| `required` | HTML5: browser won't submit until this is filled |
| `type="email"` | HTML5: browser validates email format |
| `type="submit"` | Makes the button submit the form |
| `Back to list` | Link text |

---

## Phase 5: View One Page

### File: `app/(app)/applicants/[id]/page.tsx`

The folder `[id]` is a **dynamic segment**. URL `/applicants/5` means `id = "5"`.

```tsx
import { createSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ViewApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    return <div className="p-6 text-red-500">Error loading applicant</div>
  }

  if (!data) {
    return <div className="p-6">Applicant not found</div>
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">
        {data.first_name} {data.last_name}
      </h1>
      <p className="text-gray-600">Email: {data.email ?? "-"}</p>

      <div className="mt-4 space-x-4">
        <Link
          href={`/applicants/${id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <Link href="/applicants" className="text-gray-600 hover:underline">
          Back to list
        </Link>
      </div>
    </div>
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `params` | Next.js passes this to the page. It holds the dynamic parts of the URL |
| `params: Promise<{ id: string }>` | In Next.js 15, `params` is a Promise. When resolved, it's an object `{ id: string }` |
| `const { id } = await params` | Await the Promise, then destructure to get `id` |
| `[id]` | Folder name. The brackets mean "capture this part of the URL as `params.id`" |
| `.eq("id", id)` | Supabase: where clause. `id` column equals our `id` variable |
| `.maybeSingle()` | Get at most one row. Returns `null` if none found (unlike `.single()` which throws) |
| `if (!data)` | If no row found, show "not found" |

---

## Phase 6: Edit Page + Update Action

### Add to `app/(app)/applicants/actions.ts`:

```ts
export async function updateApplicant(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) redirect("/applicants")

  const supabase = await createSupabaseServer()

  await supabase
    .from("applicants")
    .update({
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: (formData.get("email") as string) || null,
    })
    .eq("id", id)

  revalidatePath("/applicants")
  revalidatePath(`/applicants/${id}`)
  redirect(`/applicants/${id}`)
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `formData.get("id")` | We'll add a hidden input with `name="id"` in the form |
| `if (!id) redirect(...)` | If somehow id is missing, go back to list |
| `.update({...})` | Update columns. Same shape as insert |
| `.eq("id", id)` | Only update the row where `id` matches. Without this, you'd update ALL rows |
| `revalidatePath(\`/applicants/${id}\`)` | Also refresh the view page cache |
| `redirect(\`/applicants/${id}\`)` | After saving, go to the view page |

---

### File: `app/(app)/applicants/[id]/edit/page.tsx`

```tsx
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateApplicant } from "../../actions"
import Link from "next/link"

export default async function EditApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return <div className="p-6">Applicant not found</div>
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Applicant</h1>

      <form action={updateApplicant} className="space-y-4">
        <input type="hidden" name="id" value={data.id} />

        <div>
          <label htmlFor="first_name" className="block text-sm font-medium">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            defaultValue={data.first_name ?? ""}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            defaultValue={data.last_name ?? ""}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={data.email ?? ""}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>

      <Link href={`/applicants/${id}`} className="mt-4 inline-block text-blue-600">
        Cancel
      </Link>
    </div>
  )
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `from "../../actions"` | Up two folders: `edit` → `[id]` → `applicants`, then `actions` |
| `defaultValue={data.first_name ?? ""}` | **Not** `value`. `defaultValue` = initial value, doesn't make it controlled. User can type. `?? ""` = use empty string if null |
| `<input type="hidden" name="id" value={data.id} />` | Invisible input. When form submits, `formData.get("id")` will have the id. We need it so the action knows which row to update |

---

## Phase 7: Delete

### Add to `app/(app)/applicants/actions.ts`:

```ts
export async function deleteApplicant(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) redirect("/applicants")

  const supabase = await createSupabaseServer()
  await supabase.from("applicants").delete().eq("id", id)

  revalidatePath("/applicants")
  redirect("/applicants")
}
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `.delete()` | Delete rows. Dangerous without `.eq()`! |
| `.eq("id", id)` | Only delete the row with this id |

---

### Add a Delete button in the list page

In `app/(app)/applicants/page.tsx`, add a form in each row:

```tsx
import { deleteApplicant } from "./actions"

// Inside the table row, add:
<td className="border p-2">
  <Link href={`/applicants/${a.id}`} className="text-blue-600 mr-2">View</Link>
  <form action={deleteApplicant} className="inline">
    <input type="hidden" name="id" value={a.id} />
    <button type="submit" className="text-red-600 hover:underline">
      Delete
    </button>
  </form>
</td>
```

**Every word explained:**

| Code | Meaning |
|------|---------|
| `form action={deleteApplicant}` | Submitting this form calls `deleteApplicant` |
| `className="inline"` | Form is inline so it sits next to the View link |
| `input type="hidden" name="id"` | Sends the id to the action without showing it |

---

## Cheat Sheet

| Piece | Needs first |
|-------|-------------|
| Root layout | Nothing |
| Supabase | .env.local |
| List page | Supabase + table |
| Add form | Server action + Supabase + table |
| View page | Supabase + table + `[id]` route |
| Edit page | View pattern + update action |
| Delete | Delete action + form with hidden id |

---

This project (rock-solid-system) is your reference. Use it alongside this guide.

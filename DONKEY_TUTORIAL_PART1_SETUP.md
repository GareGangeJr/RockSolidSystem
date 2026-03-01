# 🐴 PART 1: SETUP & LOGIN (For Complete Beginners)

**Everything explained like you're 5 years old. No jargon. Just simple English.**

---

## 📋 WHAT WE'RE BUILDING

**Rock Solid System** = Website for recruitment agency

**Your 5 modules:**
1. 🔐 **Login** - Security (must login to use)
2. 📊 **Dashboard** - Homepage overview
3. 👥 **Applicants** - People who want jobs
4. 📋 **Job Orders** - Companies that need workers
5. 📈 **Monitoring** - Track workers on the job
6. 👷 **Employees** - Hired workers

**The flow:**
```
Person applies → Applicant
Company needs worker → Job Order
Match applicant to job → Placement
Applicant becomes → Employee
Track their work → Monitoring
```

---

## 💻 STEP 1: OPEN TERMINAL

**What is Terminal?**
- Black/blue box where you type commands
- Tells computer what to do
- Like texting your computer

**How to open:**
1. Open VS Code
2. Press: `Ctrl + ~` (tilde key, next to 1)
3. Or: Menu → Terminal → New Terminal

**You'll see:**
```
PS C:\Users\YourName>
```

This means: "I'm ready for your command!"

---

## 📁 STEP 2: GO TO YOUR FOLDER

**Type this command:**
```bash
cd C:\capstone
```

**What it means:**
- `cd` = Change Directory (go to folder)
- Like double-clicking a folder

**Press Enter!**

**If folder doesn't exist, create it first:**
```bash
mkdir C:\capstone
cd C:\capstone
```

---

## 🏗️ STEP 3: CREATE PROJECT

**Type this ONE command:**
```bash
npx create-next-app@latest RockSolidSystem
```

**What it means:**
- `npx` = Run a tool
- `create-next-app` = Tool that makes Next.js projects
- `RockSolidSystem` = Your project name

**Press Enter and WAIT** (takes 1-2 minutes)

---

## ❓ STEP 4: ANSWER QUESTIONS

You'll see questions. **Use arrow keys** to select, then **press Enter**.

**Answer like this:**

```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes  
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like to use `src/` directory? › No
✔ Would you like to use App Router? › Yes
✔ Would you like to customize the default import alias? › No
```

**What each means (simple):**
- **TypeScript** = Safer JavaScript (catches typos)
- **ESLint** = Spell-checker for code
- **Tailwind CSS** = Easy styling system
- **src/ directory** = Different folder structure (we don't need)
- **App Router** = Modern way of Next.js (say yes!)
- **Import alias** = Shortcut for imports (default is fine)

**Just answer and wait!**

---

## 📂 STEP 5: ENTER PROJECT

**Type:**
```bash
cd RockSolidSystem
```

**Now you're inside your project!**

---

## ✅ STEP 6: TEST IT WORKS

**Type:**
```bash
npm run dev
```

**What happens:**
- Computer starts a server
- Your website runs at: `http://localhost:3000`

**You'll see:**
```
▲ Next.js 16.1.6
- Local:   http://localhost:3000
✓ Ready in 2.1s
```

**Open your browser:**
- Go to: `http://localhost:3000`
- You should see Next.js welcome page!

**🎉 IT WORKS!**

**To stop server:**
- Press: `Ctrl + C` in terminal

---

## 📁 STEP 7: UNDERSTAND YOUR FOLDERS

Your project looks like this:

```
RockSolidSystem/
├── app/                 ← Your pages
├── public/              ← Images
├── node_modules/        ← Libraries (DON'T TOUCH!)
├── package.json         ← Shopping list
└── .gitignore          ← Secret keeper
```

**What each folder means:**

### `app/` = Your Website
- Every file here = a page
- `app/page.tsx` = Homepage
- `app/about/page.tsx` = /about page

### `public/` = Public Files  
- Images, logos
- Anyone can download these

### `node_modules/` = Helper Tools
- 1000s of mini-programs
- **NEVER EDIT THIS!**
- Can delete and reinstall

### `package.json` = List of Tools
- Like a shopping list
- Lists what you installed

---

## 🗄️ STEP 8: SET UP DATABASE

**What is a database?**
- Like Excel on steroids
- Stores all your data
- Can search super fast

**We use Supabase:**
- Free online database
- Includes login system
- Easy to use

---

## 🌐 STEP 9: CREATE SUPABASE ACCOUNT

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New Project"**

**Fill in:**
- **Name:** `rock-solid-system`
- **Database Password:** Make up password (SAVE THIS!)
- **Region:** Choose closest to you
- Click **"Create new project"**

**WAIT 2-3 MINUTES** for it to set up.

---

## 📊 STEP 10: CREATE TABLES

**Tables** = Like sheets in Excel

We need 5 tables:
1. `applicants` - People who apply
2. `job_orders` - Job requests
3. `employees` - Hired workers
4. `monitoring` - Performance tracking
5. `placements` - Links applicants to jobs

**In Supabase:**

1. Click **SQL Editor** (left side)
2. Click **New Query**
3. **Copy ALL of this** and paste:

```sql
-- TABLE 1: APPLICANTS (People applying for jobs)
CREATE TABLE applicants (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  position_applied TEXT,
  contact_number TEXT,
  email TEXT,
  date_of_birth DATE,
  address TEXT,
  status TEXT DEFAULT 'New Applicant',
  applicant_type TEXT DEFAULT 'Domestic Helper',
  date_applied DATE
);

-- TABLE 2: JOB ORDERS (Job requests from companies)
CREATE TABLE job_orders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  company_name TEXT NOT NULL,
  position_needed TEXT NOT NULL,
  number_of_workers INTEGER,
  location TEXT,
  salary_range TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'Open',
  date_posted DATE,
  notes TEXT
);

-- TABLE 3: EMPLOYEES (Hired workers)
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  employee_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  position TEXT,
  department TEXT,
  contact_number TEXT,
  email TEXT,
  date_hired DATE,
  employment_status TEXT DEFAULT 'Active',
  basic_salary TEXT,
  notes TEXT
);

-- TABLE 4: MONITORING (Track deployed workers)
CREATE TABLE monitoring (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  applicant_id BIGINT REFERENCES applicants(id),
  job_order_id BIGINT REFERENCES job_orders(id),
  deployment_status TEXT,
  deployment_date DATE,
  location TEXT,
  supervisor_name TEXT,
  performance_notes TEXT
);

-- TABLE 5: PLACEMENTS (Links applicants to jobs)
CREATE TABLE placements (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  applicant_id BIGINT REFERENCES applicants(id),
  job_order_id BIGINT REFERENCES job_orders(id),
  match_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);
```

4. Click **RUN** (or press F5)
5. Should say: **"Success. No rows returned"**

**What just happened:**
- Created 5 tables
- Like creating 5 Excel sheets
- Empty tables, ready for data

---

## 🔑 STEP 11: GET YOUR KEYS

**Keys** = Passwords to access database

1. In Supabase, click **Settings** (gear icon, bottom left)
2. Click **API**
3. You'll see two important things:

**📝 COPY THESE:**

**Project URL:** (looks like `https://abc123.supabase.co`)

**anon public key:** (long random string)

**SAVE BOTH!** Open Notepad and paste them.

---

## 📦 STEP 12: INSTALL SUPABASE LIBRARIES

**Back in VS Code terminal:**

**Make sure server is STOPPED:**
- If it's running, press `Ctrl + C`

**Type this:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Press Enter and wait** (30 seconds)

**What this does:**
- Downloads Supabase tools
- Lets your code talk to database

---

## 🔐 STEP 13: CREATE SECRET FILE

**Secret file** = Stores passwords

**In VS Code:**
1. Click **New File** icon (or Ctrl+N)
2. Save as: `.env.local` (YES, starts with dot!)
3. Save in **project root** (same place as `app` folder)

**Type this in the file:**
```
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**REPLACE with YOUR values!**

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

**⚠️ IMPORTANT:**
- No spaces around `=`
- No quotes around values
- Must be EXACT match

**Save file** (Ctrl+S)

---

## 📁 STEP 14: CREATE LIBRARY FOLDER

**Library** = Helper files you use everywhere

**In terminal:**
```bash
mkdir lib
mkdir lib\supabase
```

**What this does:**
- Creates `lib` folder
- Creates `supabase` folder inside it

---

## 🔌 STEP 15: CREATE DATABASE CONNECTORS

**We need 3 files to connect to database.**

### File 1: Browser Client

**Create:** `lib/supabase/client.ts`

**In VS Code:**
1. Right-click `lib/supabase` folder
2. Click **New File**
3. Name: `client.ts`

**Type this code:**

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function supabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Let me explain EVERY LINE:**

**Line 1:**
```typescript
import { createBrowserClient } from "@supabase/ssr"
```
- `import` = Get a tool
- `{ createBrowserClient }` = Tool name
- `from "@supabase/ssr"` = From Supabase library
- **Like:** Getting hammer from toolbox

**Line 3:**
```typescript
export function supabase() {
```
- `export` = Share this function with other files
- `function supabase()` = Create function named "supabase"
- `()` = No inputs needed
- **Like:** Creating a recipe you can share

**Line 4:**
```typescript
  return createBrowserClient(
```
- `return` = Give back the result
- `createBrowserClient(` = Call Supabase function
- **Like:** Making the recipe and giving the food

**Line 5-6:**
```typescript
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```
- `process.env` = Get from `.env.local` file
- `.NEXT_PUBLIC_SUPABASE_URL` = Your database URL
- `!` = TypeScript: "Trust me, it exists"
- **Like:** Getting password from your wallet

**What this WHOLE file does:**
- Connects to Supabase database
- Uses your secret keys
- Returns connection you can use
- **Like:** Creating a phone line to database

**Save file!** (Ctrl+S)

---

### File 2: Server Client

**Create:** `lib/supabase/server.ts`

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**Explanation:**

**What are cookies?**
- Small text files in browser
- Remember if you're logged in
- Like a ticket stub

**Difference from client.ts:**
- `client.ts` = Runs in BROWSER (user's computer)
- `server.ts` = Runs on SERVER (your computer/hosting)

**When to use each:**
- Browser: Login page, buttons, forms
- Server: Fetching data for pages

**What this file does:**
- Server connection to Supabase
- Handles login cookies
- Remembers who's logged in

**Save file!**

---

### File 3: Browser Alternative

**Create:** `lib/supabase/browser.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Why another browser file?**
- Simpler name to use
- Used in login page
- Same as client.ts but different name

**Save file!**

---

## 🛡️ STEP 16: CREATE MIDDLEWARE (Security Guard)

**Middleware** = Security guard that checks everyone

**Think of it like:**
- Security at mall entrance
- Checks if you have ticket
- No ticket? → Go buy one
- Have ticket? → Come in!

**Create file:** `middleware.ts` (in ROOT folder, next to `app`)

```typescript
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: any) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const user = data.user

  const path = request.nextUrl.pathname

  const isPublicFile = /\.(.*)$/.test(path)
  if (isPublicFile) {
    return response
  }

  const isLoginPage = path.startsWith("/login")

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

**Explanation (important parts only):**

```typescript
export async function middleware(request: any) {
```
- `middleware` = Runs before EVERY page
- `request` = Information about page user wants

```typescript
const { data } = await supabase.auth.getUser()
const user = data.user
```
- Ask Supabase: "Who is logged in?"
- `user` = Person logged in (or null if nobody)

```typescript
if (!user && !isLoginPage) {
  return NextResponse.redirect(new URL("/login", request.url))
}
```
- If NO user AND NOT on login page
- **→ Redirect to login**
- **Like:** "You need a ticket! Go to ticket booth!"

```typescript
if (user && isLoginPage) {
  return NextResponse.redirect(new URL("/", request.url))
}
```
- If YES user AND on login page
- **→ Redirect to dashboard**
- **Like:** "You already have a ticket! Go inside!"

**What this WHOLE file does:**
- Checks every page request
- If not logged in → send to login
- If logged in → let them through
- Protects your entire website

**Save file!**

---

## 🔐 STEP 17: CREATE LOGIN PAGE

**Finally! The login page!**

**Create folder:**
```bash
mkdir app\login
```

**Create file:** `app/login/page.tsx`

```typescript
"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/browser"

export default function LoginPage() {
  const supabase = createSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) return alert("Login failed: " + error.message)

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Rock Solid System</h1>
        <p className="text-sm text-gray-500 text-center">
          Sign in to continue
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
```

**DETAILED Explanation:**

**Line 1:**
```typescript
"use client"
```
- **MUST BE FIRST LINE!**
- Means: Run in browser (client-side)
- Needed for: `useState`, `onClick`, interactive stuff
- **Without this:** Code won't work!

**Line 3:**
```typescript
import { useState } from "react"
```
- Get `useState` tool from React
- `useState` = Remember values that change
- **Like:** Having a memory box

**Line 8-10:**
```typescript
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [loading, setLoading] = useState(false)
```

**Let me explain `useState` SUPER CLEARLY:**

```typescript
const [email, setEmail] = useState("")
```

**This creates TWO things:**
1. `email` = The current value (starts as empty "")
2. `setEmail` = Function to change the value

**Think of it like a box:**
- `email` = What's inside the box
- `setEmail` = Open box, put new thing in

**Example flow:**
```
Start: email = ""
User types "j": setEmail("j") → email = "j"
User types "o": setEmail("jo") → email = "jo"
User types "h": setEmail("joh") → email = "joh"
User types "n": setEmail("john") → email = "john"
```

**Line 12:**
```typescript
async function handleLogin(e: React.FormEvent) {
```
- `async` = This function waits for things
- `handleLogin` = Function name
- Runs when form is submitted

**Line 13:**
```typescript
e.preventDefault()
```
- `e` = Event (form submission)
- `preventDefault()` = Don't refresh page
- **Without this:** Page refreshes, loses data

**Line 14:**
```typescript
setLoading(true)
```
- Change `loading` to `true`
- Shows "Logging in..." on button

**Line 16-19:**
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```
- Ask Supabase: "Can this person log in?"
- Send email and password
- `await` = Wait for answer (takes 1-2 seconds)
- `{ error }` = Get error message if failed

**Line 21:**
```typescript
setLoading(false)
```
- Change `loading` back to `false`
- Hides "Logging in..." message

**Line 23:**
```typescript
if (error) return alert("Login failed: " + error.message)
```
- If login failed, show error popup
- `alert()` = Show popup window

**Line 25:**
```typescript
window.location.href = "/"
```
- If login succeeded, go to homepage
- `window.location.href` = Change URL
- **Like:** Clicking a link

**THE HTML PART:**

```typescript
<input 
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Line by line:**
- `type="email"` = Email input (checks format)
- `value={email}` = Show current value
- `onChange=` = When user types, run function
- `e.target.value` = What user just typed
- `setEmail(...)` = Update the email box

**This is called "Controlled Input":**
```
React controls the input
React remembers the value
User types → React updates → Input shows new value
```

**Flow:**
```
1. Input shows: "" (empty)
2. User types "j"
3. onChange runs
4. setEmail("j")
5. email = "j"
6. Input shows: "j"
7. Repeat for each letter
```

**Save file!**

---

## 👤 STEP 18: CREATE TEST USER

**Before testing login, we need a user!**

1. Go to **Supabase Dashboard**
2. Click **Authentication** (shield icon on left)
3. Click **Users** tab
4. Click **Add User** button (green button)
5. Choose **Create new user**

**Fill in:**
- **Email:** `admin@rocksolid.com`
- **Password:** `admin123`
- Click **Create user**

**You now have a test account!**

---

## ✅ STEP 19: TEST LOGIN!

**In terminal:**
```bash
npm run dev
```

**Wait for:**
```
✓ Ready in 2.1s
```

**Open browser:**
```
http://localhost:3000
```

**What should happen:**
1. Automatically redirects to `/login`
2. You see login form
3. Enter:
   - Email: `admin@rocksolid.com`
   - Password: `admin123`
4. Click "Login"
5. Should redirect to `/` (we'll build dashboard next!)

**If you see 404 page:** That's NORMAL! Dashboard not built yet!

**If login worked and redirected:** ✅ **SUCCESS!**

---

## 🎉 CONGRATULATIONS!

**✅ You've completed Part 1!**

**What you have now:**
- ✅ Next.js project created
- ✅ Database set up (5 tables)
- ✅ Supabase connected
- ✅ Login system working
- ✅ Security guard (middleware) protecting pages

**📝 Next:** DONKEY_TUTORIAL_PART2_DASHBOARD.md

**Take a break! You earned it! 🎊**

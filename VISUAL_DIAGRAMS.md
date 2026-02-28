# 📊 VISUAL DIAGRAMS GUIDE

Use these diagrams to understand and explain your system visually.

---

## 🏗️ SYSTEM ARCHITECTURE

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│  (Chrome, Firefox, Safari, Edge - anywhere with internet)      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Dashboard │  │Applicants│  │Job Orders│  │Monitoring│     │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP Requests
                    (GET, POST)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION                        │
│                  (Hosted on Vercel/Server)                      │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │ Server Components│         │ Server Actions   │            │
│  │  - Fetch Data    │◄───────►│  - Add Data      │            │
│  │  - Render Pages  │         │  - Update Data   │            │
│  │  - SSR           │         │  - Delete Data   │            │
│  └──────────────────┘         └──────────────────┘            │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                      SQL Queries
                    (SELECT, INSERT,
                     UPDATE, DELETE)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                           │
│                  (Cloud PostgreSQL Database)                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ applicants  │  │ employees   │  │ job_orders  │           │
│  │   table     │  │   table     │  │   table     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ monitoring  │  │ placements  │  │   files     │           │
│  │   table     │  │   table     │  │  storage    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAM

### Reading Data (GET Request)

```
User Opens Page
     │
     ▼
┌──────────────────────────────────────────────┐
│ URL: /applicants                             │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Next.js finds: app/(app)/applicants/page.tsx│
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Component runs on SERVER                     │
│ 1. Connect to Supabase                       │
│ 2. Execute: SELECT * FROM applicants         │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Supabase returns data                        │
│ [{id: 1, name: "John"}, {id: 2, ...}]       │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Next.js renders HTML with data               │
│ <table>                                      │
│   <tr><td>John</td></tr>                     │
│ </table>                                     │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Browser displays page to user                │
└──────────────────────────────────────────────┘
```

---

### Writing Data (POST Request)

```
User Fills Form & Clicks Submit
     │
     ▼
┌──────────────────────────────────────────────┐
│ Form data sent to Server Action             │
│ addApplicant(formData)                       │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Server Action runs on SERVER                 │
│ 1. Connect to Supabase                       │
│ 2. Extract form values                       │
│ 3. Execute: INSERT INTO applicants           │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Supabase inserts data                        │
│ Returns: { id: 123, ...inserted data }      │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Server Action:                               │
│ 1. revalidatePath("/applicants")            │
│    (Clear cache, fetch new data)            │
│ 2. redirect("/applicants")                  │
│    (Send user back to list)                 │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Browser shows updated list                   │
│ (with newly added applicant)                 │
└──────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA

### Main Tables and Relationships

```
┌─────────────────┐
│   applicants    │
│─────────────────│
│ id (PK)         │
│ first_name      │
│ last_name       │
│ email           │
│ phone           │
│ position        │
│ status          │
│ ...             │
└────────┬────────┘
         │
         │ (becomes)
         │
         ▼
┌─────────────────┐
│   employees     │
│─────────────────│
│ id (PK)         │
│ applicant_id(FK)│
│ employee_number │
│ department      │
│ hire_date       │
│ ...             │
└────────┬────────┘
         │
         │ (matched to)
         │
         ▼
┌──────────────────────────────┐
│        placements            │
│──────────────────────────────│
│ id (PK)                      │
│ applicant_id (FK) ───────────┼─────┐
│ job_order_id (FK) ───────────┼──┐  │
│ match_date                   │  │  │
└──────────────────────────────┘  │  │
                                  │  │
         ┌────────────────────────┘  │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  job_orders     │         │   monitoring    │
│─────────────────│         │─────────────────│
│ id (PK)         │         │ id (PK)         │
│ company_name    │         │ applicant_id(FK)│
│ position_needed │         │ job_order_id(FK)│
│ requirements    │         │ location        │
│ salary          │         │ performance     │
│ status          │         │ notes           │
│ ...             │         │ ...             │
└─────────────────┘         └─────────────────┘

PK = Primary Key (unique identifier)
FK = Foreign Key (reference to another table)
```

---

## 📂 FILE STRUCTURE DIAGRAM

```
RockSolidSystem/
│
├── 📁 app/                          ROOT DIRECTORY
│   │
│   ├── 📁 (app)/                    MAIN APPLICATION (Protected)
│   │   │
│   │   ├── 📄 page.tsx              Dashboard (/)
│   │   ├── 📄 layout.tsx            Layout wrapper (sidebar, topbar)
│   │   │
│   │   ├── 📁 applicants/
│   │   │   ├── 📄 page.tsx          List (/applicants)
│   │   │   ├── 📄 actions.ts        Server functions
│   │   │   ├── 📁 add/
│   │   │   │   └── 📄 page.tsx      Add form (/applicants/add)
│   │   │   └── 📁 [id]/             Dynamic routes
│   │   │       ├── 📄 page.tsx      View (/applicants/123)
│   │   │       ├── 📁 edit/
│   │   │       │   └── 📄 page.tsx  Edit (/applicants/123/edit)
│   │   │       └── 📁 files/
│   │   │           └── 📄 page.tsx  Files (/applicants/123/files)
│   │   │
│   │   ├── 📁 employees/            (Same structure as applicants)
│   │   ├── 📁 job-orders/           (Same structure)
│   │   ├── 📁 monitoring/           (Same structure)
│   │   ├── 📁 attendance/
│   │   └── 📁 reports/
│   │
│   ├── 📁 login/                    LOGIN PAGE (Public)
│   │   └── 📄 page.tsx
│   │
│   ├── 📄 layout.tsx                Root layout
│   └── 📄 globals.css               Global styles
│
├── 📁 components/                   REUSABLE COMPONENTS
│   │
│   ├── 📁 layout/
│   │   ├── 📄 sidebar.tsx           Left navigation menu
│   │   ├── 📄 topbar.tsx            Top header
│   │   └── 📄 app-shell.tsx         Overall wrapper
│   │
│   ├── 📁 ui/                       BASIC UI ELEMENTS
│   │   ├── 📄 button.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 table.tsx
│   │   └── ...
│   │
│   └── 📄 ApplicantsListWithFilters.tsx   FEATURE COMPONENTS
│       📄 EmployeesListWithFilters.tsx
│       📄 StatusDropdown.tsx
│       📄 DeleteApplicantButton.tsx
│       ...
│
├── 📁 lib/                          HELPER FUNCTIONS
│   ├── 📁 supabase/
│   │   ├── 📄 client.ts             Browser connection
│   │   ├── 📄 server.ts             Server connection
│   │   └── 📄 browser.ts
│   ├── 📄 utils.ts                  Utility functions
│   └── 📄 status-options.ts         Dropdown options
│
├── 📁 public/                       STATIC FILES
│   ├── 🖼️ logo.svg
│   └── 🖼️ icons/
│
├── 📄 package.json                  DEPENDENCIES
├── 📄 tsconfig.json                 TYPESCRIPT CONFIG
├── 📄 next.config.ts                NEXT.JS CONFIG
├── 📄 .env.local                    ENVIRONMENT VARIABLES
│
└── 📄 README.md                     PROJECT INFO
```

---

## 🚦 COMPONENT HIERARCHY

### Applicants Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│                         Browser Window                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                      AppShell Layout                      │ │
│  │                                                            │ │
│  │  ┌──────────┐  ┌────────────────────────────────────┐   │ │
│  │  │          │  │         TopBar                      │   │ │
│  │  │          │  │  [Logo] [User] [Notifications]     │   │ │
│  │  │          │  └────────────────────────────────────┘   │ │
│  │  │          │                                            │ │
│  │  │ Sidebar  │  ┌────────────────────────────────────┐   │ │
│  │  │          │  │    ApplicantsPage (page.tsx)       │   │ │
│  │  │ • Home   │  │                                    │   │ │
│  │  │ • Appl.  │  │  ┌──────────────────────────────┐ │   │ │
│  │  │ • Empl.  │  │  │  Header                      │ │   │ │
│  │  │ • Jobs   │  │  │  "Applicants"  [Add Button]  │ │   │ │
│  │  │ • Monitor│  │  └──────────────────────────────┘ │   │ │
│  │  │ • Report │  │                                    │   │ │
│  │  │          │  │  ┌──────────────────────────────┐ │   │ │
│  │  │          │  │  │ ApplicantsListWithFilters    │ │   │ │
│  │  │          │  │  │                              │ │   │ │
│  │  │          │  │  │  [Search] [Type▼] [Status▼] │ │   │ │
│  │  │          │  │  │                              │ │   │ │
│  │  │          │  │  │  ┌────────────────────────┐ │ │   │ │
│  │  │          │  │  │  │  Table                 │ │ │   │ │
│  │  │          │  │  │  │                        │ │ │   │ │
│  │  │          │  │  │  │  ID │ Name │ Status   │ │ │   │ │
│  │  │          │  │  │  │  ---|------|--------- │ │ │   │ │
│  │  │          │  │  │  │  1  │ John │ Hired    │ │ │   │ │
│  │  │          │  │  │  │  2  │ Jane │ Pending  │ │ │   │ │
│  │  │          │  │  │  │                        │ │ │   │ │
│  │  │          │  │  │  └────────────────────────┘ │ │   │ │
│  │  │          │  │  └──────────────────────────────┘ │   │ │
│  │  │          │  └────────────────────────────────────┘   │ │
│  │  └──────────┘                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 STATE MANAGEMENT FLOW

### How React State Works

```
                USER TYPES IN SEARCH BOX
                          │
                          ▼
              ┌───────────────────────┐
              │  onChange Event Fires │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ setSearch("john")     │
              │ (Update State)        │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Component Re-renders  │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ useMemo Recalculates  │
              │ (Filter applicants)   │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Table Updates         │
              │ (Shows filtered list) │
              └───────────────────────┘
```

---

## 🎯 FEATURE: STATUS UPDATE FLOW

### Automatic Monitoring Creation

```
User Changes Status to "Deployed"
         │
         ▼
┌──────────────────────────────────┐
│ updateApplicantStatus() called   │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ UPDATE applicants                │
│ SET status = 'Deployed'          │
│ WHERE id = 123                   │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Check: Is applicant matched?     │
│ SELECT * FROM placements         │
│ WHERE applicant_id = 123         │
└──────────────────────────────────┘
         │
         ├─── Yes ───┐
         │           ▼
         │    ┌──────────────────────────────────┐
         │    │ Check: Monitoring record exists? │
         │    │ SELECT * FROM monitoring         │
         │    │ WHERE applicant_id = 123         │
         │    └──────────────────────────────────┘
         │           │
         │           ├─── No ────┐
         │           │           ▼
         │           │    ┌──────────────────────────┐
         │           │    │ CREATE monitoring record │
         │           │    │ INSERT INTO monitoring   │
         │           │    └──────────────────────────┘
         │           │           │
         │           │           ▼
         │           │    ┌──────────────────────────┐
         │           │    │ Success! Record created  │
         │           │    └──────────────────────────┘
         │           │
         │           └─── Yes ───┐
         │                       ▼
         │                ┌──────────────────────────┐
         │                │ UPDATE existing record   │
         │                └──────────────────────────┘
         │
         └─── No ────┐
                     ▼
              ┌──────────────────────────┐
              │ Return Error:            │
              │ "Must match to job first"│
              └──────────────────────────┘
```

---

## 🔐 AUTHENTICATION FLOW

```
User Visits /applicants
         │
         ▼
┌──────────────────────────────────┐
│ middleware.ts checks auth         │
└──────────────────────────────────┘
         │
         ├─── Logged In ────┐
         │                  ▼
         │           ┌────────────────┐
         │           │ Allow access   │
         │           │ Show page      │
         │           └────────────────┘
         │
         └─── Not Logged In ───┐
                               ▼
                        ┌──────────────────┐
                        │ Redirect to      │
                        │ /login           │
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ User logs in     │
                        │ (Supabase Auth)  │
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Create session   │
                        │ Set cookie       │
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Redirect back    │
                        │ to /applicants   │
                        └──────────────────┘
```

---

## 📊 RECRUITMENT WORKFLOW

### The Complete Journey

```
┌─────────────────┐
│   APPLICANT     │ ◄─── Person applies for job
│  (New Status)   │
└────────┬────────┘
         │
         │ Interview process
         ▼
┌─────────────────┐
│   APPLICANT     │
│ (Interview)     │
└────────┬────────┘
         │
         │ Evaluation
         ▼
┌─────────────────┐
│   APPLICANT     │ ◄─── Passed requirements
│ (For Deploy)    │
└────────┬────────┘
         │
         │ Match to job order
         ▼
┌─────────────────┐
│   PLACEMENT     │ ◄─── Link: Applicant ↔ Job Order
│    (Created)    │
└────────┬────────┘
         │
         │ Status changed to Deployed
         ▼
┌─────────────────┐
│   MONITORING    │ ◄─── Auto-created record
│  (Tracking)     │      Track performance
└────────┬────────┘
         │
         │ Contract ends
         ▼
┌─────────────────┐
│   APPLICANT     │
│  (Completed)    │
└─────────────────┘
```

---

## 🎨 TAILWIND CSS VISUAL GUIDE

### Common Classes and What They Do

```
┌─────────────────────────────────────────────────────┐
│  p-4                    Padding all sides           │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  │                                               │ │
│  │              Content Here                     │ │
│  │                                               │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  flex justify-between         Spread items apart    │
│  ┌───────────────────────────────────────────────┐ │
│  │  Left Item          Right Item                │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  bg-blue-500 text-white       Blue bg, white text  │
│  ┌───────────────────────────────────────────────┐ │
│  │░░░░░░░░░░░░  Button Text  ░░░░░░░░░░░░░░░░░░│ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  grid grid-cols-2 gap-4       2 columns with gap   │
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │   Column 1      │  │   Column 2      │         │
│  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 DEBUGGING FLOWCHART

```
                    Problem Occurs
                          │
                          ▼
            ┌──────────────────────────┐
            │ Check Browser Console    │
            │ (F12 → Console tab)      │
            └──────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
         ❌ Error              ✅ No Error
              │                       │
              ▼                       ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Read error msg  │   │ Check network tab│
    │ Google it       │   │ API failing?     │
    └─────────────────┘   └──────────────────┘
              │                       │
              ▼                       ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Check:          │   │ Check Supabase   │
    │ - Typos         │   │ connection       │
    │ - Imports       │   │ - .env.local     │
    │ - Syntax        │   │ - Table exists   │
    └─────────────────┘   └──────────────────┘
              │                       │
              └───────────┬───────────┘
                          ▼
                ┌──────────────────┐
                │ Still broken?    │
                │ Add console.log  │
                │ to trace data    │
                └──────────────────┘
```

---

## 📚 USE THESE IN PRESENTATION

### For Architecture:
- Show high-level diagram
- Explain 3 layers: Browser, Next.js, Supabase

### For Data Flow:
- Pick ONE feature (e.g., Add Applicant)
- Walk through step-by-step flow diagram

### For Database:
- Show main tables
- Explain relationships with arrows

### For Code:
- Show file structure
- Explain where things live

---

**Print these diagrams and use them during your presentation to make concepts crystal clear!**

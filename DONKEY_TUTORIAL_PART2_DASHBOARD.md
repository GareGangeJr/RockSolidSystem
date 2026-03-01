# 🐴 PART 2: DASHBOARD & LAYOUT (For Complete Beginners)

**Building the homepage and navigation menu**

---

## 📊 WHAT WE'RE BUILDING

**Dashboard** = Homepage after login
- Shows statistics (numbers)
- Navigation menu on left
- Clean and simple

**Layout** = Frame around all pages
- Sidebar (menu on left)
- Main content area
- Same on every page

---

## 📁 STEP 1: CREATE APP LAYOUT

**Layout** = Wrapper that appears on every page

**Think of it like:**
- Picture frame (layout)
- Picture (your page content)
- Frame stays same, picture changes

**Create file:** `app/(app)/layout.tsx`

**In terminal:**
```bash
mkdir "app\(app)"
```

**Then create:** `app/(app)/layout.tsx`

```typescript
import Link from "next/link"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6">Rock Solid</h2>
          
          <nav className="space-y-2">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded hover:bg-slate-100"
            >
              📊 Dashboard
            </Link>
            
            <Link 
              href="/applicants" 
              className="block px-3 py-2 rounded hover:bg-slate-100"
            >
              👥 Applicants
            </Link>
            
            <Link 
              href="/job-orders" 
              className="block px-3 py-2 rounded hover:bg-slate-100"
            >
              📋 Job Orders
            </Link>
            
            <Link 
              href="/monitoring" 
              className="block px-3 py-2 rounded hover:bg-slate-100"
            >
              📈 Monitoring
            </Link>
            
            <Link 
              href="/employees" 
              className="block px-3 py-2 rounded hover:bg-slate-100"
            >
              👷 Employees
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {children}
        </main>
        
      </div>
    </div>
  )
}
```

**EXPLANATION:**

**Line 1:**
```typescript
import Link from "next/link"
```
- Get `Link` component from Next.js
- `Link` = Better than `<a>` tags
- Faster navigation (doesn't refresh page)

**Line 3:**
```typescript
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
```
- `AppLayout` = Function name
- `{ children }` = Page content goes here
- `React.ReactNode` = TypeScript: any React element

**What is `children`?**
- Special prop in React
- Represents content inside component
- **Like:** Filling in a template

**Example:**
```typescript
<AppLayout>
  <h1>Dashboard</h1>  ← This is "children"
</AppLayout>
```

**Line 9-11:**
```typescript
<div className="min-h-screen bg-slate-50">
  <div className="flex">
```
- `min-h-screen` = Minimum height = full screen
- `bg-slate-50` = Light gray background
- `flex` = Flexbox layout (side by side)

**Line 13:**
```typescript
<aside className="w-64 bg-white border-r min-h-screen p-4">
```
- `aside` = Sidebar element
- `w-64` = Width 64 units (256px)
- `bg-white` = White background
- `border-r` = Border on right
- `min-h-screen` = Full height
- `p-4` = Padding on all sides

**Line 14:**
```typescript
<h2 className="text-xl font-bold mb-6">Rock Solid</h2>
```
- `h2` = Heading 2
- `text-xl` = Extra large text
- `font-bold` = Bold font
- `mb-6` = Margin bottom (space below)

**Line 16:**
```typescript
<nav className="space-y-2">
```
- `nav` = Navigation element
- `space-y-2` = Space between items (vertical)

**Line 17-21:**
```typescript
<Link 
  href="/" 
  className="block px-3 py-2 rounded hover:bg-slate-100"
>
  📊 Dashboard
</Link>
```
- `Link` = Next.js link (better than `<a>`)
- `href="/"` = Go to homepage
- `block` = Display as block (full width)
- `px-3 py-2` = Padding left/right and top/bottom
- `rounded` = Rounded corners
- `hover:bg-slate-100` = Gray background on hover

**Line 51:**
```typescript
<main className="flex-1">
  {children}
</main>
```
- `main` = Main content area
- `flex-1` = Take remaining space
- `{children}` = Page content appears here

**STRUCTURE:**
```
┌────────────────────────────────┐
│  Sidebar   │   Main Content    │
│            │                   │
│ Dashboard  │   {children}      │
│ Applicants │                   │
│ Job Orders │                   │
│ Monitoring │                   │
│ Employees  │                   │
└────────────────────────────────┘
```

**Save file!**

---

## 📊 STEP 2: CREATE DASHBOARD PAGE

**Dashboard** = Homepage with statistics

**Create file:** `app/(app)/page.tsx`

```typescript
export default function DashboardPage() {
  const stats = [
    { title: "Total Applicants", value: 120 },
    { title: "Active Job Orders", value: 8 },
    { title: "Deployed Workers", value: 45 },
    { title: "Active Employees", value: 67 },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-sm text-gray-500">
              {item.title}
            </div>
            <div className="text-2xl font-bold mt-2">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome to Rock Solid System</h2>
        <p className="text-gray-600">
          This is your recruitment management dashboard. Use the menu on the left to navigate:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• <strong>Applicants:</strong> Manage people applying for jobs</li>
          <li>• <strong>Job Orders:</strong> Track job requests from companies</li>
          <li>• <strong>Monitoring:</strong> Monitor deployed workers</li>
          <li>• <strong>Employees:</strong> Manage hired workers</li>
        </ul>
      </div>
    </div>
  )
}
```

**EXPLANATION:**

**Line 2-7:**
```typescript
const stats = [
  { title: "Total Applicants", value: 120 },
  { title: "Active Job Orders", value: 8 },
  // ...
]
```
- `const stats` = Variable that won't change
- `= [...]` = Array (list) of objects
- Each object has `title` and `value`

**What is an array?**
- List of items
- **Like:** Shopping list
- Can loop through it

**What is an object?**
- Collection of properties
- **Like:** Person with name, age, etc.
- Use curly braces `{ }`

**Line 13:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
```
- `grid` = CSS Grid layout
- `grid-cols-1` = 1 column on mobile
- `md:grid-cols-4` = 4 columns on medium+ screens
- `gap-4` = Space between items

**Responsive design:**
```
Mobile:          Desktop:
┌────────┐      ┌──┐┌──┐┌──┐┌──┐
│ Card 1 │      │ 1││ 2││ 3││ 4│
├────────┤      └──┘└──┘└──┘└──┘
│ Card 2 │
├────────┤
│ Card 3 │
├────────┤
│ Card 4 │
└────────┘
```

**Line 14:**
```typescript
{stats.map((item) => (
```
- `stats.map` = Loop through stats array
- For each item, create something
- `(item)` = Current item in loop

**What is `.map()`?**
- Loop function
- Creates new array
- **Like:** Taking each item and transforming it

**Example:**
```typescript
[1, 2, 3].map((num) => num * 2)
// Result: [2, 4, 6]
```

**Line 15-26:**
```typescript
<div
  key={item.title}
  className="bg-white p-6 rounded-lg shadow-sm border"
>
  <div className="text-sm text-gray-500">
    {item.title}
  </div>
  <div className="text-2xl font-bold mt-2">
    {item.value}
  </div>
</div>
```
- Creates card for each stat
- `key={item.title}` = Unique identifier (REQUIRED!)
- Shows title and value

**Why `key` is required:**
- React needs to track each item
- Helps React know what changed
- Must be unique

**Save file!**

---

## ✅ STEP 3: TEST DASHBOARD

**In terminal:**
```bash
npm run dev
```

**Open browser:**
```
http://localhost:3000
```

**What you should see:**
1. Login page appears
2. Login with:
   - Email: `admin@rocksolid.com`
   - Password: `admin123`
3. Redirects to dashboard
4. See sidebar on left
5. See 4 stat cards
6. See welcome message

**If you see the dashboard:** ✅ **SUCCESS!**

**Try clicking sidebar links:**
- Will show 404 pages (we haven't built them yet!)
- That's NORMAL!

---

## 🎉 CONGRATULATIONS!

**✅ You've completed Part 2!**

**What you have now:**
- ✅ Sidebar navigation menu
- ✅ Dashboard with statistics
- ✅ Layout that wraps all pages
- ✅ Responsive design (works on mobile)

**📝 Next:** DONKEY_TUTORIAL_PART3_APPLICANTS.md

**Take a break before continuing! 🎊**

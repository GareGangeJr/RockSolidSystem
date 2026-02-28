# 🔧 TROUBLESHOOTING & FAQ GUIDE

Common issues, solutions, and questions you might encounter.

---

## 🚨 COMMON ERRORS & SOLUTIONS

### 1. "Cannot read properties of undefined"

**Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'first_name')
```

**What it means:**
- Trying to access data that doesn't exist yet
- Data is null/undefined

**Solution:**
```tsx
// ❌ Bad - Will crash if data is null
<div>{applicant.first_name}</div>

// ✅ Good - Safe access
<div>{applicant?.first_name ?? "N/A"}</div>
```

**Explanation:**
- `?.` - Optional chaining (stops if null/undefined)
- `??` - Nullish coalescing (use default if null/undefined)

---

### 2. "Error: Supabase URL is required"

**Error Message:**
```
Error: supabaseUrl is required
```

**What it means:**
- Environment variables not set up

**Solution:**

1. Create `.env.local` file in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Get values from Supabase dashboard:
   - Go to Project Settings → API
   - Copy "URL" and "anon public" key

3. Restart dev server:
```bash
npm run dev
```

---

### 3. "Module not found: Can't resolve '@/...'"

**Error Message:**
```
Module not found: Can't resolve '@/lib/supabase/server'
```

**What it means:**
- TypeScript can't find the file
- Path alias issue

**Solution:**

1. Check `tsconfig.json` has paths configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Check file actually exists at that path

3. Restart TypeScript server in VS Code:
   - Ctrl+Shift+P → "TypeScript: Restart TS Server"

---

### 4. "This component must be a Client Component"

**Error Message:**
```
Error: useState() can only be used in Client Components
```

**What it means:**
- Using browser-only features in server component

**Solution:**

Add `"use client"` at the top of the file:
```tsx
"use client"

import { useState } from "react"

export default function Component() {
  const [value, setValue] = useState("")
  // ...
}
```

**When to use client components:**
- `useState`, `useEffect`, `useMemo`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)

---

### 5. "Error loading data from database"

**What it means:**
- Database query failed
- Connection issue
- Table doesn't exist

**Solution:**

1. Check Supabase connection:
```tsx
const supabase = await createSupabaseServer()
console.log("Connected:", supabase)
```

2. Check table exists in Supabase:
   - Go to Supabase → Table Editor
   - Verify table name matches code

3. Check query syntax:
```tsx
// Correct table name
const { data, error } = await supabase
  .from("applicants")  // ← Must match exactly
  .select("*")

if (error) {
  console.error("Database error:", error)
}
```

---

### 6. "Failed to fetch" or Network Error

**What it means:**
- Can't connect to Supabase
- Internet issue
- CORS problem

**Solution:**

1. Check internet connection
2. Verify Supabase is running (check status.supabase.com)
3. Check Supabase URL is correct in `.env.local`
4. Clear browser cache and reload

---

### 7. Form Submits But Nothing Happens

**Problem:**
- Click submit button
- Page doesn't redirect
- Data not saved

**Solution:**

1. Check server action is imported:
```tsx
import { addApplicant } from "../actions"
```

2. Check form has action prop:
```tsx
<form action={addApplicant}>
```

3. Check server action has redirect:
```tsx
export async function addApplicant(formData: FormData) {
  // ... save data
  revalidatePath("/applicants")
  redirect("/applicants")  // ← Must have this
}
```

4. Check browser console for errors

---

### 8. TypeScript Errors (Red Squiggly Lines)

**Problem:**
- Red underlines in code
- "Type 'X' is not assignable to type 'Y'"

**Solution:**

1. **Add proper types:**
```tsx
// ❌ TypeScript confused
const age = formData.get("age")

// ✅ Tell TypeScript the type
const age = Number(formData.get("age")) || null
```

2. **Use optional chaining:**
```tsx
// ❌ TypeScript warns about null
const name = applicant.first_name

// ✅ Handle null safely
const name = applicant?.first_name ?? ""
```

3. **Define interfaces:**
```tsx
interface Applicant {
  id: number
  first_name: string | null
  last_name: string | null
}
```

---

### 9. "Too Many Re-renders"

**Error Message:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**What it means:**
- Infinite loop in component

**Common causes and fixes:**

```tsx
// ❌ Bad - Infinite loop
function Component() {
  const [count, setCount] = useState(0)
  setCount(count + 1)  // ← Runs every render
  return <div>{count}</div>
}

// ✅ Good - Only on event
function Component() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

---

### 10. Data Not Updating After Save

**Problem:**
- Save data successfully
- Navigate back but see old data

**Solution:**

Use `revalidatePath` in server action:
```tsx
export async function updateApplicant(formData: FormData) {
  await supabase.from("applicants").update({...})
  
  revalidatePath("/applicants")      // ← Clear cache for list
  revalidatePath(`/applicants/${id}`) // ← Clear cache for detail
  
  redirect("/applicants")
}
```

---

## ❓ FREQUENTLY ASKED QUESTIONS

### General Questions

#### Q: What is this system for?
**A:** Rock Solid System is a recruitment management platform that helps agencies track applicants, manage employees, handle job orders, and monitor deployed workers.

#### Q: Who will use this system?
**A:** 
- HR staff (add/edit applicants)
- Recruiters (match workers to jobs)
- Managers (view reports, monitor performance)
- Admins (system configuration)

#### Q: What problem does it solve?
**A:** 
- Eliminates manual paper-based tracking
- Centralizes all recruitment data
- Automates workflows (e.g., deployed → monitoring)
- Provides real-time visibility
- Reduces errors and lost information

---

### Technical Questions

#### Q: Why did you choose Next.js?
**A:**
- **File-based routing** - Easy to organize pages
- **Server-side rendering** - Better performance and SEO
- **Full-stack** - Frontend + backend in one
- **Popular** - Large community, lots of resources
- **Production-ready** - Used by major companies

#### Q: Why Supabase instead of building custom backend?
**A:**
- **Faster development** - Don't need to build API from scratch
- **PostgreSQL** - Powerful, reliable, SQL database
- **Built-in auth** - User management included
- **Real-time** - Live updates capability
- **Free tier** - Good for development and small projects
- **Scalable** - Can grow with the business

#### Q: What is TypeScript and why use it?
**A:**
- **JavaScript + types** - Adds type checking to JavaScript
- **Catches errors early** - Before running the code
- **Better IDE support** - Auto-complete, hints
- **Self-documenting** - Types explain what data looks like
- **Easier maintenance** - Refactoring is safer

#### Q: How does authentication work?
**A:**
- Supabase handles user login
- Creates secure session cookie
- Middleware checks if user is logged in
- If not, redirects to login page
- After login, can access protected pages

#### Q: Is the data secure?
**A:**
- **HTTPS** - Encrypted connection
- **Row Level Security** - Database access rules
- **Server actions** - Sensitive code runs on server
- **Environment variables** - Secrets not in code
- **Authentication required** - Can't access without login

#### Q: Can it handle many users?
**A:**
- **Yes** - Supabase scales automatically
- Can handle thousands of concurrent users
- Database can be upgraded as needed
- Next.js optimizes performance
- CDN caching for static assets

---

### Feature Questions

#### Q: How does the automatic monitoring creation work?
**A:**
When an applicant's status changes to "Deployed":
1. System checks if they're matched to a job order
2. If yes, creates monitoring record automatically
3. If no, shows error: "Must match to job first"
4. Prevents manual mistakes

#### Q: Can you export data?
**A:**
Currently displays data on screen. Future features:
- Export to Excel/CSV
- Generate PDF reports
- Email reports automatically

#### Q: How do you handle file uploads?
**A:**
- Supabase Storage for files
- Each applicant can have multiple files
- Support for: resumes, IDs, contracts, photos
- Files are private, only authenticated users can access

#### Q: What reports are available?
**A:**
- Total applicants by status
- Deployed workers count
- Job orders by company
- Performance metrics
- Custom date ranges

#### Q: Can multiple people use it at once?
**A:**
- Yes, it's a web application
- Multiple users can work simultaneously
- Real-time updates (with Supabase real-time)
- No conflicts

---

### Development Questions

#### Q: How long did this take to build?
**A:**
Be honest about your timeline. Example:
- "About 3-4 weeks"
- "2 weeks planning, 2 weeks coding"

#### Q: What was the hardest part?
**A:**
Be honest. Examples:
- Understanding Next.js server vs client components
- Setting up database relationships
- Implementing the automatic monitoring feature
- Learning TypeScript

#### Q: What would you improve?
**A:**
Show you're thinking ahead:
- Add email notifications
- Mobile app version
- More detailed analytics
- Bulk import from Excel
- Document templates
- Calendar integration

#### Q: How do you test it?
**A:**
- Manual testing (click through features)
- Test with sample data
- Check error handling
- Verify database constraints
- Cross-browser testing

---

### Deployment Questions

#### Q: Where is it hosted?
**A:**
Options:
- **Vercel** (easiest for Next.js)
- **Netlify**
- **Custom server**

Currently in development/localhost.

#### Q: What does it cost to run?
**A:**
- **Development:** Free (Supabase free tier + localhost)
- **Production:** 
  - Vercel: Free for hobby projects
  - Supabase: Free up to certain limits
  - Paid plans start around $25/month

#### Q: How do you update it?
**A:**
1. Make code changes
2. Test locally
3. Commit to git
4. Push to GitHub
5. Vercel auto-deploys (if connected)

#### Q: What about backups?
**A:**
- Supabase does automatic backups
- Can export database manually
- Version control (Git) backs up code

---

### Comparison Questions

#### Q: How is this better than Excel?
**A:**
- **Multi-user** - Everyone sees same data
- **No version conflicts** - Single source of truth
- **Validation** - Prevents bad data entry
- **Relationships** - Link applicants to jobs
- **Search & filter** - Find data instantly
- **Automation** - No manual copying
- **File attachments** - Store documents
- **Security** - Access control

#### Q: Why not use existing HR software?
**A:**
- **Expensive** - Commercial software costs thousands
- **Generic** - Doesn't fit specific recruitment workflow
- **Custom features** - Built exactly for your needs
- **Learning project** - Demonstrates your skills
- **Flexible** - Can modify anytime

---

## 🛠️ DEVELOPMENT TIPS

### Best Practices

1. **Always check for errors:**
```tsx
const { data, error } = await supabase.from("table").select("*")
if (error) {
  console.error(error)
  return <div>Error: {error.message}</div>
}
```

2. **Use TypeScript interfaces:**
```tsx
interface Applicant {
  id: number
  first_name: string | null
}
```

3. **Handle null values:**
```tsx
applicant?.first_name ?? "Unknown"
```

4. **Use proper keys in lists:**
```tsx
{items.map(item => (
  <div key={item.id}>  {/* Use unique ID */}
    {item.name}
  </div>
))}
```

5. **Separate concerns:**
- Data fetching → Server components
- Interaction → Client components
- Database logic → Server actions

---

### Debugging Checklist

When something breaks:

- [ ] Check browser console (F12)
- [ ] Check terminal/server logs
- [ ] Add `console.log()` to trace data
- [ ] Verify environment variables
- [ ] Check Supabase connection
- [ ] Verify database table/column names
- [ ] Check file imports are correct
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Check network tab for API errors

---

### Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Install new package
npm install package-name

# Update all packages
npm update

# Clear cache and reinstall
rm -rf node_modules
npm install
```

---

## 📞 GETTING HELP

### Resources

1. **Official Docs:**
   - Next.js: https://nextjs.org/docs
   - React: https://react.dev
   - Supabase: https://supabase.com/docs
   - TypeScript: https://www.typescriptlang.org/docs

2. **Community:**
   - Stack Overflow (search your error)
   - Next.js Discord
   - Supabase Discord
   - Reddit r/nextjs

3. **AI Assistants:**
   - ChatGPT
   - Claude
   - GitHub Copilot

### How to Ask for Help

**Bad question:**
> "My code doesn't work. Help!"

**Good question:**
> "I'm getting a 'Cannot read properties of undefined' error when trying to display applicant names in my table component. Here's my code: [paste code]. The error appears on line 45. I've checked that the data exists in Supabase."

**Include:**
- Exact error message
- Relevant code
- What you've tried
- What you expected vs what happened

---

## 🎯 PRESENTATION TROUBLESHOOTING

### If Demo Fails

**Plan A: Quick Fix**
1. Check internet connection
2. Restart browser
3. Clear cache (Ctrl+Shift+Delete)
4. Try incognito mode

**Plan B: Fallback**
1. Show screenshots
2. Walk through code instead
3. Draw diagrams on board
4. Explain what should happen

**Plan C: Pivot**
1. Focus on code explanation
2. Discuss architecture
3. Show test data in Supabase
4. Answer questions

### If Stuck on Question

**Say:**
- "That's a great question. Let me think..."
- "I'm not 100% certain, but I believe..."
- "That's something I'd need to research more"
- "Can we come back to that after I check?"

**Don't:**
- Make up answers
- Say "I don't know" and stop
- Get defensive
- Panic

---

## ✅ PRE-PRESENTATION CHECKLIST

### Day Before

- [ ] Test full demo 3+ times
- [ ] Verify all features work
- [ ] Check Supabase is accessible
- [ ] Prepare backup screenshots
- [ ] Charge laptop fully
- [ ] Test projector connection
- [ ] Prepare printed reference cards
- [ ] Review this troubleshooting guide

### Morning Of

- [ ] Test internet connection
- [ ] Open all necessary tabs
- [ ] Clear browser history/cache
- [ ] Close unnecessary programs
- [ ] Disable notifications
- [ ] Have backup plan ready

### Right Before

- [ ] Deep breath
- [ ] You've got this!
- [ ] You know this system better than anyone

---

Remember: Technical difficulties happen to everyone. How you handle them matters more than the glitch itself. Stay calm, have backups, and focus on demonstrating your understanding.

**Good luck! 🚀**

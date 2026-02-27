# 🎯 Quick Start Guide - Monitoring Module

## ⚡ 2-Minute Setup

### Step 1️⃣: Create Database Table (2 minutes)

1. **Open Supabase**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Run SQL**
   - Click "SQL Editor" (left sidebar)
   - Click "New Query"
   - Open file: `database/monitoring-table.sql`
   - Copy all the SQL code
   - Paste in Supabase
   - Click "Run" (or press Ctrl+Enter)

3. **Verify**
   - Go to "Table Editor"
   - You should see a new table called "monitoring"
   - ✅ Done!

---

## 🧪 Test It (1 minute)

### Quick Test:

1. **Go to Job Orders page**
   - Create a job order or use existing one
   - Click the "Match" icon (👤+)
   - Match an applicant to this job order

2. **Go to Applicants page**
   - Find the applicant you matched
   - Change status dropdown to "Deployed"
   - Click OK on confirmation popup

3. **Go to Monitoring page**
   - 🎉 See your applicant listed there!

---

## 📊 What You Built

### Before:
```
Applicants Page
├── John Doe - Status: "Deployed"
└── (no connection to job orders or monitoring)
```

### After:
```
Applicants Page
├── John Doe - Status: "Deployed"
    ↓
    Automatically creates monitoring record
    ↓
Monitoring Page
└── John Doe → JO-5 (Housekeeper at ABC Company)
    └── Deployed: Jan 15, 2026
    └── Link to applicant details
    └── Link to job order details
```

---

## 🎨 Features

| Feature | Description |
|---------|-------------|
| **Auto-Tracking** | Status change to "Deployed" = Auto-added to monitoring |
| **Job Order Link** | Shows which job order the applicant was deployed to |
| **Priority View** | "With Concerns" shown first (in yellow/red) |
| **Summary Cards** | Quick counts at the top |
| **Validation** | Can't deploy without job order match |
| **Confirmation** | Asks "Are you sure?" before deploying |
| **Visual Alerts** | Color-coded status on applicant detail page |

---

## 📱 Pages You Can Use Now

### 1. Monitoring Page (`/monitoring`)
- See all deployed applicants
- Separate sections for concerns and success
- Summary cards with counts
- Links to related pages

### 2. Applicant Detail Page (`/applicants/[id]`)
- Shows deployment alert at top (if deployed)
- Displays job order information
- Quick link to monitoring page

### 3. Applicants List Page (`/applicants`)
- Status dropdown with confirmation
- Prevents deployment without job match

---

## 🔄 The Workflow

```
┌──────────────────────────────────────────────────────┐
│  1. Match Applicant to Job Order                     │
│     (Job Orders → Match → Add Applicant)             │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  2. Change Status to "Deployed"                      │
│     (Applicants → Status Dropdown → Deployed)        │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  3. System Creates Monitoring Record                 │
│     - Applicant ID                                   │
│     - Job Order ID (from placements)                 │
│     - Deployment Date                                │
│     - Status                                         │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  4. View in Monitoring Page                          │
│     (Monitoring → See all deployed applicants)       │
└──────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

Before you start using it:

- [ ] Run SQL in Supabase (`database/monitoring-table.sql`)
- [ ] Verify "monitoring" table exists in Supabase
- [ ] Test with one applicant

After setup:

- [ ] Match applicant to job order
- [ ] Deploy applicant
- [ ] Check monitoring page
- [ ] Verify details are correct

---

## 🎯 Pro Tips

### Tip 1: Always Match First
Before deploying an applicant, make sure they're matched to a job order. Otherwise, you'll get an error.

### Tip 2: Use the Detail Page
The applicant detail page shows their deployment status right at the top with a colored alert box.

### Tip 3: Monitor Concerns
Applicants with "Deployed(With Concerns)" status appear at the top of the monitoring page in yellow/red.

### Tip 4: Quick Navigation
The monitoring page has links directly to both the applicant and job order pages.

---

## 🐛 Troubleshooting

**Error: "Cannot deploy: Applicant is not matched to any job order"**
→ Solution: Match the applicant to a job order first

**Applicant not showing in monitoring**
→ Solution: Check that status is exactly "Deployed" or "Deployed(With Concerns)"

**SQL error when creating table**
→ Solution: Make sure you're in the correct Supabase project

**Page not loading**
→ Solution: Restart your dev server (`npm run dev`)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `MONITORING-COMPLETE.md` | Full feature documentation |
| `MONITORING-README.md` | Detailed setup instructions |
| `QUICK-START-MONITORING.md` | This file - Quick reference |
| `database/monitoring-table.sql` | Database schema |

---

## 🎉 You're Done!

Your monitoring module is ready to use. Just run the SQL in Supabase and start testing!

**Questions?** Check the other documentation files for more details.

---

## 📞 Need Help?

1. Check `MONITORING-README.md` for detailed instructions
2. Check `MONITORING-COMPLETE.md` for full documentation
3. Review the SQL file: `database/monitoring-table.sql`
4. Test with a sample applicant first

---

**Created:** February 27, 2026  
**Status:** ✅ Ready to use  
**Next Step:** Run the SQL in Supabase!

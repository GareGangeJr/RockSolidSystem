# Monitoring Module - Setup Instructions

## 🎯 What This Does

When you change an applicant's status to **"Deployed"** or **"Deployed(With Concerns)"**, they automatically appear on the **Monitoring page** with their job order information.

---

## 📋 Setup Steps

### 1. Create the Database Table

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `pdssnmagrijvivguqsal`
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy and paste the SQL from `database/monitoring-table.sql`
6. Click **"Run"** or press `Ctrl+Enter`
7. You should see: "Success. No rows returned"

### 2. Verify the Table

1. In Supabase, go to **"Table Editor"**
2. You should see a new table called **"monitoring"**
3. Click on it to see the columns

---

## 🚀 How to Use

### Step 1: Match an Applicant to a Job Order
1. Go to **Job Orders** page
2. Click the "Match Applicants" icon (👤+) on any job order
3. Match an applicant to that job order

### Step 2: Change Status to Deployed
1. Go to **Applicants** page
2. Find the applicant you matched
3. Change their status to **"Deployed"** or **"Deployed(With Concerns)"**
4. A confirmation popup will appear
5. Click **OK**

### Step 3: View in Monitoring
1. Go to **Monitoring** page
2. You'll see the applicant listed with:
   - Their name and contact info
   - The job order they're matched to
   - Company and country
   - Deployment date
   - Any concerns (if applicable)

---

## 🔍 What Happens Behind the Scenes

```
User changes status to "Deployed" ⬇️
System checks if applicant is matched to a job order ⬇️
If YES: Creates monitoring record ⬇️
If NO: Shows error "Please match to job order first" ⬇️
Monitoring page displays the record
```

---

## 📊 Features

### Monitoring Page Shows:
- ⚠️ **Deployed with Concerns** (priority section at top)
- ✅ **Successfully Deployed**
- 📈 **Summary cards** with counts
- 🔗 **Quick links** to applicant and job order details

### Safety Features:
- ✅ Prevents deployment if not matched to job order
- ✅ Shows confirmation before deploying
- ✅ No duplicate monitoring records
- ✅ Updates existing records if status changes again

---

## 🧪 Testing

1. **Create a test applicant**
   - Go to Applicants → Add Applicant
   - Fill in basic info

2. **Create a test job order**
   - Go to Job Orders → Add Job Order
   - Fill in basic info

3. **Match them together**
   - Go to Job Orders → Click "Match" icon
   - Add the applicant to the job order

4. **Deploy the applicant**
   - Go to Applicants
   - Change status to "Deployed"
   - Confirm the popup

5. **Check monitoring**
   - Go to Monitoring page
   - See the applicant listed there!

---

## 🐛 Troubleshooting

### Error: "Cannot deploy: Applicant is not matched to any job order"
**Solution:** Match the applicant to a job order first (Job Orders → Match Applicants)

### Applicant doesn't appear in Monitoring
**Solution:** 
1. Check if status is exactly "Deployed" or "Deployed(With Concerns)"
2. Verify the database table was created successfully
3. Refresh the Monitoring page

### Database error when creating table
**Solution:**
1. Make sure you're connected to the right Supabase project
2. Check that tables `applicants`, `job_orders`, and `placements` exist
3. Run the SQL again

---

## 📁 Files Created/Modified

### New Files:
- `database/monitoring-table.sql` - Database schema
- `app/(app)/monitoring/actions.ts` - Monitoring server actions
- `MONITORING-README.md` - This file

### Modified Files:
- `app/(app)/monitoring/page.tsx` - Full monitoring UI
- `app/(app)/applicants/actions.ts` - Added auto-create monitoring logic
- `components/StatusDropdown.tsx` - Added confirmation and better error handling

---

## 🎨 Future Enhancements (Optional)

- Add ability to edit concerns directly from monitoring page
- Add notes/comments for each monitoring record
- Send email notifications for concerns
- Export monitoring reports
- Filter by date range, company, or country
- Add check-in reminder system

---

## ✅ Checklist

- [ ] Run SQL in Supabase to create monitoring table
- [ ] Verify table exists in Supabase Table Editor
- [ ] Test with a sample applicant and job order
- [ ] Confirm monitoring page displays correctly
- [ ] Test both "Deployed" and "Deployed(With Concerns)" statuses

---

Need help? Check the files or reach out!

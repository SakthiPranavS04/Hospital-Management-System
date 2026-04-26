# Hospital Management System - FINAL DEPLOYMENT GUIDE (TODAY)

**⚠️ DEADLINE: This afternoon - Deploy as fully functional**

---

## STEP 1: Fix Supabase Security (RLS) - 5 minutes

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (udvemtlacfdjxielmdua)
3. Click **SQL Editor** → **New Query**
4. Copy and paste the contents of `hospital-backend/rls-security-fix.sql`
5. Click **Run** to execute

**This fixes:** The 3 security warnings (department, admission, bill)

---

## STEP 2: Configure Environment Variables - 5 minutes

### For Backend (Vercel)

Get your Supabase credentials:
1. Go to Supabase Dashboard → Project Settings → Database
2. Copy the **Connection String** (Standard connection)
3. Ensure you have: `postgresql://user:password@db.xxxxx.supabase.co:5432/postgres`

In Vercel:
1. Go to your Vercel dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add these variables:
   - **Key:** `DATABASE_URL` 
   - **Value:** Your Supabase connection string (paste the full string)
   - **Key:** `NODE_ENV` 
   - **Value:** `production`

### For Frontend (Vercel)

1. Go to your Vercel frontend project
2. Settings → Environment Variables
3. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-vercel-url.vercel.app` (your backend API domain)

---

## STEP 3: Update Backend CORS Configuration - 2 minutes

Edit `hospital-backend/server.js` line 11-13:

**BEFORE:**
```javascript
app.use(cors({
  origin: "https://hospital-management-system-jp3t-8n74mgf5h.vercel.app",
  credentials: true
}));
```

**AFTER:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://hospital-management-system-jp3t-8n74mgf5h.vercel.app",
  credentials: true
}));
```

Also add to Vercel environment variables:
- **Key:** `FRONTEND_URL`
- **Value:** Your Vercel frontend URL

---

## STEP 4: Test Locally - 10 minutes

### Terminal 1 - Backend
```bash
cd hospital-backend
npm install
npm start
```
Should show: `✅ Connected to PostgreSQL (Supabase)`

### Terminal 2 - Frontend
```bash
npm install
npm run dev
```
Should show: `Local: http://localhost:5173/`

**Test in browser:**
- Open http://localhost:5173/
- Check console for no CORS errors
- Try creating a patient/appointment
- Check if data appears

---

## STEP 5: Deploy Backend to Vercel - 5 minutes

Option A: Using Vercel CLI
```bash
cd hospital-backend
npm install -g vercel
vercel --prod
```

Option B: Using Git
1. Push backend code to GitHub
2. In Vercel dashboard, import the repo
3. Set root directory to `hospital-backend`
4. Add environment variables
5. Deploy

---

## STEP 6: Deploy Frontend to Vercel - 5 minutes

```bash
cd .. (back to root)
npm run build
vercel --prod
```

Or through Vercel dashboard if already connected to GitHub

---

## STEP 7: Verify Deployment - 5 minutes

1. Open your frontend Vercel URL
2. Check browser console for errors
3. Try to:
   - View patients
   - Create a new patient
   - Create an appointment
   - View rooms
4. Check network tab to ensure API calls reach backend

**If issues:**
- Check Vercel logs (Deployments → View Build Logs)
- Check console errors (F12 → Console)
- Verify environment variables are set correctly

---

## TROUBLESHOOTING

### "API connection error"
- ❌ VITE_API_URL is wrong
- ✅ Fix: Update in Vercel → Environment Variables
- ✅ Re-deploy frontend

### "Database connection error"
- ❌ DATABASE_URL is wrong or missing
- ✅ Fix: Copy exact connection string from Supabase
- ✅ Verify SSL is enabled (includes "sslmode=require")

### "CORS error"
- ❌ Frontend URL not in CORS whitelist
- ✅ Fix: Update FRONTEND_URL in backend env vars
- ✅ Update origin in server.js
- ✅ Re-deploy backend

### "Tables don't exist"
- ❌ Schema not imported to Supabase
- ✅ Fix: Run schema.sql in Supabase SQL Editor

---

## QUICK CHECKLIST

- [ ] RLS security script run in Supabase
- [ ] DATABASE_URL added to Vercel backend
- [ ] VITE_API_URL added to Vercel frontend
- [ ] FRONTEND_URL added to Vercel backend
- [ ] Backend CORS updated
- [ ] Local test successful
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Both URLs accessible
- [ ] Can create/view patients
- [ ] Can create/view appointments
- [ ] No console errors

---

## Final URLs After Deployment

- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://your-backend.vercel.app`
- **Supabase:** `https://dashboard.supabase.com`

---

**STATUS: Ready for deployment!** ✅

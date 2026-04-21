# Data Verification Guide - Hospital Management System

## Overview
This guide helps you verify that CREATE, READ, UPDATE, and DELETE (CRUD) operations work correctly between the React frontend, Express backend, and MySQL database.

---

## Method 1: Verify Using Browser DevTools

### 1.1 Monitor Network Requests
1. **Open DevTools**: Press `F12` in your browser
2. **Go to Network tab**
3. **Perform action** (add patient, delete appointment, etc.)
4. **Check requests**:
   - Look for API calls to `http://localhost:3001/...`
   - Click the request and check **Response** tab
   - Verify status code is `200` (success) or `201` (created)
   - Check the JSON response for success messages

**Example Response for POST (Create)**:
```json
{
  "success": true,
  "id": 15
}
```

### 1.2 Monitor Console for Errors
1. **Go to Console tab** in DevTools
2. **Perform any operation**
3. **Look for red error messages** - they indicate API failures
4. **Successful operations show no errors**

---

## Method 2: Verify Using MySQL Workbench

### 2.1 Direct Database Inspection

**Before performing any operation:**
1. Open MySQL Workbench
2. Connect to your database: `hospital_db`
3. **Run this query to count records**:
   ```sql
   SELECT COUNT(*) as total FROM patient;
   SELECT COUNT(*) as total FROM appointment;
   SELECT COUNT(*) as total FROM admission;
   ```
   Note the numbers.

**After performing operation:**
1. Run the same query again
2. **Number increased?** → Data was added ✅
3. **Number decreased?** → Data was deleted ✅
4. **Same number?** → Operation failed or wasn't sent to DB ❌

### 2.2 View Specific Records
```sql
-- See ALL patients (newest first)
SELECT * FROM patient ORDER BY registered_at DESC LIMIT 10;

-- See ALL appointments
SELECT * FROM appointment ORDER BY appointment_date DESC LIMIT 10;

-- See specific patient by ID
SELECT * FROM patient WHERE patient_id = 5;

-- See patient appointments
SELECT a.*, p.first_name, p.last_name 
FROM appointment a
JOIN patient p ON a.patient_id = p.patient_id
ORDER BY a.appointment_date DESC;
```

---

## Method 3: Verify Using API Testing Tool (Postman/REST Client)

### 3.1 Test GET (Retrieve Data)
```
GET http://localhost:3001/patients
GET http://localhost:3001/appointments
GET http://localhost:3001/admissions
```

### 3.2 Test POST (Create Data)
```
POST http://localhost:3001/patients
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15",
  "gender": "M",
  "blood_type": "O+",
  "contact": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St"
}
```

**Check Response**:
- Should get `"success": true` with new `id`
- Verify in MySQL that record exists

### 3.3 Test UPDATE (Modify Data)
```
PUT http://localhost:3001/patients/5
Content-Type: application/json

{
  "first_name": "Jane",
  "contact": "9876543211"
}
```

---

## Method 4: Add Console Logging to Your Code

### 4.1 Add Logging to API Calls
Edit [src/data/api.js](src/data/api.js) to add logging:

```javascript
export const createPatient = async (patientData) => {
  console.log("📤 Sending patient data:", patientData);
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  const data = await res.json();
  console.log("📥 Response from server:", data);
  return data;
};
```

### 4.2 Add Logging to Components
```javascript
// In your component
const handleAddPatient = async (patientData) => {
  console.log("🟢 User clicked Add Patient");
  const result = await createPatient(patientData);
  if (result.success) {
    console.log("✅ Patient added with ID:", result.id);
    // Refresh data
    fetchPatients();
  } else {
    console.log("❌ Error adding patient:", result.error);
  }
};
```

---

## Method 5: Complete Testing Checklist

### Test CREATE Operation
- [ ] Fill form in website and submit
- [ ] Check Network tab → see POST request with status 200
- [ ] Check Console → see success message
- [ ] Check MySQL → see new record in table
- [ ] Check website → new entry appears in list

### Test READ Operation
- [ ] Navigate to any page (Patients, Appointments, etc.)
- [ ] Check Network tab → see GET request with status 200
- [ ] Check Console → see data array logged
- [ ] Verify records display on website
- [ ] Compare with MySQL query results

### Test UPDATE Operation
- [ ] Edit any record in website
- [ ] Check Network tab → see PUT/PATCH request with status 200
- [ ] Check MySQL → use SELECT query to verify changed field
- [ ] Check website → verify updated value displays

### Test DELETE Operation
- [ ] Delete any record in website
- [ ] Check Network tab → see DELETE request with status 200
- [ ] Check MySQL → run COUNT(*) query before/after
- [ ] Check website → record removed from list

---

## Method 6: Real-Time Sync (Auto-Refresh)

### 6.1 Add Auto-Refresh After Operations
```javascript
const handleAddPatient = async (patientData) => {
  const result = await createPatient(patientData);
  if (result.success) {
    // Automatically refresh the patient list
    await fetchPatients();
    // Show success message
    alert("Patient added successfully!");
  }
};

const handleDeletePatient = async (patientId) => {
  const result = await deletePatient(patientId);
  if (result.success) {
    // Refresh the list
    await fetchPatients();
    alert("Patient deleted successfully!");
  }
};
```

### 6.2 Add Refresh Button
Add this to your page:
```javascript
<button onClick={() => fetchPatients()}>
  🔄 Refresh Data
</button>
```

---

## Method 7: Database Change Verification Script

### Use this SQL script to track changes:
```sql
-- Before any operation, save current state
CREATE TEMPORARY TABLE patient_before AS SELECT * FROM patient;

-- [Perform your operations in the website]

-- After operations, compare:
SELECT 
  'ADDED' as action,
  p.* 
FROM patient p
LEFT JOIN patient_before pb ON p.patient_id = pb.patient_id
WHERE pb.patient_id IS NULL;

SELECT 
  'DELETED' as action,
  pb.*
FROM patient_before pb
LEFT JOIN patient p ON pb.patient_id = p.patient_id
WHERE p.patient_id IS NULL;

SELECT 
  'UPDATED' as action,
  pb.patient_id,
  CONCAT(pb.first_name, ' → ', p.first_name) as changes
FROM patient_before pb
JOIN patient p ON pb.patient_id = p.patient_id
WHERE pb.first_name != p.first_name 
  OR pb.contact_number != p.contact_number;
```

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Website doesn't show new data | Click Refresh button or refresh page (F5) |
| API returns error 500 | Check MySQL connection in server.js |
| Network shows 0 requests | Backend might not be running (npm start in hospital-backend) |
| Data appears on website but not in DB | Check API response - might be storing in memory only |
| DB has data but website is empty | Check if API endpoint exists in server.js |
| CORS errors in console | Ensure CORS is enabled in server.js |

---

## Essential Commands

### Start Backend Server
```bash
cd hospital-backend
npm install
npm start
```

### Monitor MySQL
```bash
# Login to MySQL
mysql -u root -p
USE hospital_db;

# Quick checks
SELECT COUNT(*) FROM patient;
SELECT COUNT(*) FROM appointment;
SELECT * FROM patient ORDER BY registered_at DESC LIMIT 5;
```

### Check Server Logs
Look at terminal where you ran `npm start` - errors will show there.

---

## Complete Verification Workflow

1. **Start backend** → `npm start` in hospital-backend folder
2. **Open DevTools** → Press F12
3. **Open MySQL Workbench** → Connect to hospital_db
4. **Perform operation** → Add/edit/delete in website
5. **Check all 3 places**:
   - ✅ DevTools Network tab shows success response
   - ✅ DevTools Console shows data logged
   - ✅ MySQL shows record added/changed/deleted
   - ✅ Website displays updated data
6. **If anything missing** → Check that step first

---

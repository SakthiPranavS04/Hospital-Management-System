# Missing Backend Endpoints - UPDATE & DELETE

Your backend currently has GET (read) and POST (create) endpoints, but is **missing UPDATE and DELETE endpoints**. This prevents you from fully testing data sync.

---

## Missing Endpoints Summary

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| Get all patients | GET | `/patients` | ✅ Exists |
| Create patient | POST | `/patients` | ✅ Exists |
| Update patient | PUT | `/patients/:id` | ❌ **MISSING** |
| Delete patient | DELETE | `/patients/:id` | ❌ **MISSING** |
| Get all appointments | GET | `/appointments` | ✅ Exists |
| Create appointment | POST | `/appointments` | ✅ Exists |
| Update appointment | PUT | `/appointments/:id` | ❌ **MISSING** |
| Delete appointment | DELETE | `/appointments/:id` | ❌ **MISSING** |

**And same for**: Admissions, Out-Patient Visits, Billing, Rooms

---

## Quick Fix - Add These Endpoints

Add the following code to [hospital-backend/server.js](hospital-backend/server.js) **before the `app.listen(3001)` line**:

```javascript
// ============ UPDATE ENDPOINTS ============

// UPDATE Patient
app.put("/patients/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, gender, blood_type, contact, email, address } = req.body;
  
  db.query(
    "UPDATE patient SET first_name=?, last_name=?, date_of_birth=?, gender=?, blood_group=?, contact_number=?, email=?, address=? WHERE patient_id=?",
    [first_name, last_name, date_of_birth, gender, blood_type, contact, email, address, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Patient updated" });
    }
  );
});

// UPDATE Appointment
app.put("/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = req.body;
  
  db.query(
    "UPDATE appointment SET patient_id=?, doctor_id=?, appointment_date=?, appointment_time=?, reason=?, status=? WHERE appointment_id=?",
    [patient_id, doctor_id, appointment_date, appointment_time, reason, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Appointment updated" });
    }
  );
});

// UPDATE Admission
app.put("/admissions/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status } = req.body;
  
  db.query(
    "UPDATE admission SET patient_id=?, doctor_id=?, room_id=?, admission_date=?, discharge_date=?, reason=?, diagnosis=?, status=? WHERE admission_id=?",
    [patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Admission updated" });
    }
  );
});

// UPDATE Out-Patient Visit
app.put("/outpatients/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date } = req.body;
  
  db.query(
    "UPDATE outpatientvisit SET patient_id=?, doctor_id=?, visit_date=?, chief_complaint=?, diagnosis=?, treatment_plan=?, follow_up_date=? WHERE visit_id=?",
    [patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Out-patient visit updated" });
    }
  );
});

// UPDATE Billing
app.put("/billing/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, total, bill_date, status, payment_method } = req.body;
  
  db.query(
    "UPDATE bill SET patient_id=?, total_amount=?, bill_date=?, payment_status=?, payment_method=? WHERE bill_id=?",
    [patient_id, total, bill_date, status, payment_method, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Bill updated" });
    }
  );
});

// UPDATE Room
app.put("/rooms/:id", (req, res) => {
  const { id } = req.params;
  const { room_number, floor, room_type, department_id, is_available } = req.body;
  
  db.query(
    "UPDATE room SET room_number=?, floor=?, room_type=?, department_id=?, is_available=? WHERE room_id=?",
    [room_number, floor, room_type, department_id, is_available, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Room updated" });
    }
  );
});

// ============ DELETE ENDPOINTS ============

// DELETE Patient
app.delete("/patients/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM patient WHERE patient_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json({ success: true, message: "Patient deleted" });
    }
  );
});

// DELETE Appointment
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM appointment WHERE appointment_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json({ success: true, message: "Appointment deleted" });
    }
  );
});

// DELETE Admission
app.delete("/admissions/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM admission WHERE admission_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Admission not found" });
      }
      res.json({ success: true, message: "Admission deleted" });
    }
  );
});

// DELETE Out-Patient Visit
app.delete("/outpatients/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM outpatientvisit WHERE visit_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Out-patient visit not found" });
      }
      res.json({ success: true, message: "Out-patient visit deleted" });
    }
  );
});

// DELETE Billing
app.delete("/billing/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM bill WHERE bill_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json({ success: true, message: "Bill deleted" });
    }
  );
});

// DELETE Room
app.delete("/rooms/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM room WHERE room_id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json({ success: true, message: "Room deleted" });
    }
  );
});
```

---

## Also Add API Functions to Frontend

Add these functions to [src/data/api.js](src/data/api.js):

```javascript
// ============ UPDATE FUNCTIONS ============

export const updatePatient = async (id, patientData) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  return res.json();
};

export const updateAppointment = async (id, appointmentData) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData)
  });
  return res.json();
};

export const updateAdmission = async (id, admissionData) => {
  const res = await fetch(`${BASE_URL}/admissions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admissionData)
  });
  return res.json();
};

export const updateOutPatientVisit = async (id, visitData) => {
  const res = await fetch(`${BASE_URL}/outpatients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData)
  });
  return res.json();
};

export const updateBill = async (id, billData) => {
  const res = await fetch(`${BASE_URL}/billing/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(billData)
  });
  return res.json();
};

export const updateRoom = async (id, roomData) => {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData)
  });
  return res.json();
};

// ============ DELETE FUNCTIONS ============

export const deletePatient = async (id) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const deleteAppointment = async (id) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const deleteAdmission = async (id) => {
  const res = await fetch(`${BASE_URL}/admissions/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const deleteOutPatientVisit = async (id) => {
  const res = await fetch(`${BASE_URL}/outpatients/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const deleteBill = async (id) => {
  const res = await fetch(`${BASE_URL}/billing/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const deleteRoom = async (id) => {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};
```

---

## After Adding These Endpoints

1. **Restart your backend server**:
   ```bash
   cd hospital-backend
   npm start
   ```

2. **Now you can fully test all operations**:
   - ✅ CREATE (POST) - Add new records
   - ✅ READ (GET) - View records
   - ✅ UPDATE (PUT) - Edit records
   - ✅ DELETE (DELETE) - Remove records

3. **Use the verification methods** from [DATA_VERIFICATION_GUIDE.md](DATA_VERIFICATION_GUIDE.md) to verify each operation!

---

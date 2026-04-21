import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sakthi@2004",
  database: "hospital_db"
});

db.connect(err => {
  if (err) {
    console.log("DB Connection Failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/patients", (req, res) => {
  db.query("SELECT patient_id, first_name, last_name, date_of_birth, gender, blood_group, contact_number, email, address, registered_at FROM patient", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/patients", (req, res) => {
  console.log('📝 POST /patients received - Body:', req.body);
  const { first_name, last_name, date_of_birth, gender, blood_type, contact, email, address } = req.body;
  
  if (!first_name || !last_name) {
    console.log('❌ Missing required fields: first_name or last_name');
    return res.status(400).json({ error: "first_name and last_name are required" });
  }
  
  console.log('🔄 Inserting patient:', { first_name, last_name, date_of_birth, gender, blood_type, contact, email, address });
  
  db.query(
    "INSERT INTO patient (first_name, last_name, date_of_birth, gender, blood_group, contact_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [first_name, last_name, date_of_birth, gender, blood_type, contact, email, address],
    (err, result) => {
      if (err) {
        console.log('❌ Database error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ Patient created successfully with ID:', result.insertId);
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get("/appointments", (req, res) => {
  db.query("SELECT appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status FROM appointment", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/appointments", (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = req.body;
  db.query(
    "INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)",
    [patient_id, doctor_id, appointment_date, appointment_time, reason, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get("/admissions", (req, res) => {
  db.query("SELECT admission_id, patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status FROM admission", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/admissions", (req, res) => {
  const { patient_id, doctor_id, room_id, reason, admission_date, status } = req.body;
  db.query(
    "INSERT INTO admission (patient_id, doctor_id, room_id, reason, admission_date, status) VALUES (?, ?, ?, ?, ?, ?)",
    [patient_id, doctor_id, room_id, reason, admission_date, status || 'Active'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      // Mark room as unavailable
      db.query(
        "UPDATE room SET is_available = FALSE WHERE room_id = ?",
        [room_id],
        (updateErr) => {
          if (updateErr) console.error('Room update error:', updateErr);
        }
      );
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get("/outpatients", (req, res) => {
  db.query("SELECT visit_id, patient_id, doctor_id, appointment_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date FROM outpatientvisit", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/outpatients", (req, res) => {
  const { patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date } = req.body;
  db.query(
    "INSERT INTO outpatientvisit (patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get("/billing", (req, res) => {
  db.query("SELECT bill_id, patient_id, admission_id, visit_id, bill_date, total_amount, paid_amount, payment_status, payment_method FROM bill", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/billing", (req, res) => {
  const { patient_id, total, bill_date, status, payment_method } = req.body;
  db.query(
    "INSERT INTO bill (patient_id, total_amount, bill_date, payment_status, payment_method) VALUES (?, ?, ?, ?, ?)",
    [patient_id, total, bill_date, status || 'Pending', payment_method],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get("/rooms", (req, res) => {
  db.query("SELECT room_id, room_number, room_type, floor, is_available, department_id FROM room", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.get("/doctors", (req, res) => {
  db.query("SELECT doctor_id, first_name, last_name, specialization, qualification, contact_number, email, department_id FROM doctor", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: result });
  });
});

app.post("/rooms", (req, res) => {
  const { room_number, floor, room_type, department_id, is_available } = req.body;
  db.query(
    "INSERT INTO room (room_number, floor, room_type, is_available, department_id) VALUES (?, ?, ?, ?, ?)",
    [room_number, floor, room_type, is_available !== false, department_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://hospital-management-system-jp3t-8n74mgf5h.vercel.app",
  credentials: true
}));
app.use(cors());
app.use(express.json());

// ── PostgreSQL connection via DATABASE_URL (from .env or Supabase/Vercel env vars)
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "SET ✅" : "NOT SET ❌");
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL (Supabase)"))
  .catch(err => console.error("❌ DB Connection Failed:", err.message));

// ── Helper: run a query and return rows
const query = (text, params) => pool.query(text, params);

// ============================================================
// AUTHENTICATION
// ============================================================

// Register User
app.post("/auth/register", async (req, res) => {
  const { username, password, email, full_name } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Check if username already exists
    const { rows: existing } = await query("SELECT user_id FROM users WHERE username = $1", [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Simple hash (for production, use bcrypt)
    const hashedPassword = Buffer.from(password).toString('base64');

    const { rows } = await query(
      "INSERT INTO users (username, password, email, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, full_name",
      [username, hashedPassword, email || null, full_name || null]
    );

    res.json({ 
      success: true, 
      message: "User registered successfully",
      user: rows[0] 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const { rows } = await query("SELECT user_id, username, email, full_name, password FROM users WHERE username = $1", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];
    const hashedPassword = Buffer.from(password).toString('base64');

    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
app.get("/auth/me", async (req, res) => {
  const userId = req.query.user_id;
  
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const { rows } = await query("SELECT user_id, username, email, full_name FROM users WHERE user_id = $1", [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PATIENTS
// ============================================================
app.get("/patients", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        p.patient_id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.blood_group,
        p.contact_number,
        p.email,
        p.address,
        p.registered_at,
        COUNT(DISTINCT a.admission_id)    AS total_admissions,
        COUNT(DISTINCT ov.visit_id)       AS total_visits,
        COUNT(DISTINCT b.bill_id)         AS total_bills
      FROM patient p
      LEFT JOIN admission       a  ON a.patient_id  = p.patient_id
      LEFT JOIN outpatientvisit ov ON ov.patient_id = p.patient_id
      LEFT JOIN bill            b  ON b.patient_id  = p.patient_id
      GROUP BY p.patient_id
      ORDER BY p.registered_at DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/patients", async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, blood_type, contact, email, address } = req.body;
  if (!first_name || !last_name)
    return res.status(400).json({ error: "first_name and last_name are required" });
  try {
    const { rows } = await query(
      "INSERT INTO patient (first_name, last_name, date_of_birth, gender, blood_group, contact_number, email, address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING patient_id",
      [first_name, last_name, date_of_birth, gender, blood_type, contact, email, address]
    );
    res.json({ success: true, id: rows[0].patient_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, gender, blood_type, contact, email, address } = req.body;
  try {
    await query(
      "UPDATE patient SET first_name=$1, last_name=$2, date_of_birth=$3, gender=$4, blood_group=$5, contact_number=$6, email=$7, address=$8 WHERE patient_id=$9",
      [first_name, last_name, date_of_birth, gender, blood_type, contact, email, address, id]
    );
    res.json({ success: true, message: "Patient updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/patients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM patient WHERE patient_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Patient not found" });
    res.json({ success: true, message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// APPOINTMENTS
// ============================================================
app.get("/appointments", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.patient_id,
        p.first_name || ' ' || p.last_name   AS patient_name,
        p.blood_group                          AS patient_blood,
        p.contact_number                       AS patient_contact,
        a.doctor_id,
        d.first_name || ' ' || d.last_name    AS doctor_name,
        d.specialization                       AS doctor_specialization,
        dep.name                               AS department_name
      FROM appointment a
      JOIN patient    p   ON p.patient_id  = a.patient_id
      JOIN doctor     d   ON d.doctor_id   = a.doctor_id
      LEFT JOIN department dep ON dep.department_id = d.department_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING appointment_id",
      [patient_id, doctor_id, appointment_date, appointment_time, reason, status]
    );
    res.json({ success: true, id: rows[0].appointment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = req.body;
  try {
    await query(
      "UPDATE appointment SET patient_id=$1, doctor_id=$2, appointment_date=$3, appointment_time=$4, reason=$5, status=$6 WHERE appointment_id=$7",
      [patient_id, doctor_id, appointment_date, appointment_time, reason, status, id]
    );
    res.json({ success: true, message: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM appointment WHERE appointment_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Appointment not found" });
    res.json({ success: true, message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ADMISSIONS
// ============================================================
app.get("/admissions", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        a.admission_id,
        a.admission_date,
        a.discharge_date,
        a.reason,
        a.diagnosis,
        a.status,
        a.patient_id,
        p.first_name || ' ' || p.last_name   AS patient_name,
        p.blood_group                          AS patient_blood,
        p.contact_number                       AS patient_contact,
        a.doctor_id,
        d.first_name || ' ' || d.last_name    AS doctor_name,
        d.specialization                       AS doctor_specialization,
        a.room_id,
        r.room_number,
        r.room_type,
        r.floor,
        dep.name                               AS department_name
      FROM admission a
      JOIN patient    p   ON p.patient_id   = a.patient_id
      JOIN doctor     d   ON d.doctor_id    = a.doctor_id
      JOIN room       r   ON r.room_id      = a.room_id
      LEFT JOIN department dep ON dep.department_id = d.department_id
      ORDER BY a.admission_date DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admissions", async (req, res) => {
  const { patient_id, doctor_id, room_id, reason, admission_date, status } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO admission (patient_id, doctor_id, room_id, reason, admission_date, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING admission_id",
      [patient_id, doctor_id, room_id, reason, admission_date, status || "Active"]
    );
    // Mark room unavailable
    await query("UPDATE room SET is_available=FALSE WHERE room_id=$1", [room_id]);
    res.json({ success: true, id: rows[0].admission_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/admissions/:id", async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status } = req.body;
  try {
    await query(
      "UPDATE admission SET patient_id=$1, doctor_id=$2, room_id=$3, admission_date=$4, discharge_date=$5, reason=$6, diagnosis=$7, status=$8 WHERE admission_id=$9",
      [patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status, id]
    );
    
    // If discharging, mark room as available
    if (status === 'Discharged' && room_id) {
      await query("UPDATE room SET is_available=TRUE WHERE room_id=$1", [room_id]);
    }
    
    res.json({ success: true, message: "Admission updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admissions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM admission WHERE admission_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Admission not found" });
    res.json({ success: true, message: "Admission deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// OUT-PATIENTS
// ============================================================
app.get("/outpatients", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        ov.visit_id,
        ov.visit_date,
        ov.chief_complaint,
        ov.diagnosis,
        ov.treatment_plan,
        ov.follow_up_date,
        ov.appointment_id,
        ov.patient_id,
        p.first_name || ' ' || p.last_name   AS patient_name,
        p.blood_group                          AS patient_blood,
        p.contact_number                       AS patient_contact,
        ov.doctor_id,
        d.first_name || ' ' || d.last_name    AS doctor_name,
        d.specialization                       AS doctor_specialization,
        dep.name                               AS department_name
      FROM outpatientvisit ov
      JOIN patient    p   ON p.patient_id  = ov.patient_id
      JOIN doctor     d   ON d.doctor_id   = ov.doctor_id
      LEFT JOIN department dep ON dep.department_id = d.department_id
      ORDER BY ov.visit_date DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/outpatients", async (req, res) => {
  const { patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO outpatientvisit (patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING visit_id",
      [patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date]
    );
    res.json({ success: true, id: rows[0].visit_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/outpatients/:id", async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date } = req.body;
  try {
    await query(
      "UPDATE outpatientvisit SET patient_id=$1, doctor_id=$2, visit_date=$3, chief_complaint=$4, diagnosis=$5, treatment_plan=$6, follow_up_date=$7 WHERE visit_id=$8",
      [patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date, id]
    );
    res.json({ success: true, message: "Out-patient visit updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/outpatients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM outpatientvisit WHERE visit_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Out-patient visit not found" });
    res.json({ success: true, message: "Out-patient visit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// BILLING
// ============================================================
app.get("/billing", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        b.bill_id,
        b.bill_date,
        b.total_amount,
        b.paid_amount,
        b.total_amount - b.paid_amount     AS balance,
        b.payment_status,
        b.payment_method,
        b.patient_id,
        p.first_name || ' ' || p.last_name AS patient_name,
        p.blood_group                       AS patient_blood,
        p.contact_number                    AS patient_contact,
        b.admission_id,
        r.room_number                       AS admitted_room,
        r.room_type                         AS room_type,
        b.visit_id,
        d.first_name || ' ' || d.last_name AS doctor_name,
        d.specialization                    AS doctor_specialization
      FROM bill b
      JOIN patient p ON p.patient_id = b.patient_id
      LEFT JOIN admission       a  ON a.admission_id = b.admission_id
      LEFT JOIN room            r  ON r.room_id       = a.room_id
      LEFT JOIN outpatientvisit ov ON ov.visit_id     = b.visit_id
      LEFT JOIN doctor          d  ON d.doctor_id     = COALESCE(a.doctor_id, ov.doctor_id)
      ORDER BY b.bill_date DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/billing", async (req, res) => {
  const { patient_id, total, bill_date, status, payment_method } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO bill (patient_id, total_amount, bill_date, payment_status, payment_method) VALUES ($1,$2,$3,$4,$5) RETURNING bill_id",
      [patient_id, total, bill_date, status || "Pending", payment_method]
    );
    res.json({ success: true, id: rows[0].bill_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/billing/:id", async (req, res) => {
  const { id } = req.params;
  const { patient_id, total, bill_date, status, payment_method } = req.body;
  try {
    await query(
      "UPDATE bill SET patient_id=$1, total_amount=$2, bill_date=$3, payment_status=$4, payment_method=$5 WHERE bill_id=$6",
      [patient_id, total, bill_date, status, payment_method, id]
    );
    res.json({ success: true, message: "Bill updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/billing/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM bill WHERE bill_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Bill not found" });
    res.json({ success: true, message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ROOMS
// ============================================================
app.get("/rooms", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        r.room_id,
        r.room_number,
        r.room_type,
        r.floor,
        r.is_available,
        r.department_id,
        dep.name                               AS department_name,
        -- Current occupant (if admitted and still active)
        p.first_name || ' ' || p.last_name    AS current_patient_name,
        a.admission_id                         AS current_admission_id,
        a.admission_date                       AS occupied_since
      FROM room r
      LEFT JOIN department dep ON dep.department_id = r.department_id
      LEFT JOIN admission  a   ON a.room_id = r.room_id AND a.status = 'Active'
      LEFT JOIN patient    p   ON p.patient_id = a.patient_id
      ORDER BY r.room_number
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/rooms", async (req, res) => {
  const { room_number, floor, room_type, department_id, is_available } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO room (room_number, floor, room_type, is_available, department_id) VALUES ($1,$2,$3,$4,$5) RETURNING room_id",
      [room_number, floor, room_type, is_available !== false, department_id]
    );
    res.json({ success: true, id: rows[0].room_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const { room_number, floor, room_type, department_id, is_available } = req.body;
  try {
    await query(
      "UPDATE room SET room_number=$1, floor=$2, room_type=$3, department_id=$4, is_available=$5 WHERE room_id=$6",
      [room_number, floor, room_type, department_id, is_available, id]
    );
    res.json({ success: true, message: "Room updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query("DELETE FROM room WHERE room_id=$1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Room not found" });
    res.json({ success: true, message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// DOCTORS
// ============================================================
app.get("/doctors", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        d.doctor_id,
        d.first_name,
        d.last_name,
        d.first_name || ' ' || d.last_name  AS full_name,
        d.specialization,
        d.qualification,
        d.contact_number,
        d.email,
        d.department_id,
        dep.name                             AS department_name,
        dep.location                         AS department_location,
        COUNT(DISTINCT a.appointment_id)     AS total_appointments,
        COUNT(DISTINCT adm.admission_id)     AS total_admissions,
        COUNT(DISTINCT ov.visit_id)          AS total_outpatient_visits
      FROM doctor d
      LEFT JOIN department     dep ON dep.department_id = d.department_id
      LEFT JOIN appointment    a   ON a.doctor_id       = d.doctor_id
      LEFT JOIN admission      adm ON adm.doctor_id     = d.doctor_id
      LEFT JOIN outpatientvisit ov ON ov.doctor_id      = d.doctor_id
      GROUP BY d.doctor_id, dep.name, dep.location
      ORDER BY d.last_name
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
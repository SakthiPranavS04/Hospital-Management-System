-- ============================================================
-- Hospital Management System — PostgreSQL Schema (Supabase)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. DEPARTMENT
CREATE TABLE IF NOT EXISTS department (
  department_id  SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  location       VARCHAR(150),
  contact        VARCHAR(20)
);

-- 2. DOCTOR
CREATE TABLE IF NOT EXISTS doctor (
  doctor_id      SERIAL PRIMARY KEY,
  first_name     VARCHAR(50)  NOT NULL,
  last_name      VARCHAR(50)  NOT NULL,
  specialization VARCHAR(100),
  qualification  VARCHAR(100),
  contact_number VARCHAR(20),
  email          VARCHAR(100),
  department_id  INT REFERENCES department(department_id),
  UNIQUE (first_name, last_name)
);

-- 3. PATIENT
CREATE TABLE IF NOT EXISTS patient (
  patient_id     SERIAL PRIMARY KEY,
  first_name     VARCHAR(50)  NOT NULL,
  last_name      VARCHAR(50)  NOT NULL,
  date_of_birth  DATE,
  gender         VARCHAR(10),
  blood_group    VARCHAR(5),
  contact_number VARCHAR(20),
  email          VARCHAR(100),
  address        TEXT,
  registered_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (first_name, last_name)
);

-- 4. ROOM
CREATE TABLE IF NOT EXISTS room (
  room_id        SERIAL PRIMARY KEY,
  room_number    VARCHAR(10)  NOT NULL,
  room_type      VARCHAR(30),
  floor          INT,
  is_available   BOOLEAN DEFAULT TRUE,
  department_id  INT REFERENCES department(department_id)
);

-- 5. APPOINTMENT
CREATE TABLE IF NOT EXISTS appointment (
  appointment_id   SERIAL PRIMARY KEY,
  patient_id       INT REFERENCES patient(patient_id) ON DELETE CASCADE,
  doctor_id        INT REFERENCES doctor(doctor_id),
  appointment_date DATE,
  appointment_time TIME,
  reason           TEXT,
  status           VARCHAR(20) DEFAULT 'Scheduled'
);

-- 6. ADMISSION (In-Patient)
CREATE TABLE IF NOT EXISTS admission (
  admission_id   SERIAL PRIMARY KEY,
  patient_id     INT REFERENCES patient(patient_id) ON DELETE CASCADE,
  doctor_id      INT REFERENCES doctor(doctor_id),
  room_id        INT REFERENCES room(room_id),
  admission_date DATE,
  discharge_date DATE,
  reason         TEXT,
  diagnosis      TEXT,
  status         VARCHAR(20) DEFAULT 'Active'
);

-- 7. OUTPATIENT VISIT
CREATE TABLE IF NOT EXISTS outpatientvisit (
  visit_id        SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patient(patient_id) ON DELETE CASCADE,
  doctor_id       INT REFERENCES doctor(doctor_id),
  appointment_id  INT REFERENCES appointment(appointment_id),
  visit_date      DATE,
  chief_complaint TEXT,
  diagnosis       TEXT,
  treatment_plan  TEXT,
  follow_up_date  DATE
);

-- 8. BILL
CREATE TABLE IF NOT EXISTS bill (
  bill_id         SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patient(patient_id) ON DELETE CASCADE,
  admission_id    INT REFERENCES admission(admission_id),
  visit_id        INT REFERENCES outpatientvisit(visit_id),
  bill_date       DATE DEFAULT CURRENT_DATE,
  total_amount    NUMERIC(10,2) DEFAULT 0,
  paid_amount     NUMERIC(10,2) DEFAULT 0,
  payment_status  VARCHAR(20)   DEFAULT 'Pending',
  payment_method  VARCHAR(30)
);

-- ============================================================
-- VIEWS (pre-built JOIN queries — queryable like tables in Supabase)
-- ============================================================

-- VIEW: Full patient summary with admission/visit/bill counts
CREATE OR REPLACE VIEW v_patients AS
SELECT
  p.patient_id,
  p.first_name,
  p.last_name,
  p.first_name || ' ' || p.last_name        AS full_name,
  p.date_of_birth,
  p.gender,
  p.blood_group,
  p.contact_number,
  p.email,
  p.address,
  p.registered_at,
  COUNT(DISTINCT a.admission_id)             AS total_admissions,
  COUNT(DISTINCT ov.visit_id)                AS total_visits,
  COUNT(DISTINCT b.bill_id)                  AS total_bills
FROM patient p
LEFT JOIN admission       a  ON a.patient_id  = p.patient_id
LEFT JOIN outpatientvisit ov ON ov.patient_id = p.patient_id
LEFT JOIN bill            b  ON b.patient_id  = p.patient_id
GROUP BY p.patient_id;

-- VIEW: Appointments with patient + doctor + department names
CREATE OR REPLACE VIEW v_appointments AS
SELECT
  a.appointment_id,
  a.appointment_date,
  a.appointment_time,
  a.reason,
  a.status,
  a.patient_id,
  p.first_name || ' ' || p.last_name        AS patient_name,
  p.blood_group                              AS patient_blood,
  p.contact_number                           AS patient_contact,
  a.doctor_id,
  d.first_name || ' ' || d.last_name        AS doctor_name,
  d.specialization                           AS doctor_specialization,
  dep.name                                   AS department_name
FROM appointment a
JOIN patient     p   ON p.patient_id   = a.patient_id
JOIN doctor      d   ON d.doctor_id    = a.doctor_id
LEFT JOIN department dep ON dep.department_id = d.department_id;

-- VIEW: Admissions with patient + doctor + room + department names
CREATE OR REPLACE VIEW v_admissions AS
SELECT
  a.admission_id,
  a.admission_date,
  a.discharge_date,
  a.reason,
  a.diagnosis,
  a.status,
  a.patient_id,
  p.first_name || ' ' || p.last_name        AS patient_name,
  p.blood_group                              AS patient_blood,
  p.contact_number                           AS patient_contact,
  a.doctor_id,
  d.first_name || ' ' || d.last_name        AS doctor_name,
  d.specialization                           AS doctor_specialization,
  a.room_id,
  r.room_number,
  r.room_type,
  r.floor,
  dep.name                                   AS department_name
FROM admission a
JOIN patient     p   ON p.patient_id  = a.patient_id
JOIN doctor      d   ON d.doctor_id   = a.doctor_id
JOIN room        r   ON r.room_id     = a.room_id
LEFT JOIN department dep ON dep.department_id = d.department_id;

-- VIEW: Out-patient visits with patient + doctor + department names
CREATE OR REPLACE VIEW v_outpatients AS
SELECT
  ov.visit_id,
  ov.visit_date,
  ov.chief_complaint,
  ov.diagnosis,
  ov.treatment_plan,
  ov.follow_up_date,
  ov.appointment_id,
  ov.patient_id,
  p.first_name || ' ' || p.last_name        AS patient_name,
  p.blood_group                              AS patient_blood,
  p.contact_number                           AS patient_contact,
  ov.doctor_id,
  d.first_name || ' ' || d.last_name        AS doctor_name,
  d.specialization                           AS doctor_specialization,
  dep.name                                   AS department_name
FROM outpatientvisit ov
JOIN patient     p   ON p.patient_id  = ov.patient_id
JOIN doctor      d   ON d.doctor_id   = ov.doctor_id
LEFT JOIN department dep ON dep.department_id = d.department_id;

-- VIEW: Billing with patient + room + doctor names and balance
CREATE OR REPLACE VIEW v_billing AS
SELECT
  b.bill_id,
  b.bill_date,
  b.total_amount,
  b.paid_amount,
  b.total_amount - b.paid_amount            AS balance,
  b.payment_status,
  b.payment_method,
  b.patient_id,
  p.first_name || ' ' || p.last_name        AS patient_name,
  p.blood_group                              AS patient_blood,
  p.contact_number                           AS patient_contact,
  b.admission_id,
  r.room_number                              AS admitted_room,
  r.room_type,
  b.visit_id,
  d.first_name || ' ' || d.last_name        AS doctor_name,
  d.specialization                           AS doctor_specialization
FROM bill b
JOIN patient          p   ON p.patient_id   = b.patient_id
LEFT JOIN admission   a   ON a.admission_id  = b.admission_id
LEFT JOIN room        r   ON r.room_id       = a.room_id
LEFT JOIN outpatientvisit ov ON ov.visit_id  = b.visit_id
LEFT JOIN doctor      d   ON d.doctor_id     = COALESCE(a.doctor_id, ov.doctor_id);

-- VIEW: Rooms with department name + current occupant
CREATE OR REPLACE VIEW v_rooms AS
SELECT
  r.room_id,
  r.room_number,
  r.room_type,
  r.floor,
  r.is_available,
  r.department_id,
  dep.name                                   AS department_name,
  p.first_name || ' ' || p.last_name        AS current_patient_name,
  a.admission_id                             AS current_admission_id,
  a.admission_date                           AS occupied_since
FROM room r
LEFT JOIN department dep ON dep.department_id = r.department_id
LEFT JOIN admission   a  ON a.room_id = r.room_id AND a.status = 'Active'
LEFT JOIN patient     p  ON p.patient_id = a.patient_id;

-- VIEW: Doctors with department + activity counts
CREATE OR REPLACE VIEW v_doctors AS
SELECT
  d.doctor_id,
  d.first_name,
  d.last_name,
  d.first_name || ' ' || d.last_name        AS full_name,
  d.specialization,
  d.qualification,
  d.contact_number,
  d.email,
  d.department_id,
  dep.name                                   AS department_name,
  dep.location                               AS department_location,
  COUNT(DISTINCT a.appointment_id)           AS total_appointments,
  COUNT(DISTINCT adm.admission_id)           AS total_admissions,
  COUNT(DISTINCT ov.visit_id)               AS total_outpatient_visits
FROM doctor d
LEFT JOIN department      dep ON dep.department_id = d.department_id
LEFT JOIN appointment     a   ON a.doctor_id       = d.doctor_id
LEFT JOIN admission       adm ON adm.doctor_id     = d.doctor_id
LEFT JOIN outpatientvisit ov  ON ov.doctor_id      = d.doctor_id
GROUP BY d.doctor_id, dep.name, dep.location;

-- QUERY: Dashboard summary (run as a one-off query)
-- SELECT
--   (SELECT COUNT(*) FROM patient)                           AS total_patients,
--   (SELECT COUNT(*) FROM doctor)                            AS total_doctors,
--   (SELECT COUNT(*) FROM appointment WHERE status='Scheduled') AS scheduled_appointments,
--   (SELECT COUNT(*) FROM admission  WHERE status='Active')  AS active_admissions,
--   (SELECT COUNT(*) FROM room       WHERE is_available=TRUE) AS available_rooms,
--   (SELECT COALESCE(SUM(total_amount),0) FROM bill)         AS total_revenue,
--   (SELECT COALESCE(SUM(paid_amount),0)  FROM bill)         AS total_collected;

-- ============================================================
-- SEED DATA — Run this block in Supabase SQL Editor
-- It clears old data first so NO duplicates ever appear
-- ============================================================

-- Clear old data (safe re-run)
TRUNCATE bill, outpatientvisit, admission, appointment, patient, room, doctor, department RESTART IDENTITY CASCADE;

-- ============================================================
-- DEPARTMENTS (6)
-- ============================================================
INSERT INTO department (name, location, contact) VALUES
  ('Cardiology',       'Block A, Floor 2', '044-1001'),
  ('Neurology',        'Block B, Floor 3', '044-1002'),
  ('Orthopedics',      'Block C, Floor 1', '044-1003'),
  ('Pediatrics',       'Block D, Floor 2', '044-1004'),
  ('Emergency',        'Block A, Floor 0', '044-1005'),
  ('General Medicine', 'Block B, Floor 1', '044-1006');

-- ============================================================
-- DOCTORS (5) — each unique name
-- ============================================================
INSERT INTO doctor (first_name, last_name, specialization, qualification, contact_number, email, department_id) VALUES
  ('Rajan',    'Kumar',   'Cardiologist',    'MBBS, MD',   '9876501001', 'rajan.kumar@hospital.com',   1),
  ('Priya',    'Sharma',  'Neurologist',     'MBBS, DM',   '9876501002', 'priya.sharma@hospital.com',  2),
  ('Amit',     'Verma',   'Orthopedician',   'MBBS, MS',   '9876501003', 'amit.verma@hospital.com',    3),
  ('Sunita',   'Rao',     'Pediatrician',    'MBBS, DCH',  '9876501004', 'sunita.rao@hospital.com',    4),
  ('Krishnan', 'Nair',    'Emergency Med.',  'MBBS, MRCS', '9876501005', 'krishnan.nair@hospital.com', 5);

-- ============================================================
-- ROOMS (6)
-- ============================================================
INSERT INTO room (room_number, room_type, floor, is_available, department_id) VALUES
  ('A101', 'ICU',          1, TRUE, 1),
  ('A102', 'Private',      1, TRUE, 1),
  ('B201', 'General',      2, TRUE, 2),
  ('C101', 'Semi-Private', 1, TRUE, 3),
  ('D201', 'General',      2, TRUE, 4),
  ('A001', 'Emergency',    0, TRUE, 5);

-- ============================================================
-- PATIENTS (10) — all unique names
-- ============================================================
INSERT INTO patient (first_name, last_name, date_of_birth, gender, blood_group, contact_number, email, address) VALUES
  ('Arjun',    'Krishnan',  '1985-06-15', 'Male',   'O+',  '9500001001', 'arjun.k@email.com',    '12, Anna Nagar, Chennai'),
  ('Divya',    'Ramesh',    '1992-11-22', 'Female', 'B+',  '9500001002', 'divya.r@email.com',    '45, RS Puram, Coimbatore'),
  ('Suresh',   'Babu',      '1970-03-08', 'Male',   'A-',  '9500001003', 'suresh.b@email.com',   '78, Gandhipuram, Coimbatore'),
  ('Lakshmi',  'Devi',      '2005-08-30', 'Female', 'AB+', '9500001004', 'lakshmi.d@email.com',  '23, Singanallur, Coimbatore'),
  ('Karthik',  'Selvam',    '1990-04-12', 'Male',   'B-',  '9500001005', 'karthik.s@email.com',  '56, Peelamedu, Coimbatore'),
  ('Meena',    'Iyer',      '1988-09-25', 'Female', 'O-',  '9500001006', 'meena.i@email.com',    '34, Saibaba Colony, Coimbatore'),
  ('Vikram',   'Nair',      '1975-01-18', 'Male',   'A+',  '9500001007', 'vikram.n@email.com',   '89, Race Course, Coimbatore'),
  ('Ananya',   'Pillai',    '1998-07-04', 'Female', 'AB-', '9500001008', 'ananya.p@email.com',   '67, Avinashi Rd, Coimbatore'),
  ('Rajesh',   'Menon',     '1965-12-30', 'Male',   'O+',  '9500001009', 'rajesh.m@email.com',   '11, Trichy Rd, Coimbatore'),
  ('Preethi',  'Sundaram',  '2000-03-17', 'Female', 'B+',  '9500001010', 'preethi.s@email.com',  '22, Ukkadam, Coimbatore');

-- ============================================================
-- APPOINTMENTS (10) — one per patient, each name used once
-- ============================================================
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
VALUES
  ((SELECT patient_id FROM patient WHERE first_name='Arjun'),   (SELECT doctor_id FROM doctor WHERE first_name='Rajan'),   CURRENT_DATE,      '09:00', 'Chest pain and breathlessness',     'Scheduled'),
  ((SELECT patient_id FROM patient WHERE first_name='Divya'),   (SELECT doctor_id FROM doctor WHERE first_name='Priya'),   CURRENT_DATE,      '10:30', 'Recurring headache',                'Scheduled'),
  ((SELECT patient_id FROM patient WHERE first_name='Suresh'),  (SELECT doctor_id FROM doctor WHERE first_name='Amit'),    CURRENT_DATE + 1,  '11:00', 'Severe knee pain',                  'Scheduled'),
  ((SELECT patient_id FROM patient WHERE first_name='Lakshmi'), (SELECT doctor_id FROM doctor WHERE first_name='Sunita'),  CURRENT_DATE + 1,  '09:30', 'Routine annual checkup',            'Scheduled'),
  ((SELECT patient_id FROM patient WHERE first_name='Karthik'), (SELECT doctor_id FROM doctor WHERE first_name='Priya'),   CURRENT_DATE - 2,  '11:00', 'Dizziness and nausea',              'Completed'),
  ((SELECT patient_id FROM patient WHERE first_name='Meena'),   (SELECT doctor_id FROM doctor WHERE first_name='Rajan'),   CURRENT_DATE - 4,  '08:30', 'Palpitations',                      'Completed'),
  ((SELECT patient_id FROM patient WHERE first_name='Vikram'),  (SELECT doctor_id FROM doctor WHERE first_name='Amit'),    CURRENT_DATE - 6,  '10:00', 'Back pain post accident',           'Completed'),
  ((SELECT patient_id FROM patient WHERE first_name='Ananya'),  (SELECT doctor_id FROM doctor WHERE first_name='Sunita'),  CURRENT_DATE - 3,  '14:00', 'Vaccination consultation',          'Cancelled'),
  ((SELECT patient_id FROM patient WHERE first_name='Rajesh'),  (SELECT doctor_id FROM doctor WHERE first_name='Krishnan'),'2026-04-20',       '08:00', 'Emergency — breathing difficulty',  'Completed'),
  ((SELECT patient_id FROM patient WHERE first_name='Preethi'), (SELECT doctor_id FROM doctor WHERE first_name='Priya'),   CURRENT_DATE + 2,  '12:00', 'Follow-up migraine treatment',      'Scheduled');

-- ============================================================
-- ADMISSIONS / IN-PATIENTS (4) — 4 unique patients
-- ============================================================
INSERT INTO admission (patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status) VALUES
  ((SELECT patient_id FROM patient WHERE first_name='Arjun'),  (SELECT doctor_id FROM doctor WHERE first_name='Rajan'),  (SELECT room_id FROM room WHERE room_number='A101'), CURRENT_DATE - 5,  NULL,              'Acute chest pain',          'Acute Myocardial Infarction', 'Active'),
  ((SELECT patient_id FROM patient WHERE first_name='Suresh'), (SELECT doctor_id FROM doctor WHERE first_name='Amit'),   (SELECT room_id FROM room WHERE room_number='C101'), CURRENT_DATE - 3,  NULL,              'Post-surgery recovery',     'Post-op knee replacement',    'Active'),
  ((SELECT patient_id FROM patient WHERE first_name='Vikram'), (SELECT doctor_id FROM doctor WHERE first_name='Amit'),   (SELECT room_id FROM room WHERE room_number='B201'), CURRENT_DATE - 15, CURRENT_DATE - 8, 'Spine fracture treatment',  'L4-L5 disc herniation',       'Discharged'),
  ((SELECT patient_id FROM patient WHERE first_name='Rajesh'), (SELECT doctor_id FROM doctor WHERE first_name='Krishnan'),(SELECT room_id FROM room WHERE room_number='A001'), CURRENT_DATE - 2,  CURRENT_DATE - 1, 'Emergency admission',       'Acute respiratory distress',  'Discharged');

-- Update room availability
UPDATE room SET is_available = FALSE WHERE room_number IN ('A101', 'C101');
UPDATE room SET is_available = TRUE  WHERE room_number IN ('A102', 'B201', 'D201', 'A001');

-- ============================================================
-- OUT-PATIENT VISITS (6) — 6 unique patients
-- ============================================================
INSERT INTO outpatientvisit (patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date) VALUES
  ((SELECT patient_id FROM patient WHERE first_name='Divya'),   (SELECT doctor_id FROM doctor WHERE first_name='Priya'),  CURRENT_DATE - 5,  'Recurring migraine',   'Migraine with aura',        'Sumatriptan 50mg, rest',                  CURRENT_DATE + 25),
  ((SELECT patient_id FROM patient WHERE first_name='Lakshmi'), (SELECT doctor_id FROM doctor WHERE first_name='Sunita'), CURRENT_DATE - 3,  'Annual checkup',       'Normal findings',           'Balanced diet, exercise',                 CURRENT_DATE + 180),
  ((SELECT patient_id FROM patient WHERE first_name='Karthik'), (SELECT doctor_id FROM doctor WHERE first_name='Priya'),  CURRENT_DATE - 2,  'Dizziness episodes',   'Vestibular neuritis',       'Betahistine 16mg twice daily',            CURRENT_DATE + 30),
  ((SELECT patient_id FROM patient WHERE first_name='Meena'),   (SELECT doctor_id FROM doctor WHERE first_name='Rajan'),  CURRENT_DATE - 4,  'Heart palpitations',   'Paroxysmal AF noted',       'Bisoprolol 2.5mg, ECG monitoring',        CURRENT_DATE + 14),
  ((SELECT patient_id FROM patient WHERE first_name='Ananya'),  (SELECT doctor_id FROM doctor WHERE first_name='Sunita'), CURRENT_DATE - 7,  'Skin allergy',         'Urticaria',                 'Cetirizine 10mg, avoid allergens',        CURRENT_DATE + 15),
  ((SELECT patient_id FROM patient WHERE first_name='Preethi'), (SELECT doctor_id FROM doctor WHERE first_name='Priya'),  CURRENT_DATE - 10, 'Eye strain, headache', 'Tension-type headache',     'Screen rest, Ibuprofen 400mg if needed',  CURRENT_DATE + 20);

-- ============================================================
-- BILLING (6) — linked to admissions & visits above
-- ============================================================
INSERT INTO bill (patient_id, admission_id, visit_id, bill_date, total_amount, paid_amount, payment_status, payment_method)
VALUES
  ((SELECT patient_id FROM patient WHERE first_name='Arjun'),  (SELECT admission_id FROM admission JOIN patient USING(patient_id) WHERE patient.first_name='Arjun' LIMIT 1),  NULL, CURRENT_DATE - 5,  45000.00, 10000.00, 'Partial', 'Insurance'),
  ((SELECT patient_id FROM patient WHERE first_name='Suresh'), (SELECT admission_id FROM admission JOIN patient USING(patient_id) WHERE patient.first_name='Suresh' LIMIT 1), NULL, CURRENT_DATE - 3,  38000.00, 20000.00, 'Partial', 'Card'),
  ((SELECT patient_id FROM patient WHERE first_name='Vikram'), (SELECT admission_id FROM admission JOIN patient USING(patient_id) WHERE patient.first_name='Vikram' LIMIT 1), NULL, CURRENT_DATE - 8,  28000.00, 28000.00, 'Paid',    'Insurance'),
  ((SELECT patient_id FROM patient WHERE first_name='Rajesh'), (SELECT admission_id FROM admission JOIN patient USING(patient_id) WHERE patient.first_name='Rajesh' LIMIT 1), NULL, CURRENT_DATE - 1,  12000.00, 12000.00, 'Paid',    'Cash'),
  ((SELECT patient_id FROM patient WHERE first_name='Divya'),  NULL, (SELECT visit_id FROM outpatientvisit JOIN patient USING(patient_id) WHERE patient.first_name='Divya'  LIMIT 1), CURRENT_DATE - 5,  800.00,  800.00,  'Paid',    'Cash'),
  ((SELECT patient_id FROM patient WHERE first_name='Meena'),  NULL, (SELECT visit_id FROM outpatientvisit JOIN patient USING(patient_id) WHERE patient.first_name='Meena'  LIMIT 1), CURRENT_DATE - 4,  600.00,  0.00,    'Pending', 'Card');


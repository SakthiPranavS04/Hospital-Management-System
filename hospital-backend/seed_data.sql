-- ============================================================
-- SAMPLE DATA — Appointments, Admissions, Out-Patients, Billing
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- (Only run AFTER the main schema.sql has been executed)
-- ============================================================

-- NOTE: This assumes patient IDs are 1–4, doctor IDs are 1–5, room IDs are 1–6
-- If your IDs are different, check with: SELECT patient_id, first_name FROM patient;

-- ============================================================
-- APPOINTMENTS (8 sample records)
-- ============================================================
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
  -- Arjun Krishnan → Dr. Rajan Kumar (Cardiologist)
  (1, 1, CURRENT_DATE,       '09:00', 'Chest pain and breathlessness',        'Scheduled'),
  -- Divya Ramesh → Dr. Priya Sharma (Neurologist)
  (2, 2, CURRENT_DATE,       '10:30', 'Recurring headache and dizziness',      'Scheduled'),
  -- Suresh Babu → Dr. Amit Verma (Orthopedician)
  (3, 3, CURRENT_DATE + 1,  '11:00', 'Severe knee pain',                      'Scheduled'),
  -- Lakshmi Devi → Dr. Sunita Rao (Pediatrician)
  (4, 4, CURRENT_DATE + 1,  '09:30', 'Routine annual checkup',                'Scheduled'),
  -- Arjun Krishnan → Dr. Rajan Kumar (follow-up, completed)
  (1, 1, CURRENT_DATE - 10, '10:00', 'Follow-up after cardiac episode',       'Completed'),
  -- Divya Ramesh → Dr. Priya Sharma (completed)
  (2, 2, CURRENT_DATE - 5,  '11:30', 'Migraine evaluation',                   'Completed'),
  -- Suresh Babu → Dr. Krishnan Nair (Emergency)
  (3, 5, CURRENT_DATE - 15, '08:00', 'Emergency — fall injury',               'Completed'),
  -- Lakshmi Devi → Dr. Sunita Rao (cancelled)
  (4, 4, CURRENT_DATE - 3,  '14:00', 'Vaccination consultation',              'Cancelled');

-- ============================================================
-- ADMISSIONS / IN-PATIENTS (4 sample records)
-- ============================================================
INSERT INTO admission (patient_id, doctor_id, room_id, admission_date, discharge_date, reason, diagnosis, status) VALUES
  (1, 1, (SELECT room_id FROM room WHERE room_number='A101' LIMIT 1), CURRENT_DATE - 5,  NULL,              'Acute chest pain',           'Acute Myocardial Infarction', 'Active'),
  (3, 3, (SELECT room_id FROM room WHERE room_number='C101' LIMIT 1), CURRENT_DATE - 3,  NULL,              'Post-surgery recovery',      'Post-op knee replacement',    'Active'),
  (2, 2, (SELECT room_id FROM room WHERE room_number='B201' LIMIT 1), CURRENT_DATE - 20, CURRENT_DATE - 14,'Severe migraine episodes',   'Chronic Migraine with Aura',  'Discharged'),
  (4, 4, (SELECT room_id FROM room WHERE room_number='D201' LIMIT 1), CURRENT_DATE - 30, CURRENT_DATE - 25,'High fever and dehydration', 'Viral fever — recovered',     'Discharged');

-- Update room availability to match active admissions
UPDATE room SET is_available = FALSE WHERE room_number IN ('A101', 'C101');
UPDATE room SET is_available = TRUE  WHERE room_number IN ('A102', 'B201', 'D201', 'A001');

-- ============================================================
-- OUT-PATIENT VISITS (6 sample records)
-- ============================================================
INSERT INTO outpatientvisit (patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment_plan, follow_up_date) VALUES
  -- Divya Ramesh → Dr. Priya Sharma
  (2, 2, CURRENT_DATE - 5,  'Recurring migraine',       'Migraine with aura',           'Sumatriptan 50mg, rest',                   CURRENT_DATE + 25),
  -- Lakshmi Devi → Dr. Sunita Rao
  (4, 4, CURRENT_DATE - 3,  'Annual checkup',           'Normal findings',              'Balanced diet, exercise',                  CURRENT_DATE + 180),
  -- Arjun Krishnan → Dr. Rajan Kumar (pre-admission visit)
  (1, 1, CURRENT_DATE - 8,  'Chest tightness',          'Suspected cardiac event',      'Referred for ECG and stress test',         NULL),
  -- Suresh Babu → Dr. Amit Verma (post-discharge follow-up)
  (3, 3, CURRENT_DATE - 1,  'Post-op wound check',      'Healing well, no infection',   'Continue physiotherapy, dressing change',  CURRENT_DATE + 14),
  -- Divya Ramesh → Dr. Priya Sharma (earlier visit)
  (2, 2, CURRENT_DATE - 30, 'Sudden vision blur',       'Ocular migraine',              'Propranolol 40mg daily',                   CURRENT_DATE - 5),
  -- Lakshmi Devi → Dr. Krishnan Nair (emergency walk-in)
  (4, 5, CURRENT_DATE - 10, 'High fever — 103°F',       'Viral fever',                  'Paracetamol, ORS, bed rest',               CURRENT_DATE - 3);

-- ============================================================
-- BILLING (6 sample records — linked to admissions and visits)
-- ============================================================
INSERT INTO bill (patient_id, admission_id, visit_id, bill_date, total_amount, paid_amount, payment_status, payment_method) VALUES
  -- Arjun Krishnan — Active admission (partial payment)
  (1, 1, NULL, CURRENT_DATE - 5,  45000.00, 10000.00, 'Partial',  'Insurance'),
  -- Suresh Babu — Active admission (partial payment)
  (3, 2, NULL, CURRENT_DATE - 3,  38000.00, 20000.00, 'Partial',  'Card'),
  -- Divya Ramesh — Discharged admission (fully paid)
  (2, 3, NULL, CURRENT_DATE - 14, 22000.00, 22000.00, 'Paid',     'Insurance'),
  -- Lakshmi Devi — Discharged admission (fully paid)
  (4, 4, NULL, CURRENT_DATE - 25, 8500.00,  8500.00,  'Paid',     'Cash'),
  -- Divya Ramesh — Out-patient visit bill (paid)
  (2, NULL, 1, CURRENT_DATE - 5,  800.00,   800.00,   'Paid',     'Cash'),
  -- Lakshmi Devi — Out-patient visit bill (pending)
  (4, NULL, 2, CURRENT_DATE - 3,  500.00,   0.00,     'Pending',  'Cash');

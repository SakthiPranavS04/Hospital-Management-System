
DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE hospital_db;
USE hospital_db;
-- ============================================================
--  HOSPITAL IN-PATIENT / OUT-PATIENT / APPOINTMENT MANAGEMENT
--  MySQL Workbench Setup Script
-- ============================================================

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- ============================================================
--  LOOKUP / REFERENCE TABLES
-- ============================================================

CREATE TABLE Department (
    department_id   INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    location        VARCHAR(100),
    contact_number  VARCHAR(20)
);

CREATE TABLE Room (
    room_id         INT AUTO_INCREMENT PRIMARY KEY,
    room_number     VARCHAR(20) NOT NULL UNIQUE,
    room_type       ENUM('General','ICU','Private','Semi-Private','Emergency') NOT NULL,
    floor           INT,
    is_available    BOOLEAN DEFAULT TRUE,
    department_id   INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

-- ============================================================
--  PEOPLE : STAFF
-- ============================================================

CREATE TABLE Doctor (
    doctor_id       INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    specialization  VARCHAR(100),
    qualification   VARCHAR(150),
    contact_number  VARCHAR(20),
    email           VARCHAR(100) UNIQUE,
    department_id   INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE Nurse (
    nurse_id        INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    contact_number  VARCHAR(20),
    email           VARCHAR(100) UNIQUE,
    shift           ENUM('Morning','Evening','Night'),
    department_id   INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

-- ============================================================
--  PEOPLE : PATIENTS
-- ============================================================

CREATE TABLE Patient (
    patient_id      INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    date_of_birth   DATE,
    gender          ENUM('Male','Female','Other'),
    blood_group     VARCHAR(5),
    contact_number  VARCHAR(20),
    email           VARCHAR(100),
    address         TEXT,
    emergency_contact_name   VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    registered_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  APPOINTMENTS
-- ============================================================

CREATE TABLE Appointment (
    appointment_id  INT AUTO_INCREMENT PRIMARY KEY,
    patient_id      INT NOT NULL,
    doctor_id       INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason          TEXT,
    status          ENUM('Scheduled','Completed','Cancelled','No-Show') DEFAULT 'Scheduled',
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (doctor_id)  REFERENCES Doctor(doctor_id)
);

-- ============================================================
--  OUT-PATIENT MANAGEMENT
-- ============================================================

CREATE TABLE OutPatientVisit (
    visit_id        INT AUTO_INCREMENT PRIMARY KEY,
    patient_id      INT NOT NULL,
    doctor_id       INT NOT NULL,
    appointment_id  INT,
    visit_date      DATETIME DEFAULT CURRENT_TIMESTAMP,
    chief_complaint TEXT,
    diagnosis       TEXT,
    treatment_plan  TEXT,
    follow_up_date  DATE,
    FOREIGN KEY (patient_id)      REFERENCES Patient(patient_id),
    FOREIGN KEY (doctor_id)       REFERENCES Doctor(doctor_id),
    FOREIGN KEY (appointment_id)  REFERENCES Appointment(appointment_id)
);

-- ============================================================
--  IN-PATIENT MANAGEMENT
-- ============================================================

CREATE TABLE Admission (
    admission_id    INT AUTO_INCREMENT PRIMARY KEY,
    patient_id      INT NOT NULL,
    doctor_id       INT NOT NULL,
    room_id         INT NOT NULL,
    admission_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
    discharge_date  DATETIME,
    reason          TEXT,
    diagnosis       TEXT,
    status          ENUM('Active','Discharged','Transferred') DEFAULT 'Active',
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (doctor_id)  REFERENCES Doctor(doctor_id),
    FOREIGN KEY (room_id)    REFERENCES Room(room_id)
);

CREATE TABLE NurseAdmissionAssignment (
    assignment_id   INT AUTO_INCREMENT PRIMARY KEY,
    admission_id    INT NOT NULL,
    nurse_id        INT NOT NULL,
    assigned_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES Admission(admission_id),
    FOREIGN KEY (nurse_id)     REFERENCES Nurse(nurse_id)
);

-- ============================================================
--  MEDICAL RECORDS
-- ============================================================

CREATE TABLE MedicalRecord (
    record_id       INT AUTO_INCREMENT PRIMARY KEY,
    patient_id      INT NOT NULL,
    doctor_id       INT NOT NULL,
    visit_id        INT,
    admission_id    INT,
    record_date     DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis       TEXT,
    treatment       TEXT,
    notes           TEXT,
    FOREIGN KEY (patient_id)   REFERENCES Patient(patient_id),
    FOREIGN KEY (doctor_id)    REFERENCES Doctor(doctor_id),
    FOREIGN KEY (visit_id)     REFERENCES OutPatientVisit(visit_id),
    FOREIGN KEY (admission_id) REFERENCES Admission(admission_id)
);

-- ============================================================
--  PRESCRIPTIONS
-- ============================================================

CREATE TABLE Prescription (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id       INT NOT NULL,
    medication_name VARCHAR(150) NOT NULL,
    dosage          VARCHAR(100),
    frequency       VARCHAR(100),
    duration_days   INT,
    instructions    TEXT,
    FOREIGN KEY (record_id) REFERENCES MedicalRecord(record_id)
);

-- ============================================================
--  BILLING
-- ============================================================

CREATE TABLE Bill (
    bill_id         INT AUTO_INCREMENT PRIMARY KEY,
    patient_id      INT NOT NULL,
    admission_id    INT,
    visit_id        INT,
    bill_date       DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount    DECIMAL(10,2),
    paid_amount     DECIMAL(10,2) DEFAULT 0,
    payment_status  ENUM('Pending','Partial','Paid') DEFAULT 'Pending',
    payment_method  ENUM('Cash','Card','Insurance','Online') DEFAULT 'Cash',
    FOREIGN KEY (patient_id)   REFERENCES Patient(patient_id),
    FOREIGN KEY (admission_id) REFERENCES Admission(admission_id),
    FOREIGN KEY (visit_id)     REFERENCES OutPatientVisit(visit_id)
);

-- ============================================================
--  SEED DATA
-- ============================================================

INSERT INTO Department (name, location, contact_number) VALUES
('Cardiology',      'Block A, Floor 2', '044-1001'),
('Neurology',       'Block B, Floor 3', '044-1002'),
('Orthopedics',     'Block C, Floor 1', '044-1003'),
('Pediatrics',      'Block D, Floor 2', '044-1004'),
('Emergency',       'Block A, Floor 0', '044-1005'),
('General Medicine','Block B, Floor 1', '044-1006');

INSERT INTO Room (room_number, room_type, floor, is_available, department_id) VALUES
('A101','ICU',          1, TRUE, 1),
('A102','Private',      1, TRUE, 1),
('B201','General',      2, TRUE, 2),
('C101','Semi-Private', 1, TRUE, 3),
('D201','General',      2, TRUE, 4),
('A001','Emergency',    0, TRUE, 5);

INSERT INTO Doctor (first_name, last_name, specialization, qualification, contact_number, email, department_id) VALUES
('Rajan',   'Kumar',    'Cardiologist',    'MBBS, MD, DM',       '9876501001', 'rajan.kumar@hospital.com',   1),
('Priya',   'Sharma',   'Neurologist',     'MBBS, MD',           '9876501002', 'priya.sharma@hospital.com',  2),
('Amit',    'Verma',    'Orthopedician',   'MBBS, MS (Ortho)',   '9876501003', 'amit.verma@hospital.com',    3),
('Sunita',  'Rao',      'Pediatrician',    'MBBS, MD (Peds)',    '9876501004', 'sunita.rao@hospital.com',    4),
('Krishnan','Nair',     'Emergency Med.',  'MBBS, DNB (Emerg.)', '9876501005', 'krishnan.nair@hospital.com', 5);

INSERT INTO Nurse (first_name, last_name, contact_number, email, shift, department_id) VALUES
('Meena',   'Pillai', '9000100001', 'meena.pillai@hospital.com',   'Morning', 1),
('Radha',   'Patel',  '9000100002', 'radha.patel@hospital.com',    'Evening', 2),
('Kavitha', 'Menon',  '9000100003', 'kavitha.menon@hospital.com',  'Night',   3);

INSERT INTO Patient (first_name, last_name, date_of_birth, gender, blood_group, contact_number, email, address) VALUES
('Arjun',   'Krishnan', '1985-06-15', 'Male',   'O+', '9500001001', 'arjun.k@email.com',  '12, Anna Nagar, Chennai'),
('Divya',   'Ramesh',   '1992-11-22', 'Female', 'B+', '9500001002', 'divya.r@email.com',  '45, RS Puram, Coimbatore'),
('Suresh',  'Babu',     '1970-03-08', 'Male',   'A-', '9500001003', 'suresh.b@email.com', '78, Gandhipuram, Coimbatore'),
('Lakshmi', 'Devi',     '2005-08-30', 'Female', 'AB+','9500001004', 'lakshmi.d@email.com','23, Singanallur, Coimbatore');

INSERT INTO Appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
(1, 1, CURDATE(),              '09:00:00', 'Chest pain and breathlessness', 'Scheduled'),
(2, 2, CURDATE(),              '10:30:00', 'Recurring headache',            'Scheduled'),
(3, 3, DATE_ADD(CURDATE(),INTERVAL 1 DAY), '11:00:00', 'Knee pain',         'Scheduled'),
(4, 4, DATE_ADD(CURDATE(),INTERVAL 2 DAY), '09:30:00', 'Routine checkup',   'Scheduled');

INSERT INTO Admission (patient_id, doctor_id, room_id, reason, status) VALUES
(1, 1, 1, 'Acute myocardial infarction — monitoring required', 'Active'),
(3, 3, 4, 'Post-operative knee replacement recovery',          'Active');

INSERT INTO NurseAdmissionAssignment (admission_id, nurse_id) VALUES
(1, 1),
(2, 3);

INSERT INTO OutPatientVisit (patient_id, doctor_id, appointment_id, chief_complaint, diagnosis, treatment_plan, follow_up_date) VALUES
(2, 2, 2, 'Recurring migraine', 'Migraine with aura', 'Prescribed Sumatriptan; rest advised', DATE_ADD(CURDATE(),INTERVAL 30 DAY)),
(4, 4, 4, 'Annual checkup',     'Normal findings',     'Continue balanced diet and exercise',  DATE_ADD(CURDATE(),INTERVAL 180 DAY));

INSERT INTO MedicalRecord (patient_id, doctor_id, visit_id, admission_id, diagnosis, treatment, notes) VALUES
(2, 2, 1, NULL, 'Migraine with aura', 'Sumatriptan 50mg',        'Patient advised to track triggers'),
(4, 4, 2, NULL, 'Normal checkup',     'No medication prescribed', 'BMI within healthy range'),
(1, 1, NULL, 1,  'Acute MI',          'IV heparin, aspirin',     'Echocardiography scheduled'),
(3, 3, NULL, 2,  'Post-op knee',      'Physiotherapy plan',      'Weight-bearing as tolerated');

INSERT INTO Prescription (record_id, medication_name, dosage, frequency, duration_days, instructions) VALUES
(1, 'Sumatriptan', '50mg', 'As needed',     7,  'Take at onset of migraine'),
(3, 'Aspirin',     '75mg', 'Once daily',    30, 'Take after meals'),
(3, 'Heparin',     'IV',   'Every 6 hours', 5,  'Under nursing supervision'),
(4, 'Pantoprazole','40mg', 'Twice daily',   14, 'Before meals');

INSERT INTO Bill (patient_id, admission_id, visit_id, total_amount, paid_amount, payment_status) VALUES
(1, 1,    NULL, 25000.00,  5000.00, 'Partial'),
(2, NULL, 1,      800.00,   800.00, 'Paid'),
(3, 2,    NULL, 40000.00, 40000.00, 'Paid'),
(4, NULL, 2,      500.00,     0.00, 'Pending');

-- ============================================================
--  USEFUL QUERIES FOR WORKBENCH
-- ============================================================

-- All scheduled appointments today
SELECT a.appointment_id, CONCAT(p.first_name,' ',p.last_name) AS patient,
       CONCAT(d.first_name,' ',d.last_name) AS doctor, d.specialization,
       a.appointment_time, a.reason, a.status
FROM Appointment a
JOIN Patient p ON a.patient_id = p.patient_id
JOIN Doctor  d ON a.doctor_id  = d.doctor_id
WHERE a.appointment_date = CURDATE()
ORDER BY a.appointment_time;

-- Currently admitted (in-patients)
SELECT ad.admission_id, CONCAT(p.first_name,' ',p.last_name) AS patient,
       CONCAT(doc.first_name,' ',doc.last_name) AS doctor,
       r.room_number, r.room_type, ad.admission_date, ad.reason
FROM Admission ad
JOIN Patient p   ON ad.patient_id = p.patient_id
JOIN Doctor  doc ON ad.doctor_id  = doc.doctor_id
JOIN Room    r   ON ad.room_id    = r.room_id
WHERE ad.status = 'Active';

-- Out-patient visits with prescriptions count
SELECT opv.visit_id, CONCAT(p.first_name,' ',p.last_name) AS patient,
       CONCAT(d.first_name,' ',d.last_name) AS doctor,
       opv.visit_date, opv.diagnosis,
       COUNT(pr.prescription_id) AS prescriptions
FROM OutPatientVisit opv
JOIN Patient p    ON opv.patient_id = p.patient_id
JOIN Doctor  d    ON opv.doctor_id  = d.doctor_id
JOIN MedicalRecord mr ON mr.visit_id = opv.visit_id
LEFT JOIN Prescription pr ON pr.record_id = mr.record_id
GROUP BY opv.visit_id;

-- Pending bills
SELECT b.bill_id, CONCAT(p.first_name,' ',p.last_name) AS patient,
       b.bill_date, b.total_amount, b.paid_amount,
       (b.total_amount - b.paid_amount) AS balance,
       b.payment_status
FROM Bill b
JOIN Patient p ON b.patient_id = p.patient_id
WHERE b.payment_status <> 'Paid'
ORDER BY b.bill_date;

-- Room occupancy summary
SELECT r.room_number, r.room_type, r.floor,
       dep.name AS department,
       IF(r.is_available,'Available','Occupied') AS status
FROM Room r
JOIN Department dep ON r.department_id = dep.department_id
ORDER BY r.floor, r.room_number;

-- Doctor appointment count this month
SELECT CONCAT(d.first_name,' ',d.last_name) AS doctor,
       d.specialization,
       COUNT(a.appointment_id) AS total_appointments
FROM Doctor d
LEFT JOIN Appointment a ON d.doctor_id = a.doctor_id
       AND MONTH(a.appointment_date) = MONTH(CURDATE())
       AND YEAR(a.appointment_date)  = YEAR(CURDATE())
GROUP BY d.doctor_id
ORDER BY total_appointments DESC;

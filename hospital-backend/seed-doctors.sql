-- Seed sample doctors into the database
INSERT INTO doctor (first_name, last_name, specialization, qualification, contact_number, email, department_id) VALUES
('Rajan', 'Kumar', 'Cardiologist', 'MD, MRCP', '9500000101', 'rajan.kumar@hospital.com', 1),
('Priya', 'Sharma', 'Neurologist', 'MD, DNB', '9500000102', 'priya.sharma@hospital.com', 2),
('Amit', 'Verma', 'Orthopedist', 'MS, MCh', '9500000103', 'amit.verma@hospital.com', 3),
('Divya', 'Nair', 'Pediatrician', 'MD, DCH', '9500000104', 'divya.nair@hospital.com', 4),
('Suresh', 'Reddy', 'Surgeon', 'MS, FACS', '9500000105', 'suresh.reddy@hospital.com', 5),
('Meena', 'Iyer', 'Gynecologist', 'DGO, FCPS', '9500000106', 'meena.iyer@hospital.com', 6),
('Rakesh', 'Patel', 'Dermatologist', 'MD, DDV', '9500000107', 'rakesh.patel@hospital.com', 7),
('Anjali', 'Singh', 'Radiologist', 'MD, DMRE', '9500000108', 'anjali.singh@hospital.com', 8)
ON CONFLICT (doctor_id) DO NOTHING;

-- Verify doctors were inserted
SELECT COUNT(*) as total_doctors FROM doctor;

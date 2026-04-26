-- First, ensure all required departments exist
INSERT INTO department (name, location) VALUES
('Cardiology', 'Block A - Floor 1'),
('Neurology', 'Block B - Floor 2'),
('Orthopedics', 'Block C - Floor 3'),
('Pediatrics', 'Block D - Floor 1'),
('General Surgery', 'Block E - Floor 2'),
('Obstetrics & Gynecology', 'Block F - Floor 3'),
('Dermatology', 'Block A - Floor 2'),
('Radiology', 'Block G - Floor 4')
ON CONFLICT DO NOTHING;

-- Seed sample doctors into the database (with valid department IDs)
INSERT INTO doctor (first_name, last_name, specialization, qualification, contact_number, email, department_id) VALUES
('Rajan', 'Kumar', 'Cardiologist', 'MD, MRCP', '9500000101', 'rajan.kumar@hospital.com', 1),
('Priya', 'Sharma', 'Neurologist', 'MD, DNB', '9500000102', 'priya.sharma@hospital.com', 2),
('Amit', 'Verma', 'Orthopedist', 'MS, MCh', '9500000103', 'amit.verma@hospital.com', 3),
('Divya', 'Nair', 'Pediatrician', 'MD, DCH', '9500000104', 'divya.nair@hospital.com', 4),
('Suresh', 'Reddy', 'Surgeon', 'MS, FACS', '9500000105', 'suresh.reddy@hospital.com', 5),
('Meena', 'Iyer', 'Gynecologist', 'DGO, FCPS', '9500000106', 'meena.iyer@hospital.com', 6),
('Rakesh', 'Patel', 'Dermatologist', 'MD, DDV', '9500000107', 'rakesh.patel@hospital.com', 7),
('Anjali', 'Singh', 'Radiologist', 'MD, DMRE', '9500000108', 'anjali.singh@hospital.com', 8)
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Departments' as check_name, COUNT(*) as count FROM department
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctor;

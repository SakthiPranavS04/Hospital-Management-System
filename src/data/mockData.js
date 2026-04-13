// ── Mock Data Store ──────────────────────────────────────────
export const departments = [
  { id:1, name:'Cardiology',      location:'Block A, Floor 2', contact:'044-1001' },
  { id:2, name:'Neurology',       location:'Block B, Floor 3', contact:'044-1002' },
  { id:3, name:'Orthopedics',     location:'Block C, Floor 1', contact:'044-1003' },
  { id:4, name:'Pediatrics',      location:'Block D, Floor 2', contact:'044-1004' },
  { id:5, name:'Emergency',       location:'Block A, Floor 0', contact:'044-1005' },
  { id:6, name:'General Medicine',location:'Block B, Floor 1', contact:'044-1006' },
]

export const doctors = [
  { id:1, firstName:'Rajan',    lastName:'Kumar',   spec:'Cardiologist',   dept:1, contact:'9876501001', email:'rajan.kumar@hospital.com' },
  { id:2, firstName:'Priya',    lastName:'Sharma',  spec:'Neurologist',    dept:2, contact:'9876501002', email:'priya.sharma@hospital.com' },
  { id:3, firstName:'Amit',     lastName:'Verma',   spec:'Orthopedician',  dept:3, contact:'9876501003', email:'amit.verma@hospital.com' },
  { id:4, firstName:'Sunita',   lastName:'Rao',     spec:'Pediatrician',   dept:4, contact:'9876501004', email:'sunita.rao@hospital.com' },
  { id:5, firstName:'Krishnan', lastName:'Nair',    spec:'Emergency Med.', dept:5, contact:'9876501005', email:'krishnan.nair@hospital.com' },
]

export const rooms = [
  { id:1, number:'A101', type:'ICU',          floor:1, available:false, dept:1 },
  { id:2, number:'A102', type:'Private',      floor:1, available:true,  dept:1 },
  { id:3, number:'B201', type:'General',      floor:2, available:true,  dept:2 },
  { id:4, number:'C101', type:'Semi-Private', floor:1, available:false, dept:3 },
  { id:5, number:'D201', type:'General',      floor:2, available:true,  dept:4 },
  { id:6, number:'A001', type:'Emergency',    floor:0, available:true,  dept:5 },
]

export const patients = [
  { id:1, firstName:'Arjun',   lastName:'Krishnan', dob:'1985-06-15', gender:'Male',   blood:'O+',  contact:'9500001001', email:'arjun.k@email.com',  address:'12, Anna Nagar, Chennai',          registeredAt:'2024-01-10' },
  { id:2, firstName:'Divya',   lastName:'Ramesh',   dob:'1992-11-22', gender:'Female', blood:'B+',  contact:'9500001002', email:'divya.r@email.com',  address:'45, RS Puram, Coimbatore',         registeredAt:'2024-02-14' },
  { id:3, firstName:'Suresh',  lastName:'Babu',     dob:'1970-03-08', gender:'Male',   blood:'A-',  contact:'9500001003', email:'suresh.b@email.com', address:'78, Gandhipuram, Coimbatore',      registeredAt:'2024-03-01' },
  { id:4, firstName:'Lakshmi', lastName:'Devi',     dob:'2005-08-30', gender:'Female', blood:'AB+', contact:'9500001004', email:'lakshmi.d@email.com',address:'23, Singanallur, Coimbatore',      registeredAt:'2024-03-15' },
]

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]

export const appointments = [
  { id:1, patientId:1, doctorId:1, date:today,    time:'09:00', reason:'Chest pain and breathlessness', status:'Scheduled' },
  { id:2, patientId:2, doctorId:2, date:today,    time:'10:30', reason:'Recurring headache',            status:'Scheduled' },
  { id:3, patientId:3, doctorId:3, date:tomorrow, time:'11:00', reason:'Knee pain',                     status:'Scheduled' },
  { id:4, patientId:4, doctorId:4, date:tomorrow, time:'09:30', reason:'Routine checkup',               status:'Scheduled' },
]

export const admissions = [
  { id:1, patientId:1, doctorId:1, roomId:1, admissionDate:'2024-04-10', reason:'Acute myocardial infarction', status:'Active',     diagnosis:'Acute MI' },
  { id:2, patientId:3, doctorId:3, roomId:4, admissionDate:'2024-04-08', reason:'Post-operative recovery',     status:'Active',     diagnosis:'Post-op knee replacement' },
]

export const outPatientVisits = [
  { id:1, patientId:2, doctorId:2, appointmentId:2, date:'2024-04-11', complaint:'Recurring migraine', diagnosis:'Migraine with aura', treatment:'Sumatriptan 50mg', followUp:'2024-05-11' },
  { id:2, patientId:4, doctorId:4, appointmentId:4, date:'2024-04-12', complaint:'Annual checkup',      diagnosis:'Normal findings',   treatment:'Balanced diet',    followUp:'2024-10-12' },
]

export const bills = [
  { id:1, patientId:1, admissionId:1, visitId:null, date:'2024-04-10', total:25000, paid:5000,  status:'Partial',  method:'Insurance' },
  { id:2, patientId:2, admissionId:null, visitId:1, date:'2024-04-11', total:800,   paid:800,   status:'Paid',     method:'Cash' },
  { id:3, patientId:3, admissionId:2, visitId:null, date:'2024-04-08', total:40000, paid:40000, status:'Paid',     method:'Card' },
  { id:4, patientId:4, admissionId:null, visitId:2, date:'2024-04-12', total:500,   paid:0,     status:'Pending',  method:'Cash' },
]

// helpers
export const doctorName = id => { const d = doctors.find(x=>x.id===id); return d ? `Dr. ${d.firstName} ${d.lastName}` : '—' }
export const patientName = id => { const p = patients.find(x=>x.id===id); return p ? `${p.firstName} ${p.lastName}` : '—' }
export const roomLabel = id => { const r = rooms.find(x=>x.id===id); return r ? `${r.number} (${r.type})` : '—' }
export const deptName = id => { const d = departments.find(x=>x.id===id); return d ? d.name : '—' }

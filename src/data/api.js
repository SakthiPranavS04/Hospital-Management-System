const BASE_URL = "http://localhost:3001";

// Patients
export const getPatients = async () => {
  console.log('🔵 [API] GET /patients')
  try {
    const res = await fetch(`${BASE_URL}/patients`);
    const data = await res.json();
    console.log('🔵 [API] GET /patients response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /patients error:', err)
    throw err;
  }
};

// Appointments
export const getAppointments = async () => {
  console.log('🔵 [API] GET /appointments')
  try {
    const res = await fetch(`${BASE_URL}/appointments`);
    const data = await res.json();
    console.log('🔵 [API] GET /appointments response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /appointments error:', err)
    throw err;
  }
};

// Admissions
export const getAdmissions = async () => {
  console.log('🔵 [API] GET /admissions')
  try {
    const res = await fetch(`${BASE_URL}/admissions`);
    const data = await res.json();
    console.log('🔵 [API] GET /admissions response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /admissions error:', err)
    throw err;
  }
};

// Outpatients
export const getOutPatients = async () => {
  console.log('🔵 [API] GET /outpatients')
  try {
    const res = await fetch(`${BASE_URL}/outpatients`);
    const data = await res.json();
    console.log('🔵 [API] GET /outpatients response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /outpatients error:', err)
    throw err;
  }
};

// Billing
export const getBilling = async () => {
  console.log('🔵 [API] GET /billing')
  try {
    const res = await fetch(`${BASE_URL}/billing`);
    const data = await res.json();
    console.log('🔵 [API] GET /billing response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /billing error:', err)
    throw err;
  }
};

export const getBills = getBilling;

// POST Functions - Create new records
export const createPatient = async (patientData) => {
  console.log('🔵 [API] POST /patients with data:', patientData)
  const res = await fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  const data = await res.json();
  console.log('🔵 [API] POST /patients response:', data, 'Status:', res.status)
  return data;
};

export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData)
  });
  return res.json();
};

export const createAdmission = async (admissionData) => {
  const res = await fetch(`${BASE_URL}/admissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admissionData)
  });
  return res.json();
};

export const createOutPatientVisit = async (visitData) => {
  const res = await fetch(`${BASE_URL}/outpatients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData)
  });
  return res.json();
};

export const createBill = async (billData) => {
  const res = await fetch(`${BASE_URL}/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(billData)
  });
  return res.json();
};

export const createRoom = async (roomData) => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData)
  });
  return res.json();
};

// PUT Functions - Update records
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

// DELETE Functions - Delete records
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

// Rooms
export const getRooms = async () => {
  console.log('🔵 [API] GET /rooms')
  try {
    const res = await fetch(`${BASE_URL}/rooms`);
    const data = await res.json();
    console.log('🔵 [API] GET /rooms response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /rooms error:', err)
    throw err;
  }
};

// Doctors
export const getDoctors = async () => {
  console.log('🔵 [API] GET /doctors')
  try {
    const res = await fetch(`${BASE_URL}/doctors`);
    const data = await res.json();
    console.log('🔵 [API] GET /doctors response:', data)
    return data;
  } catch (err) {
    console.error('❌ [API] GET /doctors error:', err)
    throw err;
  }
};

// Dashboard
export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`);
  return res.json();
};

// Helper functions
export const getPatientName = (patients, patientId) => {
  const patient = patients.find(p => p.patient_id === patientId);
  if (!patient) return 'Unknown';
  return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
};

export const getDoctorName = (doctors, doctorId) => {
  const doctor = doctors?.find(d => d.doctor_id === doctorId);
  if (!doctor) return 'Unknown';
  return `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim();
};

export const getRoomLabel = (rooms, roomId) => {
  const room = rooms?.find(r => r.room_id === roomId);
  if (!room) return 'Unknown';
  return `${room.room_number} (${room.room_type || 'General'})`;
};
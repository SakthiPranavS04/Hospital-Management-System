import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Banner from './components/Banner.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import Patients    from './pages/Patients.jsx'
import Appointments from './pages/Appointments.jsx'
import InPatients  from './pages/InPatients.jsx'
import OutPatients from './pages/OutPatients.jsx'
import Billing     from './pages/Billing.jsx'
import Rooms       from './pages/Rooms.jsx'

export default function App() {
  const [patientModal, setPatientModal] = useState(false)
  const [appointmentModal, setAppointmentModal] = useState(false)
  const [inpatientModal, setInpatientModal] = useState(false)
  const [outpatientModal, setOutpatientModal] = useState(false)
  const [billingModal, setBillingModal] = useState(false)
  const [roomModal, setRoomModal] = useState(false)
  const [menuHovered, setMenuHovered] = useState(false)

  return (
    <BrowserRouter>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Sidebar onMenuHoverChange={setMenuHovered} />
        <Banner 
          menuHovered={menuHovered}
          onRegisterPatient={() => setPatientModal(true)}
          onNewAppointment={() => setAppointmentModal(true)}
          onNewAdmission={() => setInpatientModal(true)}
          onRecordVisit={() => setOutpatientModal(true)}
          onNewBill={() => setBillingModal(true)}
          onAddRoom={() => setRoomModal(true)}
        />
        <main style={{ flex:1, overflowY:'auto', background:'var(--bg)' }}>
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/patients"     element={<Patients patientModal={patientModal} onPatientModalClose={() => setPatientModal(false)} />} />
            <Route path="/appointments" element={<Appointments appointmentModal={appointmentModal} onAppointmentModalClose={() => setAppointmentModal(false)} />} />
            <Route path="/inpatients"   element={<InPatients inpatientModal={inpatientModal} onInpatientModalClose={() => setInpatientModal(false)} />} />
            <Route path="/outpatients"  element={<OutPatients outpatientModal={outpatientModal} onOutpatientModalClose={() => setOutpatientModal(false)} />} />
            <Route path="/billing"      element={<Billing billingModal={billingModal} onBillingModalClose={() => setBillingModal(false)} />} />
            <Route path="/rooms"        element={<Rooms roomModal={roomModal} onRoomModalClose={() => setRoomModal(false)} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

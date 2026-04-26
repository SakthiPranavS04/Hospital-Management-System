import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Banner from './components/Banner.jsx'
import Login from './pages/Login.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import Patients    from './pages/Patients.jsx'
import Appointments from './pages/Appointments.jsx'
import InPatients  from './pages/InPatients.jsx'
import OutPatients from './pages/OutPatients.jsx'
import Billing     from './pages/Billing.jsx'
import Rooms       from './pages/Rooms.jsx'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [patientModal, setPatientModal] = useState(false)
  const [appointmentModal, setAppointmentModal] = useState(false)
  const [inpatientModal, setInpatientModal] = useState(false)
  const [outpatientModal, setOutpatientModal] = useState(false)
  const [billingModal, setBillingModal] = useState(false)
  const [roomModal, setRoomModal] = useState(false)
  const [menuHovered, setMenuHovered] = useState(false)

  // Always require login on fresh page load
  // No session persistence - user must login each time they open the page

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div style={{ display:'flex', flexDirection:'column', height:'100vh', width:'100%', overflow:'hidden' }}>
        <Sidebar onMenuHoverChange={setMenuHovered} currentUser={currentUser} onLogout={handleLogout} />
        <main style={{ flex:1, overflowY:'auto', overflowX:'hidden', background:'var(--bg)', width:'100%', display:'flex', flexDirection:'column' }}>
          <Banner 
            menuHovered={menuHovered}
            onRegisterPatient={() => setPatientModal(true)}
            onNewAppointment={() => setAppointmentModal(true)}
            onNewAdmission={() => setInpatientModal(true)}
            onRecordVisit={() => setOutpatientModal(true)}
            onNewBill={() => setBillingModal(true)}
            onAddRoom={() => setRoomModal(true)}
          />
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

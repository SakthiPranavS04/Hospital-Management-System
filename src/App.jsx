import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
  return (
    <BrowserRouter>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Sidebar />
        <Banner />
        <main style={{ flex:1, overflowY:'auto', background:'var(--bg)' }}>
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/patients"     element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/inpatients"   element={<InPatients />} />
            <Route path="/outpatients"  element={<OutPatients />} />
            <Route path="/billing"      element={<Billing />} />
            <Route path="/rooms"        element={<Rooms />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

import { useState, useEffect } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { Btn, Card, Table, Modal, FormGrid, statusBadge } from '../components/UI.jsx'
import { getAppointments, getPatients, getDoctors, getDoctorName, getPatientName, createAppointment, deleteAppointment } from '../data/api.js'

export default function Appointments({ appointmentModal, onAppointmentModalClose }) {
  const [appts, setAppts] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ patientId:'', doctorId:'', date:'', time:'', reason:'', status:'Scheduled' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [apptRes, patientRes, doctorRes] = await Promise.all([getAppointments(), getPatients(), getDoctors()])
        if (apptRes.error) throw new Error(apptRes.error)
        if (patientRes.error) throw new Error(patientRes.error)
        if (doctorRes.error) throw new Error(doctorRes.error)
        setAppts(apptRes.data || [])
        setPatients(patientRes.data || [])
        setDoctors(doctorRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching appointments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = filter === 'all' ? appts : appts.filter(a => (a.status === filter))

  const save = async () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) return
    try {
      const appointmentData = {
        patient_id: +form.patientId,
        doctor_id: +form.doctorId,
        appointment_date: form.date,
        appointment_time: form.time,
        reason: form.reason,
        status: form.status
      }
      const result = await createAppointment(appointmentData)
      if (result.success || result.id) {
        const res = await getAppointments()
        setAppts(res || [])
        onAppointmentModalClose()
        setForm({ patientId:'', doctorId:'', date:'', time:'', reason:'', status:'Scheduled' })
      }
    } catch (err) {
      console.error('Error saving appointment:', err)
    }
  }

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...')
      const [apptRes, patientRes, doctorRes] = await Promise.all([getAppointments(), getPatients(), getDoctors()])
      console.log('📥 Appointments response:', apptRes)
      console.log('📥 Patients response:', patientRes)
      console.log('📥 Doctors response:', doctorRes)
      
      const apptData = apptRes?.data || apptRes || []
      const patientData = patientRes?.data || patientRes || []
      const doctorData = doctorRes?.data || doctorRes || []
      
      console.log('✅ Extracted data - Appointments:', apptData.length, 'Patients:', patientData.length, 'Doctors:', doctorData.length)
      
      setAppts(apptData)
      setPatients(patientData)
      setDoctors(doctorData)
      alert('✅ Data refreshed! New patients are now available.')
    } catch (err) {
      console.error('❌ Error refreshing data:', err)
      alert('❌ Error refreshing data: ' + err.message)
    }
  }

  const updateStatus = (id, status) => setAppts(prev => prev.map(a => a.appointment_id === id ? {...a, status} : a))

  const remove = async (id, patientName) => {
    if (!window.confirm(`Are you sure you want to remove this appointment for ${patientName}?`)) return
    try {
      const result = await deleteAppointment(id)
      if (result.success || result.message) {
        console.log('✅ Appointment deleted successfully')
        alert('✅ Appointment removed successfully!')
        const res = await getAppointments()
        setAppts(res.data || res || [])
      } else {
        alert('❌ Failed to remove appointment')
      }
    } catch (err) {
      console.error('❌ Error removing appointment:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading appointments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading appointments: {error}</p>
        </div>
      </div>
    )
  }

  const rows = filtered.map(a => {
    const pId = a.patient_id
    const dId = a.doctor_id
    const date = a.appointment_date || ''
    const id = a.appointment_id
    const pName = getPatientName(patients, pId)
    return [
      `#${id}`,
      pName,
      getDoctorName(doctors, dId),
      date,
      a.appointment_time || '—',
      a.reason || '—',
      statusBadge(a.status),
      <div style={{ display:'flex', gap:6 }}>
        {a.status === 'Scheduled' && <>
          <Btn size="sm" variant="secondary" onClick={() => updateStatus(id, 'Completed')}>✓</Btn>
          <Btn size="sm" variant="danger" onClick={() => updateStatus(id, 'Cancelled')}>✕</Btn>
        </>}
      </div>,
      <button onClick={() => remove(id, pName)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:18, padding:0 }} title="Remove appointment">-</button>,
    ]
  })

  const counts = {
    all: appts.length,
    Scheduled: appts.filter(x => x.status === 'Scheduled').length,
    Completed: appts.filter(x => x.status === 'Completed').length,
    Cancelled: appts.filter(x => x.status === 'Cancelled').length
  }

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        {/* Refresh Button */}
        <div style={{ marginBottom:18 }}>
          <Btn onClick={refreshData} variant="secondary" size="sm">🔄 Refresh Patient List</Btn>
        </div>
        
        {/* Filter tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:18 }}>
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={()=>setFilter(key)} style={{
              padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600,
              background: filter===key ? 'var(--accent)' : 'var(--bg2)',
              color: filter===key ? '#fff' : 'var(--text2)',
              border:'1px solid var(--border)',
            }}>
              {key==='all'?'All':key} ({count})
            </button>
          ))}
        </div>

        <Card>
          <Table
            headers={['ID','Patient','Doctor','Date','Time','Reason','Status','Actions','Remove']}
            rows={rows}
            emptyMsg="No appointments found"
          />
        </Card>

        <Modal open={appointmentModal} onClose={onAppointmentModalClose} title="New Appointment">
          <FormGrid>
            <div><label>Patient *</label>
              <select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})}>
                <option value="">Select patient</option>
                {patients.map(p=>{const fName = p.firstName || p.first_name; const lName = p.lastName || p.last_name; const id = p.id || p.patient_id; return <option key={id} value={id}>{fName} {lName}</option>})}
              </select>
            </div>
            <div><label>Doctor ID *</label><input type="number" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} placeholder="Enter doctor ID" /></div>
            <div><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            <div><label>Time *</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
            <div style={{ gridColumn:'1/-1' }}><label>Reason</label><input value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} /></div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onAppointmentModalClose}>Cancel</Btn>
            <Btn onClick={save}>Schedule Appointment</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

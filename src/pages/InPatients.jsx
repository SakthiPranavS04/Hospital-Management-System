import { useState, useEffect } from 'react'
import { Plus, BedDouble } from 'lucide-react'
import { Btn, Card, Table, Modal, FormGrid, FullRow, statusBadge } from '../components/UI.jsx'
import { getAdmissions, getPatients, getRooms, getDoctors, getDoctorName, getPatientName, getRoomLabel, createAdmission } from '../data/api.js'

export default function InPatients({ inpatientModal, onInpatientModalClose }) {
  const [admissions, setAdmissions] = useState([])
  const [patients, setPatients] = useState([])
  const [rooms, setRooms] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ patientId:'', doctorId:'', roomId:'', reason:'' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [admRes, patientRes, roomRes, doctorRes] = await Promise.all([
          getAdmissions(),
          getPatients(),
          getRooms(),
          getDoctors(),
        ])
        if (admRes.error) throw new Error(admRes.error)
        if (patientRes.error) throw new Error(patientRes.error)
        if (roomRes.error) throw new Error(roomRes.error)
        if (doctorRes.error) throw new Error(doctorRes.error)
        setAdmissions(admRes.data || [])
        setPatients(patientRes.data || [])
        setRooms(roomRes.data || [])
        setDoctors(doctorRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching inpatient data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const save = async () => {
    if (!form.patientId || !form.doctorId || !form.roomId) return
    try {
      const admissionData = {
        patient_id: +form.patientId,
        doctor_id: +form.doctorId,
        room_id: +form.roomId,
        reason: form.reason,
        admission_date: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
      const result = await createAdmission(admissionData)
      if (result.success || result.id) {
        const res = await getAdmissions()
        setAdmissions(res || [])
        onInpatientModalClose()
        setForm({ patientId:'', doctorId:'', roomId:'', reason:'' })
      }
    } catch (err) {
      console.error('Error saving admission:', err)
    }
  }

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...')
      const [admRes, patientRes, roomRes, doctorRes] = await Promise.all([
        getAdmissions(),
        getPatients(),
        getRooms(),
        getDoctors(),
      ])
      console.log('📥 Admissions response:', admRes)
      console.log('📥 Patients response:', patientRes)
      console.log('📥 Rooms response:', roomRes)
      console.log('📥 Doctors response:', doctorRes)
      
      const admData = admRes?.data || admRes || []
      const patientData = patientRes?.data || patientRes || []
      const roomData = roomRes?.data || roomRes || []
      const doctorData = doctorRes?.data || doctorRes || []
      
      console.log('✅ Extracted data - Admissions:', admData.length, 'Patients:', patientData.length, 'Rooms:', roomData.length, 'Doctors:', doctorData.length)
      
      setAdmissions(admData)
      setPatients(patientData)
      setRooms(roomData)
      setDoctors(doctorData)
      alert('✅ Data refreshed! New patients are now available.')
    } catch (err) {
      console.error('❌ Error refreshing data:', err)
      alert('❌ Error refreshing data: ' + err.message)
    }
  }

  const discharge = id => setAdmissions(prev => prev.map(a => (a.id === id || a.admission_id === id) ? {...a, status:'Discharged', dischargeDate:new Date().toISOString().split('T')[0]} : a))

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading in-patients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading in-patients: {error}</p>
        </div>
      </div>
    )
  }

  const rows = admissions.map(a => {
    const pId = a.patient_id
    const dId = a.doctor_id
    const rId = a.room_id
    const id = a.admission_id
    const admDate = a.admission_date || ''
    const dischDate = a.discharge_date || '—'
    return [
      `#${id}`,
      getPatientName(patients, pId),
      getDoctorName(doctors, dId),
      getRoomLabel(rooms, rId),
      admDate,
      dischDate,
      a.reason || '—',
      a.diagnosis || '—',
      statusBadge(a.status),
      a.status === 'Active'
        ? <Btn size="sm" variant="secondary" onClick={() => discharge(id)}>Discharge</Btn>
        : null
    ]
  })

  const available = rooms.filter(r => r.available)

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        {/* Refresh Button */}
        <div style={{ marginBottom:18 }}>
          <Btn onClick={refreshData} variant="secondary" size="sm">🔄 Refresh Patient List</Btn>
        </div>
        
        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:28 }}>
          {[
            { label:'Active Admissions', value:admissions.filter(a=>a.status==='Active').length,    color:'var(--accent2)' },
            { label:'Discharged',        value:admissions.filter(a=>a.status==='Discharged').length, color:'var(--accent3)' },
            { label:'Available Rooms',   value:available.length,                                     color:'var(--green)' },
          ].map(s => (
            <Card key={s.label} style={{ textAlign:'center', padding:24 }}>
              <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:13, color:'var(--text2)', marginTop:8, fontWeight:500 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <Card>
          <Table
            headers={['ID','Patient','Doctor','Room','Admitted','Discharged','Reason','Diagnosis','Status','Action']}
            rows={rows}
            emptyMsg="No admissions found"
          />
        </Card>

        <Modal open={inpatientModal} onClose={onInpatientModalClose} title="New Admission">
          <FormGrid>
            <div><label>Patient *</label>
              <select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})}>
                <option value="">Select patient</option>
                {patients.map(p=>{const fName = p.firstName || p.first_name; const lName = p.lastName || p.last_name; const id = p.id || p.patient_id; return <option key={id} value={id}>{fName} {lName}</option>})}
              </select>
            </div>
            <div><label>Doctor ID *</label><input type="number" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} placeholder="Enter doctor ID" /></div>
            <div style={{ gridColumn:'1/-1' }}><label>Room *</label>
              <select value={form.roomId} onChange={e=>setForm({...form,roomId:e.target.value})}>
                <option value="">Select room</option>
                {available.map(r=>{const rNum = r.number || r.room_number; const rType = r.type || 'General'; const rFloor = r.floor || 1; const rId = r.id || r.room_id; return <option key={rId} value={rId}>{rNum} — {rType} (Floor {rFloor})</option>})}
              </select>
            </div>
            <FullRow><label>Reason for Admission</label><textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} /></FullRow>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onInpatientModalClose}>Cancel</Btn>
            <Btn onClick={save}>Admit Patient</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

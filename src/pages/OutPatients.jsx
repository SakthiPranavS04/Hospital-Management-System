import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Btn, Card, Table, Modal, FormGrid, FullRow } from '../components/UI.jsx'
import { getOutPatients, getPatients, getDoctors, getDoctorName, getPatientName, createOutPatientVisit, deleteOutPatientVisit } from '../data/api.js'

export default function OutPatients({ outpatientModal, onOutpatientModalClose }) {
  const [visits, setVisits] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ patientId:'', doctorId:'', complaint:'', diagnosis:'', treatment:'', followUp:'' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [visRes, patientRes, doctorRes] = await Promise.all([
          getOutPatients(),
          getPatients(),
          getDoctors(),
        ])
        if (visRes.error) throw new Error(visRes.error)
        if (patientRes.error) throw new Error(patientRes.error)
        if (doctorRes.error) throw new Error(doctorRes.error)
        setVisits(visRes.data || [])
        setPatients(patientRes.data || [])
        setDoctors(doctorRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching outpatient data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const save = async () => {
    if (!form.patientId || !form.doctorId) return
    try {
      const visitData = {
        patient_id: +form.patientId,
        doctor_id: +form.doctorId,
        visit_date: new Date().toISOString().split('T')[0],
        chief_complaint: form.complaint,
        diagnosis: form.diagnosis,
        treatment_plan: form.treatment,
        follow_up_date: form.followUp
      }
      const result = await createOutPatientVisit(visitData)
      if (result.success || result.id) {
        const res = await getOutPatients()
        setVisits(res || [])
        onOutpatientModalClose()
        setForm({ patientId:'', doctorId:'', complaint:'', diagnosis:'', treatment:'', followUp:'' })
      }
    } catch (err) {
      console.error('Error saving visit:', err)
    }
  }

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...')
      const [visRes, patientRes, doctorRes] = await Promise.all([
        getOutPatients(),
        getPatients(),
        getDoctors(),
      ])
      console.log('📥 Visits response:', visRes)
      console.log('📥 Patients response:', patientRes)
      console.log('📥 Doctors response:', doctorRes)
      
      const visData = visRes?.data || visRes || []
      const patientData = patientRes?.data || patientRes || []
      const doctorData = doctorRes?.data || doctorRes || []
      
      console.log('✅ Extracted data - Visits:', visData.length, 'Patients:', patientData.length, 'Doctors:', doctorData.length)
      
      setVisits(visData)
      setPatients(patientData)
      setDoctors(doctorData)
      alert('✅ Data refreshed! New patients are now available.')
    } catch (err) {
      console.error('❌ Error refreshing data:', err)
      alert('❌ Error refreshing data: ' + err.message)
    }
  }

  const remove = async (id, patientName) => {
    if (!window.confirm(`Are you sure you want to remove this OPD visit for ${patientName}?`)) return
    try {
      const result = await deleteOutPatientVisit(id)
      if (result.success || result.message) {
        console.log('✅ OPD visit deleted successfully')
        alert('✅ OPD visit removed successfully!')
        const res = await getOutPatients()
        setVisits(res.data || res || [])
      } else {
        alert('❌ Failed to remove OPD visit')
      }
    } catch (err) {
      console.error('❌ Error removing OPD visit:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading outpatient visits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading outpatient visits: {error}</p>
        </div>
      </div>
    )
  }

  const rows = visits.map(v => {
    const pId = v.patient_id
    const dId = v.doctor_id
    const id = v.visit_id
    const date = v.visit_date || ''
    const pName = getPatientName(patients, pId)
    return [
      `#${id}`,
      pName,
      getDoctorName(doctors, dId),
      date,
      v.chief_complaint || '—',
      v.diagnosis || '—',
      v.treatment_plan || '—',
      v.follow_up_date || '—',
      <button onClick={() => remove(id, pName)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:18, padding:0 }} title="Remove OPD visit">-</button>,
    ]
  })

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
        {/* Refresh Button */}
        <div style={{ marginBottom:18 }}>
          <Btn onClick={refreshData} variant="secondary" size="sm">🔄 Refresh Patient List</Btn>
        </div>
        
        <Card>
          <Table
            headers={['ID','Patient','Doctor','Visit Date','Chief Complaint','Diagnosis','Treatment','Follow-up','Remove']}
            rows={rows}
            emptyMsg="No OPD visits recorded"
          />
        </Card>

        <Modal open={outpatientModal} onClose={onOutpatientModalClose} title="Record OPD Visit">
          <FormGrid>
            <div><label>Patient *</label>
              <select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})}>
                <option value="">Select patient</option>
                {patients.map(p=>{const fName = p.firstName || p.first_name; const lName = p.lastName || p.last_name; const id = p.id || p.patient_id; return <option key={id} value={id}>{fName} {lName}</option>})}
              </select>
            </div>
            <div><label>Doctor ID *</label><input type="number" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} placeholder="Enter doctor ID" /></div>
            <FullRow><label>Chief Complaint</label><input value={form.complaint} onChange={e=>setForm({...form,complaint:e.target.value})} /></FullRow>
            <FullRow><label>Diagnosis</label><textarea value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} style={{ minHeight:60 }} /></FullRow>
            <FullRow><label>Treatment Plan</label><textarea value={form.treatment} onChange={e=>setForm({...form,treatment:e.target.value})} style={{ minHeight:60 }} /></FullRow>
            <div><label>Follow-up Date</label><input type="date" value={form.followUp} onChange={e=>setForm({...form,followUp:e.target.value})} /></div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onOutpatientModalClose}>Cancel</Btn>
            <Btn onClick={save}>Save Visit</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

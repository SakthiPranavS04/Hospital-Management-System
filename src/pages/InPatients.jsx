import { useState } from 'react'
import { Plus, BedDouble } from 'lucide-react'
import { PageHeader, Btn, Card, Table, Modal, FormGrid, FullRow, statusBadge } from '../components/UI.jsx'
import { admissions as initAdmissions, patients, doctors, rooms, doctorName, patientName, roomLabel } from '../data/mockData.js'

export default function InPatients({ inpatientModal, onInpatientModalClose }) {
  const [admissions, setAdmissions] = useState(initAdmissions)
  const [form, setForm] = useState({ patientId:'', doctorId:'', roomId:'', reason:'' })

  const save = () => {
    if (!form.patientId || !form.doctorId || !form.roomId) return
    setAdmissions(prev => [...prev, {
      ...form, id:Date.now(),
      patientId:+form.patientId, doctorId:+form.doctorId, roomId:+form.roomId,
      admissionDate:new Date().toISOString().split('T')[0],
      status:'Active', diagnosis:'Pending'
    }])
    onInpatientModalClose()
    setForm({ patientId:'', doctorId:'', roomId:'', reason:'' })
  }

  const discharge = id => setAdmissions(prev => prev.map(a => a.id===id ? {...a, status:'Discharged', dischargeDate:new Date().toISOString().split('T')[0]} : a))

  const rows = admissions.map(a => [
    `#${a.id}`,
    patientName(a.patientId),
    doctorName(a.doctorId),
    roomLabel(a.roomId),
    a.admissionDate,
    a.dischargeDate || '—',
    a.reason || '—',
    a.diagnosis,
    statusBadge(a.status),
    a.status==='Active'
      ? <Btn size="sm" variant="secondary" onClick={()=>discharge(a.id)}>Discharge</Btn>
      : null
  ])

  const available = rooms.filter(r => r.available)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
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
                {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div><label>Doctor *</label>
              <select value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})}>
                <option value="">Select doctor</option>
                {doctors.map(d=><option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1' }}><label>Room *</label>
              <select value={form.roomId} onChange={e=>setForm({...form,roomId:e.target.value})}>
                <option value="">Select room</option>
                {available.map(r=><option key={r.id} value={r.id}>{r.number} — {r.type} (Floor {r.floor})</option>)}
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

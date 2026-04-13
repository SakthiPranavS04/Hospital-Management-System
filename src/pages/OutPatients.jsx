import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader, Btn, Card, Table, Modal, FormGrid, FullRow } from '../components/UI.jsx'
import { outPatientVisits as initVisits, patients, doctors, appointments, doctorName, patientName } from '../data/mockData.js'

export default function OutPatients() {
  const [visits, setVisits] = useState(initVisits)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ patientId:'', doctorId:'', complaint:'', diagnosis:'', treatment:'', followUp:'' })

  const save = () => {
    if (!form.patientId || !form.doctorId) return
    setVisits(prev => [...prev, {
      ...form, id:Date.now(),
      patientId:+form.patientId, doctorId:+form.doctorId,
      date:new Date().toISOString().split('T')[0],
    }])
    setModal(false)
    setForm({ patientId:'', doctorId:'', complaint:'', diagnosis:'', treatment:'', followUp:'' })
  }

  const rows = visits.map(v => [
    `#${v.id}`,
    patientName(v.patientId),
    doctorName(v.doctorId),
    v.date,
    v.complaint || '—',
    v.diagnosis || '—',
    v.treatment || '—',
    v.followUp || '—',
  ])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40, position:'relative' }}>
        {/* Action Button */}
        <div style={{ marginBottom:20 }}>
          <Btn onClick={()=>setModal(true)} style={{ whiteSpace:'nowrap' }}><Plus size={14}/> Record Visit</Btn>
        </div>
        <Card>
          <Table
            headers={['ID','Patient','Doctor','Visit Date','Chief Complaint','Diagnosis','Treatment','Follow-up']}
            rows={rows}
            emptyMsg="No OPD visits recorded"
          />
        </Card>

        <Modal open={modal} onClose={()=>setModal(false)} title="Record OPD Visit">
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
                {doctors.map(d=><option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.spec})</option>)}
              </select>
            </div>
            <FullRow><label>Chief Complaint</label><input value={form.complaint} onChange={e=>setForm({...form,complaint:e.target.value})} /></FullRow>
            <FullRow><label>Diagnosis</label><textarea value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} style={{ minHeight:60 }} /></FullRow>
            <FullRow><label>Treatment Plan</label><textarea value={form.treatment} onChange={e=>setForm({...form,treatment:e.target.value})} style={{ minHeight:60 }} /></FullRow>
            <div><label>Follow-up Date</label><input type="date" value={form.followUp} onChange={e=>setForm({...form,followUp:e.target.value})} /></div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Visit</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

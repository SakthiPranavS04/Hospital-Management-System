import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { PageHeader, Btn, Card, Table, Modal, FormGrid, statusBadge } from '../components/UI.jsx'
import { appointments as initAppts, patients, doctors, doctorName, patientName } from '../data/mockData.js'

export default function Appointments() {
  const [appts, setAppts] = useState(initAppts)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ patientId:'', doctorId:'', date:'', time:'', reason:'', status:'Scheduled' })

  const filtered = filter==='all' ? appts : appts.filter(a=>a.status===filter)

  const save = () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) return
    setAppts(prev => [...prev, { ...form, id:Date.now(), patientId:+form.patientId, doctorId:+form.doctorId }])
    setModal(false)
    setForm({ patientId:'', doctorId:'', date:'', time:'', reason:'', status:'Scheduled' })
  }

  const updateStatus = (id, status) => setAppts(prev => prev.map(a => a.id===id ? {...a, status} : a))

  const rows = filtered.map(a => [
    `#${a.id}`,
    patientName(a.patientId),
    doctorName(a.doctorId),
    a.date,
    a.time,
    a.reason || '—',
    statusBadge(a.status),
    <div style={{ display:'flex', gap:6 }}>
      {a.status==='Scheduled' && <>
        <Btn size="sm" variant="secondary" onClick={()=>updateStatus(a.id,'Completed')}>✓</Btn>
        <Btn size="sm" variant="danger"    onClick={()=>updateStatus(a.id,'Cancelled')}>✕</Btn>
      </>}
    </div>
  ])

  const counts = { all:appts.length, Scheduled:appts.filter(x=>x.status==='Scheduled').length, Completed:appts.filter(x=>x.status==='Completed').length, Cancelled:appts.filter(x=>x.status==='Cancelled').length }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40, position:'relative' }}>
        {/* Action Button */}
        <div style={{ marginBottom:20 }}>
          <Btn onClick={()=>setModal(true)} style={{ whiteSpace:'nowrap' }}><Plus size={14}/> New Appointment</Btn>
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
            headers={['ID','Patient','Doctor','Date','Time','Reason','Status','Actions']}
            rows={rows}
            emptyMsg="No appointments found"
          />
        </Card>

        <Modal open={modal} onClose={()=>setModal(false)} title="New Appointment">
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
            <div><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            <div><label>Time *</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
            <div style={{ gridColumn:'1/-1' }}><label>Reason</label><input value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} /></div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Schedule Appointment</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

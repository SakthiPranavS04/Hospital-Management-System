import { useState } from 'react'
import { Plus, Search, User } from 'lucide-react'
import { PageHeader, Btn, Card, Badge, Table, Modal, FormGrid, FullRow, statusBadge } from '../components/UI.jsx'
import { patients as initPatients } from '../data/mockData.js'

export default function Patients({ patientModal, onPatientModalClose }) {
  const [patients, setPatients] = useState(initPatients)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ firstName:'',lastName:'',dob:'',gender:'Male',blood:'O+',contact:'',email:'',address:'' })

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.contact} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const save = () => {
    if (!form.firstName || !form.lastName) return
    setPatients(prev => [...prev, { ...form, id: Date.now(), registeredAt: new Date().toISOString().split('T')[0] }])
    onPatientModalClose()
    setForm({ firstName:'',lastName:'',dob:'',gender:'Male',blood:'O+',contact:'',email:'',address:'' })
  }

  const rows = filtered.map(p => [
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:32, height:32, borderRadius:8, background:'rgba(79,142,247,.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <User size={14} color="var(--accent)" />
      </div>
      <div>
        <div style={{ fontWeight:600 }}>{p.firstName} {p.lastName}</div>
        <div style={{ fontSize:11, color:'var(--text3)' }}>ID #{p.id}</div>
      </div>
    </div>,
    <>{p.dob} <span style={{ color:'var(--text3)', fontSize:11 }}>({new Date().getFullYear()-new Date(p.dob).getFullYear()} yrs)</span></>,
    p.gender,
    <Badge type="info">{p.blood}</Badge>,
    p.contact,
    p.email,
    p.registeredAt,
  ])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40, position:'relative' }}>
        <Card style={{ marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 14px' }}>
            <Search size={14} color="var(--text3)" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, contact, email..." style={{ background:'none', border:'none', flex:1, padding:0, fontSize:13 }} />
          </div>
        </Card>

        <Card>
          <Table
            headers={['Patient','Date of Birth','Gender','Blood','Contact','Email','Registered']}
            rows={rows}
            emptyMsg="No patients found"
          />
        </Card>

        <Modal open={patientModal} onClose={onPatientModalClose} title="Register New Patient">
          <FormGrid>
            <div><label>First Name *</label><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></div>
            <div><label>Last Name *</label><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></div>
            <div><label>Date of Birth</label><input type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} /></div>
            <div><label>Gender</label>
              <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><label>Blood Group</label>
              <select value={form.blood} onChange={e=>setForm({...form,blood:e.target.value})}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div><label>Contact Number</label><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} /></div>
            <div><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <FullRow><label>Address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} style={{ minHeight:60 }} /></FullRow>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onPatientModalClose}>Cancel</Btn>
            <Btn onClick={save}>Register Patient</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

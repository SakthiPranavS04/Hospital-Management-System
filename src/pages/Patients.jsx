import { useState, useEffect } from 'react'
import { Plus, Search, User, Trash2 } from 'lucide-react'
import { Btn, Card, Badge, Table, Modal, FormGrid, FullRow, statusBadge } from '../components/UI.jsx'
import { getPatients, createPatient, deletePatient } from '../data/api.js'

export default function Patients({ patientModal, onPatientModalClose }) {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ firstName:'',lastName:'',dob:'',gender:'Male',blood:'O+',contact:'',email:'',address:'' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await getPatients()
        if (res.error) throw new Error(res.error)
        setPatients(res.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching patients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = patients.filter(p => {
    const fName = p.first_name || ''
    const lName = p.last_name || ''
    const contact = p.contact_number || ''
    const email = p.email || ''
    return `${fName} ${lName} ${contact} ${email}`.toLowerCase().includes(search.toLowerCase())
  })

  const save = async () => {
    if (!form.firstName || !form.lastName) {
      alert('Please enter First Name and Last Name')
      return
    }
    try {
      const patientData = {
        first_name: form.firstName,
        last_name: form.lastName,
        date_of_birth: form.dob,
        gender: form.gender,
        blood_type: form.blood,
        contact: form.contact,
        email: form.email,
        address: form.address
      }
      console.log('📤 Sending patient data:', patientData)
      const result = await createPatient(patientData)
      console.log('📥 Response from server:', result)
      
      if (result.success || result.id) {
        console.log('✅ Patient created successfully with ID:', result.id)
        alert(`✅ Patient registered successfully!`)
        const res = await getPatients()
        console.log('📋 Updated patient list:', res)
        setPatients(res.data || res || [])
        onPatientModalClose()
        setForm({ firstName:'',lastName:'',dob:'',gender:'Male',blood:'O+',contact:'',email:'',address:'' })
      } else if (result.error) {
        console.error('❌ Server error:', result.error)
        alert(`❌ Error: ${result.error}`)
      } else {
        console.error('❌ Unexpected response:', result)
        alert('❌ Failed to register patient')
      }
    } catch (err) {
      console.error('❌ Error saving patient:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  const remove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove patient "${name}"?`)) return
    try {
      const result = await deletePatient(id)
      if (result.success || result.message) {
        console.log('✅ Patient deleted successfully')
        alert('✅ Patient removed successfully!')
        const res = await getPatients()
        setPatients(res.data || res || [])
      } else {
        alert('❌ Failed to remove patient')
      }
    } catch (err) {
      console.error('❌ Error removing patient:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading patients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading patients: {error}</p>
        </div>
      </div>
    )
  }

  const rows = filtered.map(p => {
    const fName = p.first_name || ''
    const lName = p.last_name || ''
    const dob = p.date_of_birth || ''
    const id = p.patient_id
    const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 0
    return [
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'rgba(79,142,247,.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <User size={14} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontWeight:600 }}>{fName} {lName}</div>
          <div style={{ fontSize:11, color:'var(--text3)' }}>ID #{id}</div>
        </div>
      </div>,
      <>{dob} <span style={{ color:'var(--text3)', fontSize:11 }}>({age} yrs)</span></>,
      p.gender || '—',
      <Badge type="info">{p.blood_group || '—'}</Badge>,
      p.contact_number || '—',
      p.email || '—',
      p.registered_at || '—',
      <button onClick={() => remove(id, `${fName} ${lName}`)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:18, padding:0 }} title="Remove patient">-</button>,
    ]
  })

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        <Card style={{ marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 14px' }}>
            <Search size={14} color="var(--text3)" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, contact, email..." style={{ background:'none', border:'none', flex:1, padding:0, fontSize:13 }} />
          </div>
        </Card>

        <Card>
          <Table
            headers={['Patient','Date of Birth','Gender','Blood','Contact','Email','Registered','Remove']}
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

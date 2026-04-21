import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { Card, Btn, Modal, FormGrid, statusBadge } from '../components/UI.jsx'
import { getRooms, getAdmissions, getPatients, getDoctors, getDoctorName, getPatientName, createRoom, deleteRoom } from '../data/api.js'

export default function Rooms({ roomModal, onRoomModalClose }) {
  const [rooms, setRooms] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ number:'', floor:'', type:'General', dept:'', available:true })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [roomRes, admRes, patientRes, doctorRes] = await Promise.all([
          getRooms(),
          getAdmissions(),
          getPatients(),
          getDoctors(),
        ])
        if (roomRes.error) throw new Error(roomRes.error)
        if (admRes.error) throw new Error(admRes.error)
        if (patientRes.error) throw new Error(patientRes.error)
        if (doctorRes.error) throw new Error(doctorRes.error)
        setRooms(roomRes.data || [])
        setAdmissions(admRes.data || [])
        setPatients(patientRes.data || [])
        setDoctors(doctorRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching rooms:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeAdmissions = admissions.filter(a => a.status === 'Active')
  const getAdmission = roomId => activeAdmissions.find(a => a.room_id === roomId)

  const typeColor = { ICU:'var(--red)', Private:'var(--accent2)', General:'var(--accent)', 'Semi-Private':'var(--amber)', Emergency:'var(--red)' }

  const save = async () => {
    if (!form.number || !form.floor || !form.dept) return
    try {
      const roomData = {
        room_number: form.number,
        floor: +form.floor,
        room_type: form.type,
        department_id: form.dept,
        is_available: true
      }
      const result = await createRoom(roomData)
      if (result.success || result.id) {
        const res = await getRooms()
        setRooms(res || [])
        onRoomModalClose()
        setForm({ number:'', floor:'', type:'General', dept:'', available:true })
      }
    } catch (err) {
      console.error('Error saving room:', err)
    }
  }

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...')
      const [roomRes, admRes, patientRes, doctorRes] = await Promise.all([
        getRooms(),
        getAdmissions(),
        getPatients(),
        getDoctors(),
      ])
      console.log('📥 Rooms response:', roomRes)
      console.log('📥 Admissions response:', admRes)
      console.log('📥 Patients response:', patientRes)
      console.log('📥 Doctors response:', doctorRes)
      
      const roomData = roomRes?.data || roomRes || []
      const admData = admRes?.data || admRes || []
      const patientData = patientRes?.data || patientRes || []
      const doctorData = doctorRes?.data || doctorRes || []
      
      console.log('✅ Extracted data - Rooms:', roomData.length, 'Admissions:', admData.length, 'Patients:', patientData.length, 'Doctors:', doctorData.length)
      
      setRooms(roomData)
      setAdmissions(admData)
      setPatients(patientData)
      setDoctors(doctorData)
      alert('✅ Data refreshed! New patients are now available.')
    } catch (err) {
      console.error('❌ Error refreshing data:', err)
      alert('❌ Error refreshing data: ' + err.message)
    }
  }

  const remove = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to remove room ${roomNumber}?`)) return
    try {
      const result = await deleteRoom(id)
      if (result.success || result.message) {
        console.log('✅ Room deleted successfully')
        alert('✅ Room removed successfully!')
        const res = await getRooms()
        setRooms(res.data || res || [])
      } else {
        alert('❌ Failed to remove room')
      }
    } catch (err) {
      console.error('❌ Error removing room:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading rooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>

      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        {/* Refresh Button */}
        <div style={{ marginBottom:18 }}>
          <Btn onClick={refreshData} variant="secondary" size="sm">🔄 Refresh Patient List</Btn>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40 }}>
          {[
            { label:'Total Rooms',     value:rooms.length,                        color:'var(--accent)' },
            { label:'Available',       value:rooms.filter(r => r.available).length,  color:'var(--green)' },
            { label:'Occupied',        value:rooms.filter(r => !r.available).length, color:'var(--red)' },
          ].map(s => (
            <Card key={s.label} style={{ textAlign:'center', padding:24, cursor:'pointer', transition:'all 0.3s' }}>
              <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:13, color:'var(--text2)', marginTop:8, fontWeight:500 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Rooms Grid - 3x3 Layout */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40 }}>
          {rooms.map(r => {
            const admission = getAdmission(r.room_id)
            const available = r.is_available
            return (
              <div key={r.room_id} style={{
                background:'var(--bg2)',
                border:`1px solid var(--border)`,
                borderRadius:'var(--card-r)', 
                padding:'clamp(14px, 3vw, 20px)', 
                position:'relative', 
                overflow:'hidden',
                transition:'all 0.3s ease',
                cursor:'pointer',
                boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
              }} 
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
                {/* Top color strip */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: available ? 'var(--green)' : 'var(--red)' }} />

                {/* Room Number and Type */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, paddingTop:4 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'clamp(16px, 4vw, 18px)', color:'var(--text)' }}>{r.room_number}</div>
                    <div style={{ fontSize:'clamp(10px, 2vw, 11px)', color:'var(--text3)', marginTop:3 }}>Floor {r.floor}</div>
                  </div>
                  <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:'clamp(10px, 1.5vw, 11px)', fontWeight:600,
                      background: `${typeColor[r.room_type] || 'var(--accent)'}20`, color: typeColor[r.room_type] || 'var(--accent)' }}>
                      {r.room_type}
                    </span>
                    <button onClick={() => remove(r.room_id, r.room_number)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:16, padding:0 }} title="Remove room">-</button>
                  </div>
                </div>

                {/* Department */}
                <div style={{ fontSize:'clamp(11px, 2vw, 12px)', color:'var(--text2)', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}>
                  <Building2 size={13} />
                  <span>{r.department_id || '—'}</span>
                </div>

                {/* Availability Status */}
                <div style={{ padding:'8px 12px', background: available ? 'rgba(61,214,140,0.1)' : 'rgba(240,92,110,0.1)', borderRadius:8, display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: available ? 'var(--green)' : 'var(--red)' }} />
                  <span style={{ fontSize:'clamp(11px, 2vw, 12px)', fontWeight:600, color: available ? 'var(--green)' : 'var(--red)' }}>
                    {available ? 'Available' : 'Occupied'}
                  </span>
                </div>

                {/* Patient Info if Occupied */}
                {admission && (
                  <div style={{ marginTop:12, padding:'12px', background:'var(--bg3)', borderRadius:8, fontSize:'clamp(11px, 2vw, 12px)', borderLeft:`3px solid var(--accent)` }}>
                    <div style={{ fontWeight:600, color:'var(--text)', marginBottom:4 }}>{getPatientName(patients, admission.patient_id)}</div>
                    <div style={{ color:'var(--text3)', fontSize:'clamp(10px, 1.5vw, 11px)', marginBottom:2 }}>{getDoctorName(doctors, admission.doctor_id)}</div>
                    <div style={{ color:'var(--text3)', fontSize:'clamp(10px, 1.5vw, 11px)' }}>Since: {admission.admission_date}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add Room Modal */}
        <Modal open={roomModal} onClose={onRoomModalClose} title="Add New Room">
          <FormGrid>
            <div><label>Room Number *</label><input value={form.number} onChange={e => setForm({...form, number:e.target.value})} placeholder="e.g., 101" /></div>
            <div><label>Floor *</label><input type="number" value={form.floor} onChange={e => setForm({...form, floor:e.target.value})} placeholder="e.g., 1" /></div>
            <div><label>Room Type *</label>
              <select value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                <option>General</option>
                <option>Semi-Private</option>
                <option>Private</option>
                <option>ICU</option>
                <option>Emergency</option>
              </select>
            </div>
            <div><label>Department</label><input value={form.dept} onChange={e => setForm({...form, dept:e.target.value})} placeholder="e.g., Cardiology" /></div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onRoomModalClose}>Cancel</Btn>
            <Btn onClick={save}>Add Room</Btn>
          </div>
        </Modal>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Card, Btn, Modal, FormGrid, statusBadge } from '../components/UI.jsx'
import { rooms as initRooms, departments, admissions, deptName, patientName, doctorName } from '../data/mockData.js'

export default function Rooms({ roomModal, onRoomModalClose }) {
  const [rooms, setRooms] = useState(initRooms)
  const [form, setForm] = useState({ number:'', floor:'', type:'General', dept:'', available:true })

  const activeAdmissions = admissions.filter(a=>a.status==='Active')
  const getAdmission = roomId => activeAdmissions.find(a=>a.roomId===roomId)

  const typeColor = { ICU:'var(--red)', Private:'var(--accent2)', General:'var(--accent)', 'Semi-Private':'var(--amber)', Emergency:'var(--red)' }

  const save = () => {
    if (!form.number || !form.floor || !form.dept) return
    setRooms(prev => [...prev, {
      ...form, id: Date.now(),
      floor: +form.floor,
      available: true
    }])
    onRoomModalClose()
    setForm({ number:'', floor:'', type:'General', dept:'', available:true })
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        {/* Stats Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40 }}>
          {[
            { label:'Total Rooms',     value:rooms.length,                        color:'var(--accent)' },
            { label:'Available',       value:rooms.filter(r=>r.available).length,  color:'var(--green)' },
            { label:'Occupied',        value:rooms.filter(r=>!r.available).length, color:'var(--red)' },
          ].map(s=>(
            <Card key={s.label} style={{ textAlign:'center', padding:24, cursor:'pointer', transition:'all 0.3s' }}>
              <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:13, color:'var(--text2)', marginTop:8, fontWeight:500 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Rooms Grid - 3x3 Layout */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40 }}>
          {rooms.map(r => {
            const admission = getAdmission(r.id)
            const available = r.available
            return (
              <div key={r.id} style={{
                background:'var(--bg2)',
                border:`1px solid var(--border)`,
                borderRadius:'var(--card-r)', 
                padding:'clamp(14px, 3vw, 20px)', 
                position:'relative', 
                overflow:'hidden',
                transition:'all 0.3s ease',
                cursor:'pointer',
                boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
                hover: {
                  boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
                  transform:'translateY(-2px)'
                }
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
                    <div style={{ fontWeight:700, fontSize:'clamp(16px, 4vw, 18px)', color:'var(--text)' }}>{r.number}</div>
                    <div style={{ fontSize:'clamp(10px, 2vw, 11px)', color:'var(--text3)', marginTop:3 }}>Floor {r.floor}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:'clamp(10px, 1.5vw, 11px)', fontWeight:600,
                      background: `${typeColor[r.type] || 'var(--accent)'}20`, color: typeColor[r.type] || 'var(--accent)' }}>
                      {r.type}
                    </span>
                  </div>
                </div>

                {/* Department */}
                <div style={{ fontSize:'clamp(11px, 2vw, 12px)', color:'var(--text2)', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}>
                  <Building2 size={13} />
                  <span>{deptName(r.dept)}</span>
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
                    <div style={{ fontWeight:600, color:'var(--text)', marginBottom:4 }}>{patientName(admission.patientId)}</div>
                    <div style={{ color:'var(--text3)', fontSize:'clamp(10px, 1.5vw, 11px)', marginBottom:2 }}>{doctorName(admission.doctorId)}</div>
                    <div style={{ color:'var(--text3)', fontSize:'clamp(10px, 1.5vw, 11px)' }}>Since: {admission.admissionDate}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add Room Modal */}
        <Modal open={roomModal} onClose={onRoomModalClose} title="Add New Room">
          <FormGrid>
            <div><label>Room Number *</label><input value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="e.g., 101" /></div>
            <div><label>Floor *</label><input type="number" value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})} placeholder="e.g., 1" /></div>
            <div><label>Room Type *</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option>General</option>
                <option>Semi-Private</option>
                <option>Private</option>
                <option>ICU</option>
                <option>Emergency</option>
              </select>
            </div>
            <div><label>Department *</label>
              <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})}>
                <option value="">Select department</option>
                {departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
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

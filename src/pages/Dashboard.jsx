import { useState, useEffect } from 'react'
import { Users, CalendarDays, BedDouble, Stethoscope, Receipt, Building2 } from 'lucide-react'
import { StatCard, Card, statusBadge } from '../components/UI.jsx'
import { getPatients, getAppointments, getAdmissions, getOutPatients, getBills, getRooms, getDoctors, getDoctorName, getPatientName, getRoomLabel } from '../data/api.js'
import { formatDate } from '../utils/formatters.js'

export default function Dashboard() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [outPatientVisits, setOutPatientVisits] = useState([])
  const [bills, setBills] = useState([])
  const [rooms, setRooms] = useState([])
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pRes, aRes, admRes, opRes, bRes, rRes, dRes] = await Promise.all([
          getPatients(),
          getAppointments(),
          getAdmissions(),
          getOutPatients(),
          getBills(),
          getRooms(),
          getDoctors(),
        ])

        if (pRes.error) throw new Error(pRes.error)
        if (aRes.error) throw new Error(aRes.error)
        if (admRes.error) throw new Error(admRes.error)
        if (opRes.error) throw new Error(opRes.error)
        if (bRes.error) throw new Error(bRes.error)
        if (rRes.error) throw new Error(rRes.error)
        if (dRes.error) throw new Error(dRes.error)

        setPatients(pRes.data || [])
        setAppointments(aRes.data || [])
        setAdmissions(admRes.data || [])
        setOutPatientVisits(opRes.data || [])
        setBills(bRes.data || [])
        setRooms(rRes.data || [])
        setDoctors(dRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)', paddingTop:40, paddingBottom:40 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)', paddingTop:40, paddingBottom:40 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading dashboard: {error}</p>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => {
    const apptDate = (a.date || a.appointment_date || '').split('T')[0]
    return apptDate === today
  })
  const activeAdmissions = admissions.filter(a => a.status === 'Active')
  const pendingBills = bills.filter(b => b.payment_status !== 'Paid' && b.status !== 'Paid')
  const availableRooms = rooms.filter(r => r.is_available === true)

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ 
        maxWidth:1200, 
        margin:'0 auto', 
        paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, 
        paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, 
        paddingTop: window.innerWidth < 480 ? 24 : 40, 
        paddingBottom: window.innerWidth < 480 ? 24 : 40 
      }}>
        {/* Stats Row */}
        <div style={{ 
          display:'grid', 
          gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
          gap: window.innerWidth < 480 ? 16 : 20, 
          marginBottom: window.innerWidth < 480 ? 24 : 40 
        }}>
          <StatCard label="Total Patients"       value={patients.length}        icon={Users}       color="var(--accent)"  />
          <StatCard label="Today's Appointments" value={todayAppts.length}      icon={CalendarDays} color="var(--accent3)" />
          <StatCard label="Active Admissions"    value={activeAdmissions.length} icon={BedDouble}   color="var(--accent2)" />
        </div>

        {/* Second Row Stats */}
        <div style={{ 
          display:'grid', 
          gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
          gap: window.innerWidth < 480 ? 16 : 20, 
          marginBottom: window.innerWidth < 480 ? 24 : 40 
        }}>
          <StatCard label="OPD Visits"           value={outPatientVisits.length} icon={Stethoscope} color="var(--amber)"   />
          <StatCard label="Pending Bills"        value={pendingBills.length}    icon={Receipt}     color="var(--red)"     />
          <StatCard label="Available Rooms"      value={availableRooms.length}  icon={Building2}   color="var(--green)"   />
        </div>

        {/* Cards - One by One Layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:20 }}>
          {/* Today's appointments */}
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <CalendarDays size={15} color="var(--accent3)" />
              <span style={{ fontWeight:600, fontSize:14 }}>Today's Appointments</span>
              <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text3)' }}>{today}</span>
            </div>
            {todayAppts.length === 0
              ? <p style={{ color:'var(--text3)', fontSize:13 }}>No appointments today</p>
              : todayAppts.map(a => (
                <div key={a.id || a.appointment_id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:'rgba(79,142,247,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'var(--accent)' }}>
                    {a.time || a.appointment_time}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13 }}>{getPatientName(patients, a.patientId || a.patient_id)}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>{getDoctorName([], a.doctorId || a.doctor_id)} · {a.reason}</div>
                  </div>
                  {statusBadge(a.status)}
                </div>
              ))
            }
          </Card>

          {/* Active admissions */}
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <BedDouble size={15} color="var(--accent2)" />
              <span style={{ fontWeight:600, fontSize:14 }}>Active In-Patients</span>
            </div>
            {activeAdmissions.slice(0, 3).map(a => (
              <div key={a.id || a.admission_id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:38, height:38, borderRadius:9, background:'rgba(123,92,240,.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <BedDouble size={16} color="var(--accent2)" />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{getPatientName(patients, a.patientId || a.patient_id)}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>{getRoomLabel(rooms, a.roomId || a.room_id)} · {getDoctorName([], a.doctorId || a.doctor_id)}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>{a.reason}</div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </Card>

          {/* Room status */}
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <Building2 size={15} color="var(--green)" />
              <span style={{ fontWeight:600, fontSize:14 }}>Room Occupancy</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {rooms.slice(0, 9).map(r => (
                <div key={r.id || r.room_id} style={{
                  padding:'10px 12px', borderRadius:10,
                  background: r.available ? 'rgba(61,214,140,.07)' : 'rgba(240,92,110,.07)',
                  border: `1px solid ${r.available ? 'rgba(61,214,140,.2)' : 'rgba(240,92,110,.2)'}`,
                }}>
                  <div style={{ fontWeight:700, fontSize:13, color: r.available ? 'var(--green)' : 'var(--red)' }}>{r.number || r.room_number}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{r.type}</div>
                  <div style={{ fontSize:10, marginTop:3, color: r.available ? 'var(--green)' : 'var(--red)' }}>
                    {r.available ? '✓ Free' : '● Occupied'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Billing summary */}
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <Receipt size={15} color="var(--amber)" />
              <span style={{ fontWeight:600, fontSize:14 }}>Billing Overview</span>
            </div>
            {bills.slice(0, 4).map(b => (
              <div key={b.id || b.bill_id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{getPatientName(patients, b.patientId || b.patient_id)}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>Total: ₹{(b.total || 0).toLocaleString()} · Paid: ₹{(b.paid || 0).toLocaleString()}</div>
                </div>
                {statusBadge(b.status)}
              </div>
            ))}
          </Card>

          {/* Doctors Section */}
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <Stethoscope size={15} color="var(--accent)" />
              <span style={{ fontWeight:600, fontSize:14 }}>Medical Staff Directory</span>
              <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text3)', background:'var(--bg2)', padding:'3px 8px', borderRadius:6 }}>{doctors.length} doctors</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {doctors.length === 0 ? (
                <p style={{ color:'var(--text3)', fontSize:13 }}>No doctors found</p>
              ) : (
                doctors.map(d => (
                  <div
                    key={d.doctor_id}
                    onClick={() => setSelectedDoctor(d)}
                    style={{
                      padding:12,
                      background:'var(--bg2)',
                      border:'1px solid var(--border)',
                      borderRadius:'var(--card-r)',
                      cursor:'pointer',
                      transition:'all 0.3s',
                      display:'flex',
                      justifyContent:'space-between',
                      alignItems:'center'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'var(--bg3)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'var(--bg2)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:'var(--text)' }}>Dr. {d.first_name} {d.last_name}</div>
                      <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{d.specialization}</div>
                    </div>
                    <div style={{ fontSize:10, color:'var(--accent)', fontWeight:600, background:'rgba(79,142,247,.1)', padding:'4px 10px', borderRadius:5 }}>View</div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Doctor Detail Modal */}
          {selectedDoctor && (
            <div style={{
              position:'fixed',
              top:0,
              left:0,
              right:0,
              bottom:0,
              background:'rgba(0,0,0,0.3)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              zIndex:1000,
              padding:16
            }}
            onClick={() => setSelectedDoctor(null)}
            >
              <div style={{
                background:'var(--bg2)',
                border:'1px solid var(--border)',
                borderRadius:'var(--card-r)',
                padding:24,
                maxWidth:500,
                width:'100%',
                boxShadow:'0 10px 40px rgba(0,0,0,0.2)',
                position:'relative'
              }}
              onClick={e => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedDoctor(null)}
                  style={{
                    position:'absolute',
                    top:16,
                    right:16,
                    background:'none',
                    border:'none',
                    fontSize:24,
                    color:'var(--text2)',
                    cursor:'pointer',
                    padding:0,
                    width:32,
                    height:32,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    borderRadius:6,
                    transition:'all 0.2s'
                  }}
                  onMouseOver={e => {
                    e.target.style.background = 'var(--bg3)'
                    e.target.style.color = 'var(--text)'
                  }}
                  onMouseOut={e => {
                    e.target.style.background = 'none'
                    e.target.style.color = 'var(--text2)'
                  }}
                >
                  ✕
                </button>

                {/* Doctor Header */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:24, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</div>
                  <div style={{ fontSize:14, color:'var(--accent)', fontWeight:600, display:'inline-block', background:'rgba(79,142,247,.1)', padding:'4px 12px', borderRadius:6 }}>
                    {selectedDoctor.specialization}
                  </div>
                </div>

                {/* Details */}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {/* Department */}
                  <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:12 }}>
                    <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:6 }}>DEPARTMENT</div>
                    <div style={{ fontSize:13, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
                      <Building2 size={14} color="var(--accent2)" />
                      {selectedDoctor.department_name || 'N/A'}
                    </div>
                  </div>

                  {/* Qualification */}
                  <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:12 }}>
                    <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:6 }}>QUALIFICATION</div>
                    <div style={{ fontSize:13, color:'var(--text)' }}>{selectedDoctor.qualification || 'N/A'}</div>
                  </div>

                  {/* Contact Number */}
                  <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:12 }}>
                    <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:6 }}>CONTACT NUMBER</div>
                    <div style={{ fontSize:13, color:'var(--text)' }}>{selectedDoctor.contact_number || '—'}</div>
                  </div>

                  {/* Email */}
                  <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:12 }}>
                    <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:6 }}>EMAIL</div>
                    <div style={{ fontSize:13, color:'var(--text)', wordBreak:'break-all' }}>{selectedDoctor.email || '—'}</div>
                  </div>

                  {/* Statistics */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, paddingTop:8 }}>
                    <div style={{ textAlign:'center', padding:12, background:'var(--bg3)', borderRadius:8 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:'var(--accent)' }}>{selectedDoctor.total_appointments || 0}</div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>Total Appointments</div>
                    </div>
                    <div style={{ textAlign:'center', padding:12, background:'var(--bg3)', borderRadius:8 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:'var(--accent2)' }}>{selectedDoctor.total_admissions || 0}</div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>Total Admissions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

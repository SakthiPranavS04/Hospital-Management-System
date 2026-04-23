import { useState, useEffect, useCallback } from 'react'
import {
  X, User, Droplets, BedDouble, Activity, FileText,
  CreditCard, Stethoscope, Phone, Mail, MapPin,
  Calendar, Clock, Building2, CheckCircle, AlertCircle, XCircle,
} from 'lucide-react'
import { getAdmissions, getOutPatients, getBilling, getAppointments, getDoctors, getRooms } from '../data/api.js'
import { Badge } from './UI.jsx'

// ── Pill tab bar ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'info',         label: 'Personal Info',  icon: User        },
  { id: 'inpatient',   label: 'In-Patient',     icon: BedDouble   },
  { id: 'outpatient',  label: 'Out-Patient',    icon: Activity    },
  { id: 'prescription',label: 'Prescription',   icon: FileText    },
  { id: 'billing',     label: 'Billing',        icon: CreditCard  },
  { id: 'specialist',  label: 'Specialist',     icon: Stethoscope },
]

const statusColor = (s='') => {
  s = s.toLowerCase()
  if (['active','paid','scheduled','available'].some(k=>s.includes(k))) return '#3dd68c'
  if (['partial','warning','partial'].some(k=>s.includes(k))) return '#f5a623'
  if (['discharged','completed'].some(k=>s.includes(k))) return '#4f8ef7'
  return '#f05c6e'
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
    <div style={{ width:28, height:28, borderRadius:8, background:'rgba(79,142,247,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
      <Icon size={13} color="var(--accent)" />
    </div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.6px', fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:13, color:'var(--text)', marginTop:1, fontWeight:500 }}>{value || '—'}</div>
    </div>
  </div>
)

const SectionTitle = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10, marginTop:4 }}>{children}</div>
)

const EmptyState = ({ message }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 0', gap:8 }}>
    <div style={{ width:40, height:40, borderRadius:12, background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <AlertCircle size={18} color="var(--text3)" />
    </div>
    <div style={{ fontSize:13, color:'var(--text3)' }}>{message}</div>
  </div>
)

export default function PatientCard({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState('info')
  const [admissions, setAdmissions]     = useState([])
  const [outPatients, setOutPatients]   = useState([])
  const [billing, setBilling]           = useState([])
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors]           = useState([])
  const [rooms, setRooms]               = useState([])
  const [loadingData, setLoadingData]   = useState(true)

  const pid = patient?.patient_id

  useEffect(() => {
    if (!pid) return
    setLoadingData(true)
    Promise.all([
      getAdmissions().catch(()=>({ data:[] })),
      getOutPatients().catch(()=>({ data:[] })),
      getBilling().catch(()=>({ data:[] })),
      getAppointments().catch(()=>({ data:[] })),
      getDoctors().catch(()=>({ data:[] })),
      getRooms().catch(()=>({ data:[] })),
    ]).then(([adm, out, bill, appt, doc, rm]) => {
      const extract = r => r?.data || r || []
      const allAdm  = extract(adm)
      const allOut  = extract(out)
      const allBill = extract(bill)
      const allAppt = extract(appt)
      const allDoc  = extract(doc)
      const allRm   = extract(rm)

      setAdmissions(allAdm.filter(a => String(a.patient_id) === String(pid)))
      setOutPatients(allOut.filter(o => String(o.patient_id) === String(pid)))
      setBilling(allBill.filter(b => String(b.patient_id) === String(pid)))
      setAppointments(allAppt.filter(a => String(a.patient_id) === String(pid)))
      setDoctors(allDoc)
      setRooms(allRm)
    }).finally(() => setLoadingData(false))
  }, [pid])

  if (!patient) return null

  const fName = patient.first_name || ''
  const lName = patient.last_name  || ''
  const dob   = patient.date_of_birth || ''
  const age   = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null
  const blood = patient.blood_group || patient.blood_type || '—'

  const getDoctorById = id => {
    const d = doctors.find(x => String(x.doctor_id) === String(id))
    return d ? `Dr. ${d.first_name} ${d.last_name}` : '#' + id
  }
  const getDoctorSpec = id => {
    const d = doctors.find(x => String(x.doctor_id) === String(id))
    return d?.specialization || d?.spec || '—'
  }
  const getRoomById = id => {
    const r = rooms.find(x => String(x.room_id) === String(id))
    return r ? `${r.room_number} (${r.room_type||r.type||'—'})` : '—'
  }

  // --- Tab content renderers ---

  const renderInfo = () => (
    <div>
      <SectionTitle>Identity</SectionTitle>
      <InfoRow icon={User}     label="Full Name"    value={`${fName} ${lName}`} />
      <InfoRow icon={Calendar} label="Date of Birth" value={dob ? `${dob}${age ? ` — ${age} yrs` : ''}` : '—'} />
      <InfoRow icon={User}     label="Gender"        value={patient.gender} />

      <SectionTitle style={{marginTop:16}}>Contact</SectionTitle>
      <InfoRow icon={Phone} label="Contact"  value={patient.contact_number} />
      <InfoRow icon={Mail}  label="Email"    value={patient.email} />
      <InfoRow icon={MapPin}label="Address"  value={patient.address} />

      <SectionTitle style={{marginTop:16}}>Medical</SectionTitle>
      <InfoRow icon={Droplets} label="Blood Group" value={blood} />
      <InfoRow icon={Calendar} label="Registered"  value={patient.registered_at} />
    </div>
  )

  const renderInPatient = () => {
    if (admissions.length === 0) return <EmptyState message="No in-patient admissions found" />
    return admissions.map((a, i) => (
      <div key={i} style={{ border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', marginBottom:10, background:'var(--bg3)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>Admission #{a.admission_id || i+1}</span>
          <span style={{ fontSize:11, fontWeight:600, color:statusColor(a.status), background:`${statusColor(a.status)}18`, padding:'3px 10px', borderRadius:20 }}>{a.status || 'Active'}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 12px' }}>
          <SmallInfo label="Doctor"    value={getDoctorById(a.doctor_id)} />
          <SmallInfo label="Room"      value={getRoomById(a.room_id)} />
          <SmallInfo label="Admitted"  value={a.admission_date} />
          <SmallInfo label="Discharge" value={a.discharge_date || 'On-going'} />
          <SmallInfo label="Reason"    value={a.reason} />
          <SmallInfo label="Diagnosis" value={a.diagnosis} />
        </div>
      </div>
    ))
  }

  const renderOutPatient = () => {
    if (outPatients.length === 0) return <EmptyState message="No out-patient visits found" />
    return outPatients.map((o, i) => (
      <div key={i} style={{ border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', marginBottom:10, background:'var(--bg3)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>Visit #{o.visit_id || i+1}</span>
          <span style={{ fontSize:11, color:'var(--text3)' }}>{o.visit_date || o.date}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 12px' }}>
          <SmallInfo label="Doctor"    value={getDoctorById(o.doctor_id)} />
          <SmallInfo label="Complaint" value={o.complaint} />
          <SmallInfo label="Diagnosis" value={o.diagnosis} />
          <SmallInfo label="Treatment" value={o.treatment} />
          <SmallInfo label="Follow-Up" value={o.follow_up_date || o.followUp} />
        </div>
      </div>
    ))
  }

  const renderPrescription = () => {
    // Derive prescriptions from outpatient visits' treatment + appointments
    const items = [
      ...outPatients.filter(o => o.treatment).map(o => ({
        date: o.visit_date || o.date,
        doctor: getDoctorById(o.doctor_id),
        medication: o.treatment,
        diagnosis: o.diagnosis,
        followUp: o.follow_up_date || o.followUp,
        type: 'Out-Patient'
      })),
      ...admissions.filter(a => a.diagnosis).map(a => ({
        date: a.admission_date,
        doctor: getDoctorById(a.doctor_id),
        medication: a.treatment || 'See attending physician',
        diagnosis: a.diagnosis,
        followUp: a.discharge_date,
        type: 'In-Patient'
      }))
    ]
    if (items.length === 0) return <EmptyState message="No prescriptions/treatments found" />
    return items.map((p, i) => (
      <div key={i} style={{ border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', marginBottom:10, background:'var(--bg3)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>Rx — {p.diagnosis || 'General'}</span>
          <span style={{ fontSize:11, fontWeight:600, color:'var(--accent)', background:'rgba(79,142,247,.1)', padding:'3px 10px', borderRadius:20 }}>{p.type}</span>
        </div>
        <SmallInfo label="Medication / Treatment" value={p.medication} />
        <SmallInfo label="Prescribed By"          value={p.doctor} />
        <SmallInfo label="Date"                   value={p.date} />
        {p.followUp && <SmallInfo label="Follow-Up" value={p.followUp} />}
      </div>
    ))
  }

  const renderBilling = () => {
    if (billing.length === 0) return <EmptyState message="No billing records found" />
    const total = billing.reduce((sum, b) => sum + (Number(b.total_amount)||0), 0)
    const paid  = billing.reduce((sum, b) => sum + (Number(b.paid_amount)||0), 0)
    return (
      <>
        {/* Summary bar */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            { label:'Total Billed', value: `₹${total.toLocaleString()}`, color:'#4f8ef7' },
            { label:'Amount Paid',  value: `₹${paid.toLocaleString()}`,  color:'#3dd68c' },
            { label:'Balance',      value: `₹${(total-paid).toLocaleString()}`, color: total-paid>0 ? '#f05c6e' : '#3dd68c' },
          ].map(s => (
            <div key={s.label} style={{ background:`${s.color}10`, border:`1px solid ${s.color}30`, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
              <div style={{ fontSize:15, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {billing.map((b, i) => (
          <div key={i} style={{ border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px', marginBottom:8, background:'var(--bg3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontWeight:700, fontSize:13 }}>Bill #{b.bill_id || i+1}</span>
              <span style={{ fontSize:11, fontWeight:600, color:statusColor(b.status), background:`${statusColor(b.status)}18`, padding:'2px 9px', borderRadius:20 }}>{b.status}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px' }}>
              <SmallInfo label="Date"        value={b.bill_date || b.date} />
              <SmallInfo label="Method"      value={b.payment_method || b.method} />
              <SmallInfo label="Total"       value={`₹${Number(b.total_amount||0).toLocaleString()}`} />
              <SmallInfo label="Paid"        value={`₹${Number(b.paid_amount||0).toLocaleString()}`} />
            </div>
          </div>
        ))}
      </>
    )
  }

  const renderSpecialist = () => {
    // Aggregate doctors from admissions + outpatients + appointments
    const docIds = new Set([
      ...admissions.map(a => String(a.doctor_id)),
      ...outPatients.map(o => String(o.doctor_id)),
      ...appointments.map(a => String(a.doctor_id)),
    ])
    if (docIds.size === 0 || doctors.length === 0) return <EmptyState message="No specialist visits found" />

    const visitDocs = [...docIds].map(id => {
      const d = doctors.find(x => String(x.doctor_id) === String(id))
      if (!d) return null
      const apptCount = appointments.filter(a => String(a.doctor_id) === String(id)).length
      const admCount  = admissions.filter(a => String(a.doctor_id) === String(id)).length
      const outCount  = outPatients.filter(o => String(o.doctor_id) === String(id)).length
      return { ...d, apptCount, admCount, outCount }
    }).filter(Boolean)

    return visitDocs.map((d, i) => (
      <div key={i} style={{ border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', marginBottom:10, background:'var(--bg3)', display:'flex', gap:14, alignItems:'flex-start' }}>
        <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg, rgba(79,142,247,.2), rgba(123,92,240,.2))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Stethoscope size={18} color="var(--accent)" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>Dr. {d.first_name} {d.last_name}</div>
          <div style={{ fontSize:12, color:'var(--accent)', marginTop:1, fontWeight:600 }}>{d.specialization || d.spec || 'Specialist'}</div>
          <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
            {d.apptCount > 0 && <Chip color="#4f8ef7">{d.apptCount} Appointment{d.apptCount>1?'s':''}</Chip>}
            {d.admCount  > 0 && <Chip color="#7b5cf0">{d.admCount} In-Patient</Chip>}
            {d.outCount  > 0 && <Chip color="#2dd4b1">{d.outCount} Out-Patient</Chip>}
          </div>
          {d.contact && <div style={{ marginTop:6, fontSize:11, color:'var(--text3)' }}>📞 {d.contact}</div>}
        </div>
      </div>
    ))
  }

  const tabContent = { info: renderInfo, inpatient: renderInPatient, outpatient: renderOutPatient, prescription: renderPrescription, billing: renderBilling, specialist: renderSpecialist }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, background:'rgba(10,12,24,.55)',
          backdropFilter:'blur(3px)', zIndex:9000,
          animation:'fadeIn .18s ease',
        }}
      />

      {/* Card */}
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%, -50%)',
        zIndex:9001,
        width:'min(780px, 95vw)', maxHeight:'88vh',
        display:'flex', flexDirection:'column',
        background:'var(--bg2)', borderRadius:20,
        border:'1px solid var(--border2)',
        boxShadow:'0 32px 80px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.05)',
        animation:'slideUp .22s cubic-bezier(.22,.61,.36,1)',
        overflow:'hidden',
      }}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, rgba(79,142,247,.08) 0%, rgba(123,92,240,.06) 100%)',
          borderBottom:'1px solid var(--border)',
          padding:'20px 24px', display:'flex', alignItems:'center', gap:16, flexShrink:0,
        }}>
          {/* Avatar */}
          <div style={{
            width:52, height:52, borderRadius:16, flexShrink:0,
            background:'linear-gradient(135deg, #4f8ef7, #7b5cf0)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20, fontWeight:700, color:'#fff',
            boxShadow:'0 4px 16px rgba(79,142,247,.4)',
          }}>
            {fName.charAt(0)}{lName.charAt(0)}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', letterSpacing:'-0.3px' }}>
              {fName} {lName}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:4, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--text3)' }}>ID #{pid}</span>
              {blood !== '—' && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color:'#f05c6e', background:'rgba(240,92,110,.1)', padding:'2px 9px', borderRadius:20 }}>
                  <Droplets size={11} /> {blood}
                </span>
              )}
              {patient.gender && (
                <span style={{ fontSize:12, color:'var(--text3)', background:'var(--bg3)', padding:'2px 9px', borderRadius:20 }}>{patient.gender}</span>
              )}
              {age && (
                <span style={{ fontSize:12, color:'var(--text3)', background:'var(--bg3)', padding:'2px 9px', borderRadius:20 }}>{age} yrs</span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width:32, height:32, borderRadius:8, border:'1px solid var(--border)',
              background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', flexShrink:0, color:'var(--text2)',
              transition:'all .15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--bg3)'; e.currentTarget.style.color='var(--red)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg)'; e.currentTarget.style.color='var(--text2)'}}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab Bar */}
        <div style={{
          display:'flex', gap:2, padding:'10px 14px', borderBottom:'1px solid var(--border)',
          overflowX:'auto', flexShrink:0, background:'var(--bg2)',
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'6px 14px', borderRadius:8, whiteSpace:'nowrap',
                  fontSize:12, fontWeight:600, cursor:'pointer', border:'none',
                  transition:'all .15s',
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#fff' : 'var(--text3)',
                }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='var(--bg3)'; e.currentTarget.style.color='var(--text)' }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)' }}}
              >
                <Icon size={13} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {loadingData
            ? <div style={{ display:'flex', justifyContent:'center', padding:'40px 0', color:'var(--text3)', fontSize:13 }}>Loading patient data…</div>
            : (tabContent[activeTab] || renderInfo)()
          }
        </div>

        {/* Footer stamp */}
        <div style={{
          borderTop:'1px solid var(--border)', padding:'10px 24px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexShrink:0, background:'var(--bg3)',
        }}>
          <span style={{ fontSize:11, color:'var(--text3)' }}>Patient Profile — Hospital Management System</span>
          <div style={{ display:'flex', gap:12 }}>
            <SmallStat label="Admissions" value={admissions.length} color="#7b5cf0" />
            <SmallStat label="Visits"     value={outPatients.length} color="#2dd4b1" />
            <SmallStat label="Bills"      value={billing.length}     color="#f5a623" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,-46%) } to { opacity:1; transform:translate(-50%,-50%) } }
      `}</style>
    </>
  )
}

// ── Small helpers ────────────────────────────────────────────────────────────
function SmallInfo({ label, value }) {
  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:12, color:'var(--text)', fontWeight:500 }}>{value || '—'}</div>
    </div>
  )
}

function Chip({ children, color='#4f8ef7' }) {
  return (
    <span style={{
      display:'inline-block', fontSize:10, fontWeight:700,
      padding:'2px 8px', borderRadius:20,
      background:`${color}18`, color,
    }}>{children}</span>
  )
}

function SmallStat({ label, value, color }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:14, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:9, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
    </div>
  )
}

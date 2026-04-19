import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { PageHeader, Btn, Card, Table, Modal, FormGrid, StatCard, statusBadge } from '../components/UI.jsx'
import { bills as initBills, patients, admissions, outPatientVisits, patientName } from '../data/mockData.js'

export default function Billing({ billingModal, onBillingModalClose }) {
  const [bills, setBills] = useState(initBills)
  const [payModal, setPayModal] = useState(null)
  const [form, setForm] = useState({ patientId:'', total:'', method:'Cash' })
  const [payAmt, setPayAmt] = useState('')

  const totalRevenue = bills.reduce((s,b)=>s+b.paid, 0)
  const totalPending  = bills.reduce((s,b)=>s+(b.total-b.paid), 0)

  const save = () => {
    if (!form.patientId || !form.total) return
    setBills(prev => [...prev, {
      id:Date.now(), patientId:+form.patientId, admissionId:null, visitId:null,
      date:new Date().toISOString().split('T')[0],
      total:+form.total, paid:0, status:'Pending', method:form.method,
    }])
    onBillingModalClose()
    setForm({ patientId:'', total:'', method:'Cash' })
  }

  const makePayment = () => {
    const amt = +payAmt
    if (!amt || !payModal) return
    setBills(prev => prev.map(b => {
      if (b.id !== payModal.id) return b
      const newPaid = Math.min(b.paid + amt, b.total)
      const status = newPaid >= b.total ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending'
      return { ...b, paid:newPaid, status }
    }))
    setPayModal(null)
    setPayAmt('')
  }

  const rows = bills.map(b => [
    `#${b.id}`,
    patientName(b.patientId),
    b.date,
    `₹${b.total.toLocaleString()}`,
    `₹${b.paid.toLocaleString()}`,
    <span style={{ color:'var(--red)', fontWeight:600 }}>₹{(b.total-b.paid).toLocaleString()}</span>,
    b.method,
    statusBadge(b.status),
    b.status !== 'Paid'
      ? <Btn size="sm" variant="secondary" onClick={()=>{ setPayModal(b); setPayAmt('') }}>Pay</Btn>
      : <span style={{ fontSize:11, color:'var(--accent3)' }}>✓ Settled</span>
  ])

  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft:40, paddingRight:40, paddingTop:40, paddingBottom:40 }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:28 }}>
          <StatCard label="Total Collected"  value={`₹${totalRevenue.toLocaleString()}`}  icon={Receipt} color="var(--accent3)" />
          <StatCard label="Pending Amount"   value={`₹${totalPending.toLocaleString()}`}   icon={Receipt} color="var(--red)"    />
          <StatCard label="Total Bills"      value={bills.length}                           icon={Receipt} color="var(--accent)" />
        </div>

        <Card>
          <Table
            headers={['Bill ID','Patient','Date','Total','Paid','Balance','Method','Status','Action']}
            rows={rows}
            emptyMsg="No bills found"
          />
        </Card>

        {/* New bill modal */}
        <Modal open={billingModal} onClose={onBillingModalClose} title="Create New Bill">
          <FormGrid>
            <div><label>Patient *</label>
              <select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})}>
                <option value="">Select patient</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div><label>Total Amount (₹) *</label><input type="number" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} /></div>
            <div><label>Payment Method</label>
              <select value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>
                {['Cash','Card','Insurance','Online'].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </FormGrid>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <Btn variant="secondary" onClick={onBillingModalClose}>Cancel</Btn>
            <Btn onClick={save}>Create Bill</Btn>
          </div>
        </Modal>

        {/* Payment modal */}
        <Modal open={!!payModal} onClose={()=>setPayModal(null)} title="Record Payment">
          {payModal && <>
            <div style={{ background:'var(--bg3)', padding:'12px 16px', borderRadius:10, marginBottom:16, fontSize:13 }}>
              <div style={{ color:'var(--text2)' }}>Patient: <strong style={{ color:'var(--text)' }}>{patientName(payModal.patientId)}</strong></div>
              <div style={{ color:'var(--text2)', marginTop:4 }}>Balance: <strong style={{ color:'var(--red)' }}>₹{(payModal.total-payModal.paid).toLocaleString()}</strong></div>
            </div>
            <label>Payment Amount (₹)</label>
            <input type="number" value={payAmt} onChange={e=>setPayAmt(e.target.value)} placeholder="Enter amount" style={{ marginTop:4 }} />
            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
              <Btn variant="secondary" onClick={()=>setPayModal(null)}>Cancel</Btn>
              <Btn onClick={makePayment}>Confirm Payment</Btn>
            </div>
          </>}
        </Modal>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Btn, Card, Table, Modal, FormGrid, StatCard, statusBadge } from '../components/UI.jsx'
import { getBills, getPatients, getPatientName, createBill, deleteBill } from '../data/api.js'

export default function Billing({ billingModal, onBillingModalClose }) {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [payModal, setPayModal] = useState(null)
  const [form, setForm] = useState({ patientId:'', total:'', method:'Cash' })
  const [payAmt, setPayAmt] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [billRes, patientRes] = await Promise.all([
          getBills(),
          getPatients(),
        ])
        if (billRes.error) throw new Error(billRes.error)
        if (patientRes.error) throw new Error(patientRes.error)
        setBills(billRes.data || [])
        setPatients(patientRes.data || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching billing data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRevenue = bills.reduce((s, b) => s + (Number(b.paid_amount) || 0), 0)
  const totalPending  = bills.reduce((s, b) => s + ((Number(b.total_amount) || 0) - (Number(b.paid_amount) || 0)), 0)

  const save = async () => {
    if (!form.patientId || !form.total) return
    try {
      const billData = {
        patient_id: +form.patientId,
        total: +form.total,
        bill_date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        payment_method: form.method
      }
      const result = await createBill(billData)
      if (result.success || result.id) {
        const res = await getBills()
        setBills(res || [])
        onBillingModalClose()
        setForm({ patientId:'', total:'', method:'Cash' })
      }
    } catch (err) {
      console.error('Error saving bill:', err)
    }
  }

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...')
      const [billRes, patientRes] = await Promise.all([
        getBills(),
        getPatients(),
      ])
      console.log('📥 Bills response:', billRes)
      console.log('📥 Patients response:', patientRes)
      
      const billData = billRes?.data || billRes || []
      const patientData = patientRes?.data || patientRes || []
      
      console.log('✅ Extracted data - Bills:', billData.length, 'Patients:', patientData.length)
      
      setBills(billData)
      setPatients(patientData)
      alert('✅ Data refreshed! New patients are now available.')
    } catch (err) {
      console.error('❌ Error refreshing data:', err)
      alert('❌ Error refreshing data: ' + err.message)
    }
  }

  const remove = async (id, patientName) => {
    if (!window.confirm(`Are you sure you want to remove this bill for ${patientName}?`)) return
    try {
      const result = await deleteBill(id)
      if (result.success || result.message) {
        console.log('✅ Bill deleted successfully')
        alert('✅ Bill removed successfully!')
        const res = await getBills()
        setBills(res.data || res || [])
      } else {
        alert('❌ Failed to remove bill')
      }
    } catch (err) {
      console.error('❌ Error removing bill:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  const makePayment = () => {
    const amt = +payAmt
    if (!amt || !payModal) return
    setBills(prev => prev.map(b => {
      const id = b.bill_id
      const payId = payModal.bill_id
      if (id !== payId) return b
      const currentPaid = Number(b.paid_amount) || 0
      const totalAmount = Number(b.total_amount) || 0
      const newPaid = Math.min(currentPaid + amt, totalAmount)
      const status = newPaid >= totalAmount ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending'
      return { ...b, paid_amount: newPaid, payment_status: status }
    }))
    setPayModal(null)
    setPayAmt('')
  }

  if (loading) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
          <p style={{ fontSize:16, color:'var(--text2)' }}>Loading billing data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ width:'100%', background:'var(--bg)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
          <p style={{ fontSize:16, color:'var(--red)' }}>Error loading billing data: {error}</p>
        </div>
      </div>
    )
  }

  const rows = bills.map(b => {
    const pId = b.patient_id
    const id = b.bill_id
    const billTotal = Number(b.total_amount) || 0
    const billPaid = Number(b.paid_amount) || 0
    const billDate = b.bill_date || ''
    const billMethod = b.payment_method || '—'
    const pName = getPatientName(patients, pId)
    return [
      `#${id}`,
      pName,
      billDate,
      `₹${billTotal.toLocaleString()}`,
      `₹${billPaid.toLocaleString()}`,
      <span style={{ color:'var(--red)', fontWeight:600 }}>₹{(billTotal - billPaid).toLocaleString()}</span>,
      billMethod,
      statusBadge(b.payment_status),
      b.payment_status !== 'Paid'
        ? <Btn size="sm" variant="secondary" onClick={() => { setPayModal(b); setPayAmt('') }}>Pay</Btn>
        : <span style={{ fontSize:11, color:'var(--accent3)' }}>✓ Settled</span>,
      <button onClick={() => remove(id, pName)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:18, padding:0 }} title="Remove bill">-</button>,
    ]
  })


  return (
    <div style={{ width:'100%', background:'var(--bg)' }}>
      {/* Content Container */}
      <div style={{ maxWidth:1200, margin:'0 auto', paddingLeft: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingRight: window.innerWidth < 480 ? 16 : window.innerWidth < 768 ? 24 : 40, paddingTop: window.innerWidth < 480 ? 24 : 40, paddingBottom: window.innerWidth < 480 ? 24 : 40 }}>
        {/* Refresh Button */}
        <div style={{ marginBottom:18 }}>
          <Btn onClick={refreshData} variant="secondary" size="sm">🔄 Refresh Patient List</Btn>
        </div>
        
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:28 }}>
          <StatCard label="Total Collected"  value={`₹${totalRevenue.toLocaleString()}`}  icon={Receipt} color="var(--accent3)" />
          <StatCard label="Pending Amount"   value={`₹${totalPending.toLocaleString()}`}   icon={Receipt} color="var(--red)"    />
          <StatCard label="Total Bills"      value={bills.length}                           icon={Receipt} color="var(--accent)" />
        </div>

        <Card>
          <Table
            headers={['ID','Patient','Date','Total','Paid','Pending','Method','Status','Action','Remove']}
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
                {patients.map(p=>{const fName = p.firstName || p.first_name; const lName = p.lastName || p.last_name; const id = p.id || p.patient_id; return <option key={id} value={id}>{fName} {lName}</option>})}
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
              <div style={{ color:'var(--text2)' }}>Patient: <strong style={{ color:'var(--text)' }}>{getPatientName(patients, payModal.patient_id)}</strong></div>
              <div style={{ color:'var(--text2)', marginTop:4 }}>Balance: <strong style={{ color:'var(--red)' }}>₹{((Number(payModal.total_amount) || 0) - (Number(payModal.paid_amount) || 0)).toLocaleString()}</strong></div>
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

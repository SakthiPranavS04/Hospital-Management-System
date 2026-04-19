// ── Shared UI components ─────────────────────────────────────

export function Card({ children, style }) {
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--card-r)', padding:20, ...style
    }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color='var(--accent)', sub }) {
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--card-r)', padding:'18px 20px',
      display:'flex', gap:16, alignItems:'center',
    }}>
      <div style={{
        width:44, height:44, borderRadius:11, flexShrink:0,
        background: `${color}18`, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:700, color:'var(--text)', lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function Badge({ children, type='default' }) {
  const colors = {
    success: { bg:'rgba(61,214,140,.12)', color:'#3dd68c' },
    warning: { bg:'rgba(245,166,35,.12)', color:'#f5a623' },
    danger:  { bg:'rgba(240,92,110,.12)', color:'#f05c6e' },
    info:    { bg:'rgba(79,142,247,.12)', color:'#4f8ef7' },
    default: { bg:'rgba(139,149,176,.12)', color:'#8b95b0' },
  }
  const c = colors[type] || colors.default
  return (
    <span style={{
      display:'inline-block', padding:'2px 9px', borderRadius:20,
      fontSize:11, fontWeight:600, background:c.bg, color:c.color,
      letterSpacing:'0.2px'
    }}>{children}</span>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
      <div>
        <h1 style={{ fontSize:20, fontWeight:700, color:'var(--text)', letterSpacing:'-0.3px' }}>{title}</h1>
        {subtitle && <p style={{ color:'var(--text2)', fontSize:13, marginTop:3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Btn({ children, onClick, variant='primary', size='md', style: s }) {
  const base = {
    display:'inline-flex', alignItems:'center', gap:6,
    borderRadius:8, fontWeight:600, fontSize:13,
    padding: size==='sm' ? '5px 12px' : '9px 18px',
    ...s,
  }
  const variants = {
    primary: { background:'var(--accent)', color:'#fff' },
    secondary: { background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)' },
    danger:  { background:'rgba(240,92,110,.15)', color:'var(--red)', border:'1px solid rgba(240,92,110,.25)' },
    ghost:   { background:'transparent', color:'var(--text2)' },
  }
  return <button style={{...base, ...variants[variant]}} onClick={onClick}>{children}</button>
}

export function Table({ headers, rows, emptyMsg='No data' }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                textAlign:'left', padding:'10px 14px', fontSize:11,
                color:'var(--text3)', fontWeight:600, letterSpacing:'0.5px',
                borderBottom:'1px solid var(--border)', textTransform:'uppercase'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length} style={{ padding:'32px 14px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding:'11px 14px', fontSize:13, color:'var(--text)' }}>{cell}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.65)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000,
    }} onClick={onClose}>
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border2)',
        borderRadius:16, padding:28, width:'min(520px, 90vw)', maxHeight:'85vh', overflowY:'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', color:'var(--text2)', fontSize:20, lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FormGrid({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 16px' }}>{children}</div>
}

export function FullRow({ children }) {
  return <div style={{ gridColumn:'1/-1' }}>{children}</div>
}

export function statusBadge(status) {
  const map = {
    Scheduled:'info', Completed:'success', Cancelled:'danger', 'No-Show':'warning',
    Active:'success', Discharged:'default', Transferred:'warning',
    Paid:'success', Partial:'warning', Pending:'danger',
    Available:'success', Occupied:'danger',
  }
  return <Badge type={map[status]||'default'}>{status}</Badge>
}

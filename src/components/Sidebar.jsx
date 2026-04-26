import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, BedDouble, Stethoscope, Receipt, Building2, Menu, X, LogOut } from 'lucide-react'

const links = [
  { to:'/',            icon: LayoutDashboard, label:'Dashboard' },
  { to:'/patients',    icon: Users,           label:'Patients' },
  { to:'/appointments',icon: CalendarDays,    label:'Appointments' },
  { to:'/inpatients',  icon: BedDouble,       label:'In-Patients' },
  { to:'/outpatients', icon: Stethoscope,     label:'Out-Patients' },
  { to:'/billing',     icon: Receipt,         label:'Billing' },
  { to:'/rooms',       icon: Building2,       label:'Rooms' },
]

export default function Sidebar({ onMenuHoverChange, currentUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuHovered, setMenuHovered] = useState(false)

  return (
    <header style={{
      height: 70, background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      paddingLeft: 'max(12px, 3vw)', paddingRight: 'max(12px, 3vw)',
      position: 'relative'
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'min(8px, 2vw)', flexShrink: 0 }}>
        <div style={{
          width:'clamp(32px, 8vw, 40px)', height:'clamp(32px, 8vw, 40px)', borderRadius:10,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'clamp(14px, 4vw, 18px)', fontWeight:700, color:'#fff'
        }}>M</div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ fontWeight:700, fontSize:'clamp(14px, 4vw, 16px)', color:'var(--text)', letterSpacing:'-0.3px', whiteSpace: 'nowrap' }}>MedCore</div>
          <div style={{ fontSize:'clamp(8px, 2vw, 9px)', color:'var(--text3)', letterSpacing:'0.5px', marginTop: -2, whiteSpace: 'nowrap' }}>Hospital System</div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav style={{ display:'flex', alignItems:'center', gap:'clamp(4px, 1vw, 8px)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'clamp(4px, 1vw, 6px)', padding:'8px clamp(10px, 2vw, 14px)',
            borderRadius:8, textDecoration:'none', fontSize:'clamp(11px, 2vw, 12px)', fontWeight:500,
            color: isActive ? 'var(--accent)' : 'var(--text2)',
            background: isActive ? 'rgba(79,142,247,0.12)' : 'transparent',
            transition:'all .15s',
            whiteSpace: 'nowrap',
          })} className="nav-link">
            <Icon size={14} style={{ minWidth: 14 }} />
            <span style={{ display: 'none' }} className="nav-label">{label}</span>
          </NavLink>
        ))}
        
        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid var(--border)' }}>
          {currentUser && (
            <span style={{ fontSize: '12px', color: 'var(--text2)', whiteSpace: 'nowrap' }} className="user-info">
              {currentUser.username}
            </span>
          )}
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--text2)', cursor: 'pointer',
              fontSize: '11px', fontWeight: 500, transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--accent)'
              e.target.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text2)'
              e.target.style.borderColor = 'var(--border)'
            }}
            className="logout-btn"
          >
            <LogOut size={12} />
            <span style={{ display: 'none' }} className="logout-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseEnter={() => {
          setMenuHovered(true)
          onMenuHoverChange?.(true)
        }}
        onMouseLeave={() => {
          setMenuHovered(false)
          onMenuHoverChange?.(false)
        }}
        style={{
          display: 'none', background: 'transparent', border: 'none', 
          cursor: 'pointer', color: 'var(--text)', padding: 8,
          transition: 'all 0.2s ease',
          opacity: menuHovered ? 1 : 0.7
        }}
        className="mobile-menu-btn"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav style={{
          position: 'absolute', top: 70, left: 0, right: 0,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 2, padding: '12px',
          zIndex: 1000
        }} className="mobile-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to==='/'} 
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:500,
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                background: isActive ? 'rgba(79,142,247,0.12)' : 'transparent',
                transition:'all .15s',
              })}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
          
          {/* Mobile Logout */}
          {currentUser && (
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text3)', margin: '0 0 8px 0' }}>
                Logged in as: {currentUser.username}
              </p>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onLogout()
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', background: 'rgba(79,142,247,0.12)',
                  border: '1px solid var(--accent)', borderRadius: '6px',
                  color: 'var(--accent)', cursor: 'pointer', fontSize: '12px',
                  fontWeight: 500, transition: 'all 0.2s'
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-link { display: none; }
          .mobile-menu-btn { display: block !important; }
          .user-info { display: none; }
          .logout-btn { display: none; }
        }
        @media (min-width: 901px) {
          .nav-link { display: flex !important; }
          .nav-label { display: inline !important; }
          .logout-label { display: inline !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}
      {menuOpen && (
        <nav style={{
          position: 'absolute', top: 70, left: 0, right: 0,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 2, padding: '12px',
          zIndex: 1000
        }} className="mobile-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to==='/'} 
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:500,
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                background: isActive ? 'rgba(79,142,247,0.12)' : 'transparent',
                transition:'all .15s',
              })}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-link { display: none; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-link { display: flex !important; }
          .nav-label { display: inline !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}

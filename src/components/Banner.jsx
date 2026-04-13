import { useLocation } from 'react-router-dom'

export default function Banner() {
  const location = useLocation()
  
  const bannerData = {
    '/': { color: '#4f8ef7', title: 'Dashboard', icon: '📊' },
    '/patients': { color: '#00d4ff', title: 'Patients', icon: '👥' },
    '/appointments': { color: '#9333ea', title: 'Appointments', icon: '📅' },
    '/inpatients': { color: '#ec4899', title: 'In-Patients', icon: '🏥' },
    '/outpatients': { color: '#06b6d4', title: 'Out-Patients', icon: '👨‍⚕️' },
    '/billing': { color: '#f59e0b', title: 'Billing', icon: '💰' },
    '/rooms': { color: '#10b981', title: 'Rooms', icon: '🛏️' },
  }
  
  const current = bannerData[location.pathname] || bannerData['/']
  
  return (
    <div style={{
      width: '100%',
      height: 160,
      background: `linear-gradient(135deg, ${current.color}, ${current.color}dd)`,
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Wave SVG background */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.1,
        }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="white"
        />
      </svg>
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          fontSize: 48,
        }}>
          {current.icon}
        </div>
        <h1 style={{
          fontSize: 48,
          fontWeight: 700,
          color: 'white',
          margin: 0,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}>
          {current.title}
        </h1>
      </div>
    </div>
  )
}

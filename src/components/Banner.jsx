import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function Banner({ menuHovered, onRegisterPatient, onNewAppointment, onNewAdmission, onRecordVisit, onNewBill, onAddRoom }) {
  const location = useLocation()
  const navigate = useNavigate()

  const bannerData = {
    '/': {
      title: 'Dashboard',
      bgImage: '/banner-dashboard.png',
      showButton: false,
      buttonText: '',
      action: null,
      showBackButton: false
    },
    '/patients': {
      title: 'Patients',
      bgImage: '/banner-patient.avif',
      showButton: true,
      buttonText: '+ Register Patient',
      action: 'register',
      showBackButton: true
    },
    '/appointments': {
      title: 'Appointments',
      bgImage: '/banner-appointment.avif',
      showButton: true,
      buttonText: '+ New Appointment',
      action: 'appointment',
      showBackButton: true
    },
    '/inpatients': {
      title: 'In-Patients',
      bgImage: '/banner-inpatient.jpg',
      showButton: true,
      buttonText: '+ New Admission',
      action: 'admission',
      showBackButton: true
    },
    '/outpatients': {
      title: 'Out-Patients',
      bgImage: '/banner-outpatient.avif',
      showButton: true,
      buttonText: '+ Record Visit',
      action: 'visit',
      showBackButton: true
    },
    '/billing': {
      title: 'Billing',
      bgImage: '/banner-billing.jpg',
      showButton: true,
      buttonText: '+ New Bill',
      action: 'bill',
      showBackButton: true
    },
    '/rooms': {
      title: 'Rooms',
      bgImage: '/banner-rooms.jpg',
      showButton: true,
      buttonText: '+ Add Room',
      action: 'room',
      showBackButton: true
    },
  }

  const current = bannerData[location.pathname] || bannerData['/']

  const handleButtonClick = () => {
    switch (current.action) {
      case 'register':
        onRegisterPatient?.()
        break
      case 'appointment':
        onNewAppointment?.()
        break
      case 'admission':
        onNewAdmission?.()
        break
      case 'visit':
        onRecordVisit?.()
        break
      case 'bill':
        onNewBill?.()
        break
      case 'room':
        onAddRoom?.()
        break
      default:
        break
    }
  }

  // Show button on desktop or when hovering over menu on mobile
  const shouldShowButton = menuHovered || window.innerWidth >= 901

  return (
    <div style={{
      width: '100%',
      height: '350px',
      backgroundImage: current.bgImage ? `url('${current.bgImage}')` : 'none',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      overflow: 'hidden',
      paddingLeft: '40px',
      paddingRight: '40px',
      flexDirection: 'row',
      position: 'relative',
    }}>
      {/* Overlay for better text contrast */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        pointerEvents: 'none',
      }}></div>

      {/* Back Button */}
      {current.showBackButton !== false && (
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#1a1f36',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}
      {/* Left: Title */}
      <h1 style={{
        fontSize: '42px',
        fontWeight: 700,
        color: 'white',
        margin: 0,
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 2,
        position: 'relative',
      }}>
        {current.title}
      </h1>

      {/* Right: Button */}
      {current.showButton && shouldShowButton && (
        <button
          onClick={handleButtonClick}
          style={{
            zIndex: 2,
            position: 'relative',
            marginRight: '30px',
            backgroundColor: 'white',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            opacity: menuHovered && window.innerWidth < 901 ? 1 : 1,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f0f0f0'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          {current.buttonText}
        </button>
      )}
    </div>
  )
}

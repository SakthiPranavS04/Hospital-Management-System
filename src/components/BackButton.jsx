import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'absolute',
        top: '20px',
        left: '40px',
        zIndex: 10,
        backgroundColor: 'transparent',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f8f9fa'
        e.currentTarget.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <ChevronLeft size={16} />
      Back
    </button>
  )
}

// Format date from ISO string or Date object to readable format
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch (e) {
    return '—'
  }
}

// Format time from HH:mm format
export const formatTime = (timeStr) => {
  if (!timeStr) return '—'
  return timeStr.substring(0, 5) // Get HH:mm
}

// Format datetime
export const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return '—'
  const date = formatDate(dateStr)
  const time = timeStr ? formatTime(timeStr) : ''
  return `${date} ${time ? time : ''}`.trim()
}

// Calculate age from date of birth
export const calculateAge = (dobStr) => {
  if (!dobStr) return 0
  try {
    const dob = new Date(dobStr)
    if (isNaN(dob.getTime())) return 0
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  } catch (e) {
    return 0
  }
}

// small helpers used in more than one component

export function formatRupees(value) {
  return '₹' + value.toLocaleString('en-IN')
}

// "2026-11-09" -> "09 Nov 2026"
export function formatDate(isoDate) {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// today's date as "YYYY-MM-DD" (what <input type="date"> needs)
export function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

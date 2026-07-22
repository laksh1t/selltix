import { Link } from 'react-router-dom'

function formatDate(dateString) {
  if (!dateString) return 'Date TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event._id || event.id}`} className="event-card">
      <div className="event-card-banner" />
      <div className="event-card-body">
        <span className="event-card-date">{formatDate(event.startDate || event.startTime)}</span>
        <span className="event-card-title">{event.title || event.name}</span>
        <span className="event-card-venue">{event.venue || event.location || 'Venue TBA'}</span>
      </div>
    </Link>
  )
}

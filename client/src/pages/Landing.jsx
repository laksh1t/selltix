import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'

export default function Landing() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchEvents(page = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/events?page=${page}&limit=12`)
      const data = res.data?.data;
      setEvents(data?.items ? data.items : (Array.isArray(data) ? data : []))
      setPagination(res.data?.data?.pagination || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <div className="landing-hero">
        <h1 className="landing-title">Discover <span>extraordinary</span> events</h1>
        <p className="landing-subtitle">Book tickets to the best experiences in your city.</p>
        
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Input 
            type="text" 
            placeholder="Search events or venues..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '16px 24px', fontSize: 16, borderRadius: 100, boxShadow: 'var(--shadow)' }}
          />
        </div>
      </div>

      <div className="page" style={{ paddingTop: 64 }}>
        <h2 style={{ marginBottom: 24, fontSize: 28 }}>Upcoming Events</h2>
        
        {loading ? (
          <LoadingState message="Loading experiences..." />
        ) : filteredEvents.length === 0 ? (
          <EmptyState message="No events found." />
        ) : (
          <div className="event-grid">
            {filteredEvents.map((event) => (
              <Link key={event.id || event._id} to={`/events/${event.id || event._id}`}>
                <Card className="event-card" padded={false}>
                  <div className="event-card-banner" />
                  <div className="event-card-body">
                    <span className="event-card-date">
                      {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="event-card-title">{event.title || event.name}</span>
                    <span className="event-card-venue">{event.venue || event.location}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!searchQuery && <Pagination pagination={pagination} onPageChange={fetchEvents} />}
      </div>
    </>
  )
}

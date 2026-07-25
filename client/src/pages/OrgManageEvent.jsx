import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import FormGroup from '../components/ui/FormGroup'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'

export default function OrgManageEvent() {
  const { orgId, eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // New ticket tier form fields
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [publishing, setPublishing] = useState(false)

  async function loadData() {
    try {
      const [eventRes, analyticsRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/analytics`).catch(() => null)
      ])
      
      setEvent(eventRes.data?.data || eventRes.data?.event || eventRes.data)
      if (analyticsRes) {
        setAnalytics(analyticsRes.data?.data || analyticsRes.data)
      }
    } catch (err) {
      setError('Could not load this event.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [eventId])

  async function handlePublish() {
    setPublishing(true)
    setError('')
    try {
      await api.patch(`/events/${eventId}`, { status: 'PUBLISHED' })
      loadData()
    } catch (err) {
      setError('Could not publish event. Make sure you own this event.')
    } finally {
      setPublishing(false)
    }
  }

  async function handleAddTicketType(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await api.post(`/events/${eventId}/ticket-types`, {
        name,
        price: Number(price),
        capacity: Number(capacity),
      })
      setSuccess(`"${name}" ticket tier added.`)
      setName('')
      setPrice('')
      setCapacity('')
      loadData() 
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not add this ticket tier.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page"><LoadingState /></div>
  if (!event) return <div className="page"><Alert type="error">{error || 'Event not found.'}</Alert></div>

  const ticketTypes = event.ticketTypes || []
  const stats = analytics?.overview || { revenue: 0, ticketsSold: 0, checkedIn: 0, pendingBookings: 0 }

  return (
    <div className="page">
      <Link to={`/org/${orgId}`} style={{ display: 'inline-block', marginBottom: 16 }}>&larr; Back to Workspace</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title={event.title || event.name} description={event.venue || event.location} />
        {event.status === 'DRAFT' && (
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Publishing...' : 'Publish Event'}
          </Button>
        )}
        {event.status === 'PUBLISHED' && (
          <span style={{ padding: '4px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: 100, fontSize: 13, fontWeight: 'bold' }}>
            Live
          </span>
        )}
      </div>

      <div className="form-row" style={{ alignItems: 'flex-start', marginBottom: 32 }}>
        <Card>
          <h3>Overview & Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <div className="muted" style={{ fontSize: 13 }}>Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>₹{stats.revenue}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 13 }}>Tickets Sold</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.ticketsSold}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 13 }}>Checked In</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.checkedIn}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 13 }}>Pending Bookings</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.pendingBookings}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="form-row" style={{ alignItems: 'flex-start' }}>
        <Card>
          <h3>Ticket tiers</h3>

          {ticketTypes.length === 0 && (
            <p className="muted" style={{ marginTop: 16 }}>No ticket tiers yet. Add your first one to start selling.</p>
          )}

          {ticketTypes.map((ticket) => (
            <div className="ticket-row" key={ticket._id || ticket.id}>
              <div>
                <div className="ticket-row-name">{ticket.name}</div>
                <div className="ticket-row-price">
                  ₹{ticket.price} · capacity {ticket.capacity}
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3>Add a ticket tier</h3>

          <Alert type="error">{error}</Alert>
          <Alert type="success">{success}</Alert>

          <form onSubmit={handleAddTicketType} style={{ marginTop: 16 }}>
            <FormGroup label="Tier name">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Early Bird"
                required
              />
            </FormGroup>

            <div className="form-row">
              <FormGroup label="Price (₹)">
                <Input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="499"
                  required
                />
              </FormGroup>
              <FormGroup label="Capacity">
                <Input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="100"
                  required
                />
              </FormGroup>
            </div>

            <Button type="submit" block disabled={submitting}>
              {submitting ? 'Adding...' : 'Add ticket tier'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext.jsx'

function formatDate(dateString) {
  if (!dateString) return 'Date to be announced'
  const date = new Date(dateString)
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function EventPage() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [quantities, setQuantities] = useState({}) // { ticketTypeId: quantity }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${id}`)
        setEvent(res.data?.data || res.data?.event || res.data)
      } catch (err) {
        setError('Could not load this event. It may have been removed.')
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  function updateQuantity(ticketTypeId, value) {
    const qty = Math.max(0, Number(value) || 0)
    setQuantities((prev) => ({ ...prev, [ticketTypeId]: qty }))
  }

  const ticketTypes = event?.ticketTypes || []

  const total = ticketTypes.reduce((sum, ticket) => {
    const ticketId = ticket._id || ticket.id
    const qty = quantities[ticketId] || 0
    return sum + qty * (ticket.price || 0)
  }, 0)

  async function handleCheckout() {
    if (!user) {
      navigate('/login')
      return
    }

    const items = ticketTypes
      .map((ticket) => ({
        ticketTypeId: ticket._id || ticket.id,
        quantity: quantities[ticket._id || ticket.id] || 0,
      }))
      .filter((item) => item.quantity > 0)

    if (items.length === 0) {
      setError('Select at least one ticket before checking out.')
      return
    }

    setError('')
    setCheckingOut(true)

    try {
      // This reserves the inventory and should return a Razorpay order
      // alongside our own internal booking id.
      const res = await api.post('/bookings', {
        eventId: id,
        items,
      })

      const orderData = res.data?.data?.order || res.data
      openRazorpay(orderData)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start checkout. Please try again.')
      setCheckingOut(false)
    }
  }

  function openRazorpay(booking) {
    // booking is expected to look something like:
    // { razorpayOrderId, amount, currency, bookingId }
    if (!window.Razorpay) {
      setError('Payment widget failed to load. Please refresh the page and try again.')
      setCheckingOut(false)
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: booking.amount,
      currency: booking.currency || 'INR',
      name: 'Selltix',
      description: event.title || event.name,
      order_id: booking.razorpayOrderId || booking.id,
      handler: function () {
        // Payment succeeded on Razorpay's side.
        // Your backend should verify the payment signature on its end
        // (typically via a webhook or a separate verify endpoint).
        navigate('/tickets')
      },
      modal: {
        ondismiss: function () {
          setCheckingOut(false)
        },
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#4f46e5',
      },
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
    setCheckingOut(false)
  }

  if (loading) {
    return <p className="spinner-text">Loading event...</p>
  }

  if (error && !event) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="page">
      <div className="page-header">
        <span className="event-card-date">{formatDate(event.startDate || event.startTime)}</span>
        <h1>{event.title || event.name}</h1>
        <p>{event.venue || event.location}</p>
      </div>

      <div className="form-row" style={{ alignItems: 'flex-start' }}>
        <div className="card card-padded">
          <h3>About this event</h3>
          <p className="muted">{event.description || 'No description provided.'}</p>
        </div>

        <div className="card card-padded">
          <h3>Tickets</h3>

          {error && <div className="alert alert-error">{error}</div>}

          {ticketTypes.length === 0 && (
            <p className="muted">Tickets for this event haven't been added yet.</p>
          )}

          {ticketTypes.map((ticket) => {
            const ticketId = ticket._id || ticket.id
            return (
              <div className="ticket-row" key={ticketId}>
                <div>
                  <div className="ticket-row-name">{ticket.name}</div>
                  <div className="ticket-row-price">₹{ticket.price}</div>
                </div>
                <input
                  type="number"
                  className="qty-input"
                  min="0"
                  value={quantities[ticketId] || 0}
                  onChange={(e) => updateQuantity(ticketId, e.target.value)}
                />
              </div>
            )
          })}

          {ticketTypes.length > 0 && (
            <>
              <div className="ticket-row">
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={handleCheckout}
                disabled={checkingOut || total === 0}
              >
                {checkingOut ? 'Starting checkout...' : 'Checkout'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

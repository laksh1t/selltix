import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import Pagination from '../components/ui/Pagination'

export default function Tickets() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  
  async function fetchTickets(page = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/bookings/me?page=${page}&limit=12`)
      const data = res.data?.data;
      setBookings(data?.items ? data.items : (Array.isArray(data) ? data : []))
      setPagination(res.data?.data?.pagination || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className="page">
      <PageHeader 
        title="My Tickets" 
        description="All your upcoming and past events."
      />

      {loading ? (
        <LoadingState message="Loading your tickets..." />
      ) : bookings.length === 0 ? (
        <EmptyState message="You haven't purchased any tickets yet." />
      ) : (
        <div className="event-grid">
          {bookings.map((booking) => (
            <Card key={booking.id} padded={false} className="event-card">
              <div className="event-card-banner" />
              <div className="event-card-body">
                <span className="event-card-title">{booking.event?.title}</span>
                <span className="event-card-venue">{booking.event?.venue}</span>
                <div style={{ marginTop: 12 }}>
                  {booking.items.map(item => (
                    <div key={item.id} style={{ fontSize: 13, marginTop: 12 }}>
                      <strong>{item.quantity}x {item.ticketType?.name}</strong>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                        {item.tickets?.map(ticket => (
                          <div key={ticket.ticketCode} style={{ background: '#fff', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                            <QRCodeSVG value={ticket.ticketCode} size={80} />
                            <div style={{ fontSize: 10, marginTop: 4, color: 'var(--text-tertiary)' }}>
                              {ticket.ticketCode.split('-')[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Pagination pagination={pagination} onPageChange={fetchTickets} />
    </div>
  )
}
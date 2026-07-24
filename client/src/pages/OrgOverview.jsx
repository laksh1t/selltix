import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function OrgOverview() {
  const { orgId } = useParams()
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrg() {
      try {
        const res = await api.get('/organizations')
        const data = res.data?.data;
        const allOrgs = data?.items ? data.items : (Array.isArray(data) ? data : []);
        const matched = allOrgs.find(o => o.id === orgId || o._id === orgId)
        if (matched) setOrg(matched)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadOrg()
  }, [orgId])

  if (loading) return <div className="page"><LoadingState /></div>
  if (!org) return <div className="page"><EmptyState message="Organization not found." /></div>

  const myEvents = org.events || []

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <PageHeader title={org.name} description="Organization Workspace" />
        <Link to={`/org/${org.id || org._id}/events/create`}><Button>+ New Event</Button></Link>
      </div>

      <div className="section">
        <h2 style={{ marginBottom: 16 }}>Events</h2>
        
        {myEvents.length === 0 ? (
          <EmptyState message="You haven't created any events in this organization yet." />
        ) : (
          <div className="event-grid">
            {myEvents.map((event) => (
              <Card key={event.id || event._id} padded={false} className="event-card">
                <div className="event-card-banner" />
                <div className="event-card-body">
                  <span className="event-card-title">{event.title || event.name}</span>
                  <span className="event-card-venue">{event.venue || event.location}</span>
                  <Link
                    to={`/org/${org.id || org._id}/event/${event.id || event._id}`}
                    style={{ marginTop: 8, alignSelf: 'flex-start' }}
                  >
                    <Button variant="secondary" size="sm">Manage Event</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
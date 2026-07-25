import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import FormGroup from '../components/ui/FormGroup'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function OrgCreateEvent() {
  const navigate = useNavigate()
  const { orgId } = useParams()

  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateEvent(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await api.post('/events', {
        organizationId: orgId,
        title,
        venue,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      })
      const newEvent = res.data?.data || res.data?.event || res.data
      navigate(`/org/${orgId}/event/${newEvent.id || newEvent._id}`)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not create the event.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-narrow">
      <Card>
        <PageHeader title="Create an event" description="Publish a new event in this workspace." />

        <Alert type="error">{error}</Alert>

        <form onSubmit={handleCreateEvent}>
          <FormGroup label="Event title">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Tech Symposium"
              required
            />
          </FormGroup>

          <FormGroup label="Venue">
            <Input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Main Auditorium, RVCE"
              required
            />
          </FormGroup>

          <FormGroup label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should attendees know about this event?"
            />
          </FormGroup>

          <div className="form-row">
            <FormGroup label="Start date & time">
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup label="End date & time">
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormGroup>
          </div>

          <Button type="submit" block disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish event'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
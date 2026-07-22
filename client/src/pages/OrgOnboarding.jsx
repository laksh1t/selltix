import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import FormGroup from '../components/ui/FormGroup'
import Alert from '../components/ui/Alert'

export default function OrgOnboarding() {
  const [orgName, setOrgName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleCreateOrg(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await api.post('/organizations', { name: orgName })
      const newOrg = res.data?.data || res.data?.organization || res.data
      window.dispatchEvent(new Event('orgChanged'))
      navigate(`/org/${newOrg.id || newOrg._id}/events/create`)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not create your organization.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-narrow">
      <Card>
        <PageHeader 
          title="Host Events with Selltix" 
          description="Organizations let you manage events, view bookings, track analytics, and issue tickets." 
        />

        <Alert type="error">{error}</Alert>

        <form onSubmit={handleCreateOrg}>
          <FormGroup label="Organization Name">
            <Input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Campus Fest Committee"
              required
            />
          </FormGroup>
          <Button type="submit" block disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Organization'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

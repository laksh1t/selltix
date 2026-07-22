import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import Button from '../components/ui/Button'

export default function Organizations() {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  async function fetchOrgs(page = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/organizations?page=${page}&limit=12`)
      const data = res.data?.data;
      setOrgs(data?.items ? data.items : (Array.isArray(data) ? data : []))
      setPagination(res.data?.data?.pagination || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrgs()
  }, [])

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <PageHeader title="Organizations" description="Manage your workspaces." />
        <Link to="/organizations/create"><Button>Create Organization</Button></Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : orgs.length === 0 ? (
        <EmptyState message="You don't belong to any organizations yet." />
      ) : (
        <div className="event-grid">
          {orgs.map(org => (
            <Link key={org.id} to={`/org/${org.id}`}>
              <Card className="event-card" style={{ height: '100%', padding: 24, textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{org.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={fetchOrgs} />
    </div>
  )
}

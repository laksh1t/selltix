import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import FormGroup from '../components/ui/FormGroup'
import Input from '../components/ui/Input'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="page-narrow">
      <Card>
        <PageHeader title="Profile" description="Manage your account settings." />
        <FormGroup label="Name">
          <Input type="text" value={user?.name || ''} readOnly />
        </FormGroup>
        <FormGroup label="Email">
          <Input type="email" value={user?.email || ''} readOnly />
        </FormGroup>
      </Card>
    </div>
  )
}

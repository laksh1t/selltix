import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [hasOrg, setHasOrg] = useState(false)

  useEffect(() => {
    function checkOrgs() {
      if (user) {
        api.get('/organizations')
          .then(res => {
            const data = res.data?.data;
            const orgs = data?.items ? data.items : (Array.isArray(data) ? data : []);
            setHasOrg(orgs.length > 0)
          })
          .catch(err => console.error('Failed to load orgs for navbar', err))
      } else {
        setHasOrg(false)
      }
    }
    
    checkOrgs()
    window.addEventListener('orgChanged', checkOrgs)
    return () => window.removeEventListener('orgChanged', checkOrgs)
  }, [user])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          sell<span>tix</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>

          {user && <Link to="/tickets">My Tickets</Link>}
          
          {(!user || !hasOrg) && <Link to="/organizations/create">Host Event</Link>}
          {user && hasOrg && <Link to="/organizations">Organizations</Link>}
          
          {user && <Link to="/profile">Profile</Link>}

          {user ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ marginLeft: 16 }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginLeft: 16 }}>Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

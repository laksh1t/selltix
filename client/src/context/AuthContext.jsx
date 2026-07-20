import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('selltix_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('selltix_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    api.registerLogout(logout)

    setLoading(false)
  }, [])

  function login(tokens, newUser) {
    localStorage.setItem('selltix_token', tokens.accessToken || tokens)
    if (tokens.refreshToken) {
      localStorage.setItem('selltix_refresh_token', tokens.refreshToken)
    }
    localStorage.setItem('selltix_user', JSON.stringify(newUser))

    setToken(tokens.accessToken || tokens)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('selltix_token')
    localStorage.removeItem('selltix_refresh_token')
    localStorage.removeItem('selltix_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

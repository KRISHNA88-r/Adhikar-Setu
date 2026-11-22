import { createContext, useContext, useMemo, useState } from 'react'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adhikar_token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adhikar_user')) } catch { return null }
  })
  const login = (newToken, newUser) => {
    localStorage.setItem('adhikar_token', newToken)
    localStorage.setItem('adhikar_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }
  const logout = () => {
    localStorage.removeItem('adhikar_token')
    localStorage.removeItem('adhikar_user')
    setToken(null)
    setUser(null)
  }
  const value = useMemo(() => ({ token, user, login, logout }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)

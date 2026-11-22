import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('')
    try { const { data } = await registerUser(form); login(data.token, data.user); navigate('/') }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.') }
    finally { setBusy(false) }
  }
  return <section className="form-page"><form className="panel" onSubmit={submit}>
    <div className="eyebrow">CREATE YOUR ACCOUNT</div><h1>Register</h1>
    <label>Full name<input name="name" value={form.name} onChange={update} required minLength="2" /></label>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={update} required minLength="8" /></label>
    {error && <p className="error">{error}</p>}<button className="button" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
    <p className="muted">Already registered? <Link to="/login">Login</Link></p>
  </form></section>
}

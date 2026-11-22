import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('')
    try { const { data } = await loginUser(form); login(data.token, data.user); navigate('/') }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Check your details.') }
    finally { setBusy(false) }
  }
  return <section className="form-page"><form className="panel" onSubmit={submit}>
    <div className="eyebrow">WELCOME BACK</div><h1>Login</h1>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
    {error && <p className="error">{error}</p>}<button className="button" disabled={busy}>{busy ? 'Please wait…' : 'Login'}</button>
    <p className="muted">New here? <Link to="/register">Create an account</Link></p>
  </form></section>
}

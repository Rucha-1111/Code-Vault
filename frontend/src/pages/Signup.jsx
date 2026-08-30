import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { AuthShell } from './Login'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(username, email, password)
      showToast('Account created — welcome aboard! 🎉')
      navigate('/')
    } catch (err) {
      showToast(err.response?.data?.message || 'Sign up failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start collecting the best of GitHub, your way.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Username">
          <input
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            placeholder="octocat"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="At least 6 characters"
          />
        </Field>
        <button disabled={loading} className="btn-primary text-white font-semibold py-3 rounded-xl mt-2 shadow-card">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-semibold">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

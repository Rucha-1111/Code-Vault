import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      showToast(`Welcome back, ${username}! 🚀`)
      navigate('/')
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep exploring and collecting GitHub gems."
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Username">
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            placeholder="octocat"
          />
        </Field>
        <Field label="Password">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
          />
        </Field>
        <button disabled={loading} className="btn-primary text-white font-semibold py-3 rounded-xl mt-2 shadow-card">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        New here?{' '}
        <Link to="/signup" className="text-brand-600 font-semibold">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <Stars />
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-popup p-8 relative z-10">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white text-xl">
            🐙
          </div>
          <p className="font-display font-bold text-lg text-gray-900">
            GitHub <span className="text-brand-600">Collections</span>
          </p>
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 text-center">{title}</h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
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

function Stars() {
  const stars = Array.from({ length: 26 })
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((_, i) => (
        <span
          key={i}
          className="twinkle absolute text-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${6 + Math.random() * 8}px`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          ✦
        </span>
      ))}
      <div className="absolute -right-10 top-20 text-7xl float-slow opacity-90">🚀</div>
      <div className="absolute left-10 bottom-16 text-6xl float-slow opacity-70" style={{ animationDelay: '1s' }}>
        🪐
      </div>
    </div>
  )
}

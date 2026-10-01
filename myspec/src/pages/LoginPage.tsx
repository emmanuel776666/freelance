import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from '../components/common/Logo'
import Avatar from '../components/common/Avatar'
import { ArrowLeft, CircleHelp, Eye, EyeOff } from 'lucide-react'

/**
 * Combined sign-in / sign-up screen (`/login`).
 *
 * One route and one form handle both modes; `mode` swaps the visible fields and
 * the copy. This avoids a duplicate page and keeps the values the user already
 * typed when they toggle tabs.
 *
 * **Authentication is simulated.** Any non-empty email/password creates a user
 * object and is persisted to `localStorage`; no credentials are verified and
 * nothing leaves the browser. Swapping in a real backend only requires
 * replacing the body of `submit`.
 */
function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'freelancer' | 'client'>('client')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  /**
   * Validate, sign in, and redirect.
   *
   * Native `required`/`type="email"` validation already covers most cases; the
   * explicit guard below is the belt-and-braces check for the register mode's
   * extra name field.
   */
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please complete the required fields.')
      return
    }

    // Signing in with no name given falls back to a demo persona, so the header
    // avatar always has something to render.
    const displayName = name || 'Alex Morgan'

    const nextUser = {
      name: displayName,
      email,
      // On sign-in the role is assumed; only registration captures it.
      role: mode === 'register' ? role : 'freelancer',
      // Initials: first letter of each name part, uppercased, capped at two.
      initials: displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatar: 'https://i.pravatar.cc/100?img=12',
    }

    login(nextUser)
    // `returnTo` is set by the gated flows (apply to a job, message a talent)
    // so the user lands back where they were trying to go.
    navigate(params.get('returnTo') || '/dashboard')
  }

  return (
    <div className="auth-page">
      {/* Slim brand bar, separate from the two-panel body below. */}
      <div className="auth-brand-bar">
        <Logo />
        <Link className="text-link" to="/">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </div>

      <div className="auth-layout">
        {/* --- Marketing panel (hidden on mobile by CSS) ----------------------- */}
        <div className="auth-art">
          <div className="auth-art-content">
            <span className="eyebrow">Make work happen</span>
            <h1>Where great work finds its people.</h1>
            <p>Join a global community of independent professionals and ambitious teams.</p>
            <div className="auth-quote">
              <span className="quote-mark">&ldquo;</span>
              <p>
                FreelanceHub gave me the freedom to find work that fits my life — and the confidence
                to grow my business.
              </p>
              <div>
                <Avatar
                  src="https://i.pravatar.cc/100?img=25"
                  alt="Maya Chen"
                  size="small"
                />
                <span>
                  <strong>Maya Chen</strong>
                  <small>Independent product designer</small>
                </span>
              </div>
            </div>
          </div>
          <div className="auth-art-pattern" />
        </div>

        {/* --- Form panel ------------------------------------------------------ */}
        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-tabs">
              {/* Switching modes clears the error so a stale message from the
                  other tab is not shown. */}
              <button
                className={mode === 'login' ? 'active' : ''}
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
              >
                Sign in
              </button>
              <button
                className={mode === 'register' ? 'active' : ''}
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
              >
                Create account
              </button>
            </div>

            <span className="eyebrow">
              {mode === 'login' ? 'Welcome back' : 'Join the marketplace'}
            </span>
            <h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Pick up where you left off.'
                : 'Start finding work or hiring great people.'}
            </p>

            {error ? (
              <div className="form-alert">
                <CircleHelp size={16} /> {error}
              </div>
            ) : null}

            <form className="auth-form" onSubmit={submit}>
              {/* Name and role only exist during registration. */}
              {mode === 'register' ? (
                <label className="form-field">
                  <span>Full name</span>
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>
              ) : null}

              <label className="form-field">
                <span>Email address</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="form-field">
                <span>Password</span>
                <div className="input-with-icon">
                  <input
                    required
                    // Toggling the input type is the simplest way to reveal the
                    // value; no second field to keep in sync.
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {mode === 'register' ? (
                <label className="form-field">
                  <span>Account type</span>
                  {/* The select yields a string, so it is cast back to the
                      union the `User` type expects. */}
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as 'freelancer' | 'client')}
                  >
                    <option value="freelancer">I want to find work (Freelancer)</option>
                    <option value="client">I want to hire (Client)</option>
                  </select>
                </label>
              ) : null}

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                {mode === 'login' ? (
                  <Link className="text-link" to="/login#forgot">
                    Forgot password?
                  </Link>
                ) : null}
              </div>

              <button className="button button-dark auth-submit" type="submit">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            {/* OAuth affordances — visual only in this prototype. */}
            <div className="social-auth-row">
              <button type="button">
                {/* Inline Google mark: the official brand SVG is not available
                    offline, so the four-colour paths are inlined here. */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button type="button">
                <strong>🍎</strong>
                <span>Apple</span>
              </button>
            </div>

            <p className="auth-legal">
              By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
              <a href="#privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

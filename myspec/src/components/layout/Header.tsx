import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Logo from '../common/Logo'
import Avatar from '../common/Avatar'
import { X, Menu, Search, Bell, LogOut, ChevronDown, ArrowRight } from 'lucide-react'

/**
 * Global site header: primary navigation, marketplace search, and auth-aware
 * account controls.
 *
 * Rendered by every public page and the dashboard, so it must stay stateless
 * beyond its two pieces of local UI state (search box and the mobile menu).
 */
function Header() {
  const [term, setTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // Auth state comes from context so the header reacts to sign-in/out.
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  /** Redirect to `/jobs` with the query encoded into the URL. */
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = term.trim()
    navigate(query ? `/jobs?q=${encodeURIComponent(query)}` : '/jobs')
    // Collapse the mobile drawer so the results are not hidden behind it.
    setMenuOpen(false)
  }

  // Exact-match active state: the search results page should not light up the
  // nav item for every nested `/jobs/:id` route.
  const isActive = (path: string) => location.pathname === path

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Hamburger is CSS-hidden on desktop. */}
        <button
          className="icon-button mobile-menu-button"
          aria-label="Open navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <Logo />

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <Link className={isActive('/jobs') ? 'active' : ''} to="/jobs" onClick={() => setMenuOpen(false)}>
            Find work
          </Link>
          <Link className={isActive('/talent') ? 'active' : ''} to="/talent" onClick={() => setMenuOpen(false)}>
            Find talent
          </Link>
          <a href="#resources" onClick={() => setMenuOpen(false)}>Resources</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        </nav>

        <form className="header-search" onSubmit={submitSearch}>
          <Search size={17} />
          <input
            aria-label="Search jobs, skills, and talent"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search jobs, skills, or talent"
          />
        </form>

        <div className="header-actions">
          {user ? (
            /* --- Signed in ----------------------------------------------------- */
            <>
              <Link to="/dashboard" className="header-user-link">
                <Avatar src={user.avatar} alt={user.name} initials={user.initials} size="small" />
                <span className="header-user-name">{user.name.split(' ')[0]}</span>
                <ChevronDown size={15} />
              </Link>
              <button className="icon-button header-bell" aria-label="Notifications">
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
            </>
          ) : (
            /* --- Signed out --------------------------------------------------- */
            <>
              <Link className="text-link header-signin" to="/login">Sign in</Link>
              <Link className="button button-small button-dark" to="/jobs/new">
                Post a job <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile-only account row: gives small screens a sign-out affordance,
          since the desktop dropdown trigger has no menu of its own yet. */}
      {user ? (
        <div className="mobile-user-row">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <Avatar src={user.avatar} alt={user.name} initials={user.initials} size="small" />
            <span>{user.name}</span>
          </Link>
          <button onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      ) : null}
    </header>
  )
}

export default Header

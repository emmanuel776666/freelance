import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { dashboardStats } from '../data/dashboard'
import { notifications } from '../data/notifications'
import { activity } from '../data/activity'
import { jobs } from '../data/jobs'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Avatar from '../components/common/Avatar'
import JobCard from '../components/jobs/JobCard'
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  Handshake,
  MessageCircle,
  DollarSign,
  Settings2,
  LogOut,
  ChevronRight,
  Bell,
  TrendingUp,
  CheckCircle2,
  Menu,
  ArrowRight,
} from 'lucide-react'
import type { Job } from '../types/job'

/**
 * The seven panels the dashboard can show. The sidebar, the topbar breadcrumb,
 * and the content switcher are all driven by this single union.
 */
type DashboardView =
  | 'overview'
  | 'saved'
  | 'proposals'
  | 'contracts'
  | 'messages'
  | 'earnings'
  | 'settings'

/** Shown in the topbar breadcrumb when `?view=` holds an unrecognised value. */
const DEFAULT_VIEW: DashboardView = 'overview'

/** Narrows an arbitrary query-string value to a known `DashboardView`. */
function isDashboardView(value: string | null): value is DashboardView {
  return (
    value === 'overview' ||
    value === 'saved' ||
    value === 'proposals' ||
    value === 'contracts' ||
    value === 'messages' ||
    value === 'earnings' ||
    value === 'settings'
  )
}

/**
 * Signed-in workspace (`/dashboard`).
 *
 * A single route hosting seven panels rather than seven routes. The active
 * panel is mirrored into the `?view=` query param so links from elsewhere in
 * the app (the "View my proposals" button in `ApplyModal`, for example) can
 * deep-link into a specific panel while keeping the URL shareable.
 */
function DashboardPage() {
  const { user, logout, savedJobs } = useApp()
  const [params, setParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Read the panel from the URL, ignoring anything unrecognised.
  const requestedView = params.get('view')
  const view: DashboardView = isDashboardView(requestedView) ? requestedView : DEFAULT_VIEW

  // The saved-jobs panel renders full `Job` objects, so the id map held in
  // context has to be resolved back against the job list.
  const savedJobObjects = jobs.filter((job) => savedJobs[job.id])

  /** Switch panels by writing the new view to the URL. */
  const selectView = (next: DashboardView) => {
    setParams({ view: next })
    // Also close the mobile drawer, which would otherwise cover the new panel.
    setSidebarOpen(false)
  }

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    // The saved-jobs badge is real; it is derived from the persisted map.
    { id: 'saved', label: 'Saved jobs', icon: <Bookmark size={20} />, badge: savedJobObjects.length.toString() },
    { id: 'proposals', label: 'Proposals', icon: <FileText size={20} />, badge: '8' },
    { id: 'contracts', label: 'Contracts', icon: <Handshake size={20} />, badge: '3' },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} />, badge: '12' },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings2 size={20} /> },
  ]

  const activeLabel = navItems.find((item) => item.id === view)?.label

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-layout">
        {/* --- Sidebar --------------------------------------------------------- */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <div className="dashboard-user">
            <Avatar
              src={user?.avatar}
              alt={user?.name || ''}
              initials={user?.initials}
              size="medium"
            />
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
            <button
              className="icon-button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="dashboard-profile-progress">
            <div>
              <span>Profile completion</span>
              <strong>85%</strong>
            </div>
            {/* Hard-coded progress; a real value would come from the profile API. */}
            <div className="progress-track">
              <span style={{ width: '85%' }} />
            </div>
            <small>Add a portfolio to reach 100%</small>
          </div>

          <nav className="dashboard-nav">
            <div className="dashboard-nav-label">Main</div>
            {/* First three entries are "Main"; the rest are grouped under
                "Business" purely for visual hierarchy. */}
            {navItems.slice(0, 3).map((item) => (
              <DashboardNavItem
                key={item.id}
                item={item}
                active={view === item.id}
                onClick={() => selectView(item.id)}
              />
            ))}
            <div className="dashboard-nav-label second">Business</div>
            {navItems.slice(3).map((item) => (
              <DashboardNavItem
                key={item.id}
                item={item}
                active={view === item.id}
                onClick={() => selectView(item.id)}
              />
            ))}
          </nav>

          <div className="dashboard-sidebar-bottom">
            <button onClick={logout}>
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </aside>

        {/* --- Main ------------------------------------------------------------ */}
        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div className="dashboard-breadcrumb">
              <Link to="/dashboard" className="text-link">
                <LayoutDashboard size={16} />
              </Link>
              <ChevronRight size={14} />
              <strong>{activeLabel}</strong>
            </div>

            <div className="dashboard-top-actions">
              {/* Notification bell with an inline dropdown, rather than a route,
                  so it can be opened without losing the current panel. */}
              <div className="notification-wrap">
                <button
                  className="icon-button dashboard-notification"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => setNotificationsOpen((open) => !open)}
                >
                  <Bell size={20} />
                  <span className="notification-dot" />
                </button>

                {notificationsOpen ? (
                  <div className="notification-popover" role="dialog" aria-label="Notifications">
                    <div className="notification-popover-heading">
                      <strong>Notifications</strong>
                      <span>{notifications.filter((n) => n.unread).length} new</span>
                    </div>
                    <div className="notification-list">
                      {notifications.map((item) => (
                        <div
                          className={`notification-row ${item.unread ? 'is-unread' : ''}`}
                          key={item.id}
                        >
                          <span className="notification-row-icon">
                            {item.type === 'proposal' && <FileText size={15} />}
                            {item.type === 'message' && <MessageCircle size={15} />}
                            {item.type === 'payment' && <DollarSign size={15} />}
                            {item.type === 'job' && <LayoutDashboard size={15} />}
                          </span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.text}</p>
                            <small>{item.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="panel-footer-link">Mark all as read</button>
                  </div>
                ) : null}
              </div>

              {/* Hamburger, shown only on small screens. */}
              <button
                className="icon-button"
                aria-label="Menu"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* One panel rendered at a time. Each is a small local component so
              this file stays a dispatcher rather than a monolith. */}
          <div className="dashboard-content">
            {view === 'overview' && <DashboardOverview />}
            {view === 'saved' && <DashboardSavedJobs jobs={savedJobObjects} />}
            {view === 'proposals' && <DashboardProposals />}
            {view === 'contracts' && <DashboardContracts />}
            {view === 'messages' && <DashboardMessages />}
            {view === 'earnings' && <DashboardEarnings />}
            {view === 'settings' && <DashboardSettings />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

/** One row in the dashboard sidebar navigation. */
function DashboardNavItem({
  item,
  active,
  onClick,
}: {
  item: { id: string; label: string; icon: React.ReactNode; badge?: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={`dashboard-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {item.icon}
      <span>{item.label}</span>
      {/* Badge is omitted entirely when the nav item has no count. */}
      {item.badge && <small>{item.badge}</small>}
    </button>
  )
}

/**
 * Default dashboard panel: KPI tiles, active contracts, an earnings chart,
 * recent activity, and job recommendations.
 *
 * All figures are static seed values; the layout is the real deliverable here.
 */
function DashboardOverview() {
  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome back,</h1>
          <p>Here's what's happening with your work this week.</p>
        </div>
        <Link className="button button-dark" to="/jobs/new">
          Post a job <ArrowRight size={16} />
        </Link>
      </div>

      {/* --- KPI tiles --------------------------------------------------------- */}
      <div className="stats-grid">
        {dashboardStats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            {/* `direction` maps to a colour class; only "up" gets the icon. */}
            <small
              className={
                stat.direction === 'up'
                  ? 'positive'
                  : stat.direction === 'down'
                    ? 'negative'
                    : 'neutral'
              }
            >
              {stat.direction === 'up' && <TrendingUp size={12} />}
              {stat.direction === 'down' && <TrendingUp size={12} />}
              {stat.change}
            </small>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        {/* --- Active contracts ------------------------------------------------- */}
        <div className="dashboard-panel">
          <div className="panel-heading">
            <h2>Active contracts</h2>
            <Link className="text-link" to="/dashboard?view=contracts">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="contract-row">
            <div className="contract-row-top">
              <div>
                <strong>Shopify Developer for Custom Storefront</strong>
                <span>Northstar Goods · Fixed-price · $1,500–$2,500</span>
              </div>
              <strong className="positive">$1,200 earned</strong>
            </div>
            <div className="contract-row-bottom">
              <span className="status-label green">
                <i /> Active
              </span>
              <div className="mini-progress">
                <span style={{ width: '65%' }} />
              </div>
              <small>65% complete</small>
            </div>
          </div>
          <div className="contract-row">
            <div className="contract-row-top">
              <div>
                <strong>AI Chatbot for SaaS Support</strong>
                <span>Lumen Labs · Fixed-price · $3,000–$5,000</span>
              </div>
              <strong className="positive">$2,500 earned</strong>
            </div>
            <div className="contract-row-bottom">
              <span className="status-label green">
                <i /> Active
              </span>
              <div className="mini-progress">
                <span style={{ width: '40%' }} />
              </div>
              <small>40% complete</small>
            </div>
          </div>
          <div className="contract-row">
            <div className="contract-row-top">
              <div>
                <strong>React Analytics Dashboard</strong>
                <span>Aster Analytics · Hourly · $40–$60/hr</span>
              </div>
              <strong className="positive">$3,800 earned</strong>
            </div>
            <div className="contract-row-bottom">
              <span className="status-label orange">
                <i /> Ending soon
              </span>
              <div className="mini-progress">
                <span style={{ width: '90%' }} />
              </div>
              <small>90% complete</small>
            </div>
          </div>
          <button className="panel-footer-link">
            View all contracts <ArrowRight size={14} />
          </button>
        </div>

        {/* --- Weekly earnings chart -------------------------------------------- */}
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Earnings this month</h2>
              <span>
                $4,280 <TrendingUp size={14} className="positive" /> +18.4%
              </span>
            </div>
          </div>
          {/* Hand-rolled bar chart: each bar is a percentage height, and the
              current day is highlighted with the `current` class. */}
          <div className="earnings-chart">
            {[
              { value: 65, current: false },
              { value: 45, current: false },
              { value: 78, current: false },
              { value: 90, current: true },
              { value: 55, current: false },
              { value: 30, current: false },
              { value: 25, current: false },
            ].map((bar, i) => (
              <span
                key={i}
                className={bar.current ? 'current' : ''}
                style={{ height: `${bar.value}%` }}
              />
            ))}
          </div>
          <div className="chart-labels">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-columns lower-columns" style={{ marginTop: '15px' }}>
        {/* --- Activity feed ---------------------------------------------------- */}
        <div className="dashboard-panel full-panel">
          <div className="panel-heading">
            <h2>Recent activity</h2>
            <Link className="text-link" to="/dashboard#activity">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {activity.map((item, i) => (
              <div className="activity-row" key={i}>
                {/* `color` picks both the tile background and the icon. */}
                <span className={`activity-icon ${item.color}`}>
                  {item.color === 'green' && <DollarSign size={14} />}
                  {item.color === 'blue' && <FileText size={14} />}
                  {item.color === 'purple' && <MessageCircle size={14} />}
                  {item.color === 'orange' && <CheckCircle2 size={14} />}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <div className="activity-value">
                  <strong>{item.amount}</strong>
                  <small>{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Recommendations -------------------------------------------------- */}
        <div className="dashboard-panel full-panel">
          <div className="panel-heading">
            <h2>Recommended for you</h2>
            <Link className="text-link" to="/jobs">
              Browse jobs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {/* The seed list is newest-first, so the first three are the freshest. */}
            {jobs.slice(0, 3).map((job) => (
              <div className="recommended-row" key={job.id}>
                <div>
                  <strong>{job.title}</strong>
                  <span>
                    {job.client} · {job.budgetLabel} · {job.budgetType}
                  </span>
                </div>
                <button className="icon-button" aria-label={`Save ${job.title}`}>
                  <Bookmark size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Saved jobs panel.
 *
 * The only dashboard panel driven by real app state: the parent resolves the
 * saved id map into `Job` objects and passes them in.
 */
function DashboardSavedJobs({ jobs: savedJobs }: { jobs: Job[] }) {
  return (
    <>
      <div className="dashboard-page-heading">
        <h1>Saved jobs</h1>
        {/* Pluralise the count rather than always writing "jobs". */}
        <p>
          {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
        </p>
      </div>
      {savedJobs.length ? (
        <div className="dashboard-job-grid">
          {/* `compact` drops the client footer to fit the narrower grid. */}
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} compact />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="empty-icon">
            <Bookmark size={40} />
          </div>
          <h3>No saved jobs yet</h3>
          <p>Save jobs you're interested in to find them here quickly.</p>
          <Link className="button button-dark" to="/jobs">
            <ArrowRight size={16} /> Browse jobs
          </Link>
        </div>
      )}
    </>
  )
}

/*
 * The remaining panels are deliberately stubs: they prove the navigation and
 * routing work end to end, and give each nav entry a real destination. Each
 * takes over once its corresponding data source exists.
 */

/** Placeholder for the proposals list. */
function DashboardProposals() {
  return (
    <div className="dashboard-page-heading">
      <h1>Proposals</h1>
      <Link className="button button-dark" to="/jobs">
        Find more jobs <ArrowRight size={16} />
      </Link>
    </div>
  )
}

/** Placeholder for the contracts list. */
function DashboardContracts() {
  return (
    <div className="dashboard-page-heading">
      <h1>Contracts</h1>
    </div>
  )
}

/** Placeholder for the messaging inbox. */
function DashboardMessages() {
  return (
    <div className="dashboard-page-heading">
      <h1>Messages</h1>
    </div>
  )
}

/** Placeholder for the earnings breakdown. */
function DashboardEarnings() {
  return (
    <div className="dashboard-page-heading">
      <h1>Earnings</h1>
    </div>
  )
}

/** Placeholder for account settings. */
function DashboardSettings() {
  return (
    <div className="dashboard-page-heading">
      <h1>Settings</h1>
    </div>
  )
}

export default DashboardPage

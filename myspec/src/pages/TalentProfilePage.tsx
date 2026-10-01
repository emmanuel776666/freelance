import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { talents } from '../data/talents'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Avatar from '../components/common/Avatar'
import NotFoundPage from './NotFoundPage'
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  Heart,
  CheckCircle2,
  ArrowRight,
  Star,
  ShieldCheck,
} from 'lucide-react'

/**
 * Freelancer profile page (`/talent/:talentId`).
 *
 * The client-facing counterpart to `JobDetailsPage`: the same two-column layout
 * (content + action sidebar) and the same 404 fallback for an unknown id.
 */
function TalentProfilePage() {
  const { talentId } = useParams()
  const talent = talents.find((item) => item.id === talentId)
  const { user, showToast } = useApp()
  const navigate = useNavigate()

  // Unknown id: render the shared 404 page. Runs after all hook calls.
  if (!talent) return <NotFoundPage />

  /**
   * Start a conversation, gating on sign-in.
   *
   * Sends anonymous visitors to login with a `returnTo` back to this profile,
   * mirroring the "apply" flow on a job detail page.
   */
  const messageTalent = () => {
    if (!user) {
      navigate(`/login?returnTo=/talent/${talent.id}`)
      return
    }
    // Placeholder for opening a real message composer.
    showToast(`Message draft started with ${talent.name}`, 'info')
  }

  return (
    <div className="public-page talent-profile-page">
      <Header />
      <main>
        {/* --- Breadcrumbs ----------------------------------------------------- */}
        <div className="page-width breadcrumbs">
          <Link to="/talent">Find talent</Link>
          <ChevronRight size={14} />
          <span>{talent.name}</span>
        </div>

        {/* --- Hero ------------------------------------------------------------- */}
        <section className="talent-profile-hero page-width">
          <div className="profile-hero-person">
            <Avatar src={talent.avatar} alt={talent.name} size="xxlarge" />
            {/* Status dot sits on the avatar's corner, like a presence badge. */}
            <span className={`availability-dot large ${talent.available ? 'available' : ''}`} />
          </div>
          <div className="profile-hero-copy">
            <span className="eyebrow">Independent professional</span>
            <h1>{talent.name}</h1>
            <p className="profile-hero-title">{talent.title}</p>
            <div className="profile-hero-meta">
              <span className="stars small-stars">★★★★★</span>
              <strong>{talent.rating}</strong>
              <span>({talent.reviews} reviews)</span>
              <span className="meta-separator">·</span>
              <MapPin size={15} />
              <span>{talent.location}</span>
              {talent.available ? <span className="available-label">Available</span> : null}
            </div>
            <div className="profile-hero-actions">
              <button className="button button-primary-full" onClick={messageTalent}>
                <MessageCircle size={17} /> Contact {talent.name.split(' ')[0]}
              </button>
              <button
                className="button button-outline"
                onClick={() => showToast('Profile saved to your shortlist', 'info')}
              >
                <Heart size={17} /> Save
              </button>
            </div>
          </div>
          <div className="profile-rate-card">
            <span>Hourly rate</span>
            <strong>{talent.rate}</strong>
            <small>Based on 20+ projects</small>
          </div>
        </section>

        <div className="page-width talent-profile-layout">
          {/* --- Main column ----------------------------------------------------- */}
          <article className="talent-profile-content">
            <section className="detail-card profile-about">
              <div className="card-section-heading">
                <h2>About</h2>
                <span className="profile-completion">
                  <CheckCircle2 size={16} /> Profile complete
                </span>
              </div>
              {/* The profile's own bio, then shared boilerplate on working style. */}
              <p>{talent.bio}</p>
              <p>
                I'm at my best when a project has a clear goal, room for thoughtful execution, and
                a collaborative team. I bring a point of view, communicate proactively, and care
                about the details that make work feel effortless for everyone involved.
              </p>
            </section>

            <section className="detail-card">
              <div className="card-section-heading">
                <h2>Portfolio</h2>
                <button className="text-link arrow-link">
                  View all <ArrowRight size={15} />
                </button>
              </div>
              {/* Placeholder tiles: real work would come from an uploads API. */}
              <div className="portfolio-grid">
                <div className="portfolio-item portfolio-one">
                  <span>Northwind / Finance app</span>
                  <strong>Make money feel simpler.</strong>
                  <small>Product design · 2024</small>
                </div>
                <div className="portfolio-item portfolio-two">
                  <span>Field Notes / Editorial</span>
                  <strong>Stories for curious minds.</strong>
                  <small>Art direction · 2023</small>
                </div>
              </div>
            </section>

            <section className="detail-card">
              <div className="card-section-heading">
                <h2>Reviews</h2>
                <span className="review-summary">
                  <strong>{talent.rating}</strong>
                  <span className="stars small-stars">★★★★★</span>
                  <small>{talent.reviews} reviews</small>
                </span>
              </div>
              <div className="review-item">
                <Avatar src="https://i.pravatar.cc/100?img=42" alt="Olivia Martin" size="small" />
                <div>
                  <div className="review-item-top">
                    <strong>Olivia Martin</strong>
                    <span>2 weeks ago</span>
                  </div>
                  <p>
                    &ldquo;{talent.name.split(' ')[0]} brought clarity to a complex brief and
                    delivered work that exceeded our expectations. A true partner from start to
                    finish.&rdquo;
                  </p>
                  <span className="review-project">Product design sprint · 5.0</span>
                </div>
              </div>
            </section>
          </article>

          {/* --- Sidebar ---------------------------------------------------------- */}
          <aside className="talent-profile-sidebar">
            <div className="detail-sidebar-card skills-card">
              <h3>Skills &amp; expertise</h3>
              <div className="detail-skill-list">
                {talent.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-sidebar-card availability-card">
              <h3>Availability</h3>
              <p>Typically responds within a few hours</p>
              <div className="availability-heading">
                <span className={`availability-dot ${talent.available ? 'available' : ''}`} />
                <strong>{talent.available ? 'Available for work' : 'Not currently available'}</strong>
              </div>
              {/* Static weekly hours; a real profile would store these. */}
              <div className="availability-row">
                <span>Mon–Fri</span>
                <strong>9am–6pm</strong>
              </div>
              <div className="availability-row">
                <span>Sat</span>
                <strong>10am–2pm</strong>
              </div>
              <div className="availability-row">
                <span>Sun</span>
                <strong>Unavailable</strong>
              </div>
            </div>

            <div className="profile-trust-card">
              <ShieldCheck size={24} />
              <strong>Payment protection</strong>
              <p>All payments are handled securely through FreelanceHub's escrow system.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TalentProfilePage

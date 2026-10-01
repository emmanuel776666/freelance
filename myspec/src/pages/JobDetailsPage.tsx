import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { jobs } from '../data/jobs'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SectionHeading from '../components/common/SectionHeading'
import JobCard from '../components/jobs/JobCard'
import ApplyModal from '../components/jobs/ApplyModal'
import Avatar from '../components/common/Avatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import NotFoundPage from './NotFoundPage'
import {
  ChevronRight,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  CheckCircle2,
  MoreHorizontal,
  Star,
  CalendarDays,
  UsersRound,
  Globe2,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
  LockKeyhole,
} from 'lucide-react'

/**
 * Job detail page (`/jobs/:jobId`).
 *
 * Resolves the route param against the seed data. An unknown id renders the
 * shared 404 page instead of a blank screen.
 */
function JobDetailsPage() {
  const { jobId } = useParams()
  const job = jobs.find((item) => item.id === jobId)
  const [applyOpen, setApplyOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { user, isSaved, toggleSave, showToast } = useApp()
  const navigate = useNavigate()

  // Unknown id: hand off to the 404 page. This happens after every hook call,
  // so hook order is unaffected.
  if (!job) return <NotFoundPage />

  // Suggestions are jobs that share at least one skill, capped at three.
  // Narrowing the pool with `.filter` first keeps the comparison O(n) rather
  // than sorting the whole list.
  const related = jobs
    .filter((item) => item.id !== job.id && item.skills.some((skill) => job.skills.includes(skill)))
    .slice(0, 3)

  /**
   * Open the proposal modal, or send anonymous visitors to sign in first.
   *
   * `returnTo` lets `LoginPage` bounce the user straight back here after
   * authenticating. Resetting `submitted` on open means a reopened modal always
   * shows the form, not the success state.
   */
  const handleApply = () => {
    if (!user) {
      navigate(`/login?returnTo=/jobs/${job.id}`)
      return
    }
    setSubmitted(false)
    setApplyOpen(true)
  }

  /**
   * Fake submission: flip to the success state and raise a toast.
   *
   * In a real implementation this would POST the cover letter and rate to the
   * proposals API before transitioning.
   */
  const submitApplication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    showToast('Your proposal has been sent to the client')
  }

  return (
    <div className="public-page job-details-page">
      <Header />
      <main>
        {/* --- Breadcrumbs ----------------------------------------------------- */}
        <div className="page-width breadcrumbs">
          <Link to="/jobs">Find work</Link>
          <ChevronRight size={14} />
          {/* Truncated with CSS: job titles can be very long. */}
          <span>{job.title}</span>
        </div>

        {/* --- Header: title, meta, primary actions ---------------------------- */}
        <section className="page-width job-detail-header">
          <div>
            <div className="detail-eyebrow">
              <span className="live-dot" /> Posted {job.posted} <span>·</span> {job.location}
            </div>
            <h1>{job.title}</h1>
            <div className="detail-header-meta">
              <span className="detail-pill budget-pill">
                <DollarSign size={15} /> {job.budgetLabel}
              </span>
              <span className="detail-pill">{job.budgetType}</span>
              <span className="detail-pill">{job.experience} level</span>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className={`button button-outline ${isSaved(job.id) ? 'button-saved' : ''}`}
              onClick={() => toggleSave(job.id)}
            >
              {isSaved(job.id) ? (
                <BookmarkCheck size={17} fill="currentColor" />
              ) : (
                <Bookmark size={17} />
              )}
              {isSaved(job.id) ? 'Saved' : 'Save job'}
            </button>
            <button className="button button-dark" onClick={handleApply}>
              Apply now <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <div className="page-width detail-layout">
          {/* --- Main column ---------------------------------------------------- */}
          <article className="detail-content">
            <section className="detail-card description-card">
              <h2>About the project</h2>
              {/* Client-written text, then shared boilerplate describing
                  expectations that apply to every posting. */}
              <p>{job.description}</p>
              <p>
                You'll work with a small, collaborative team and have the opportunity to make a
                meaningful impact from day one. We're looking for someone who is proactive,
                communicates clearly, and takes pride in delivering thoughtful work.
              </p>
              <h3>What you'll deliver</h3>
              <ul className="check-list">
                <li>
                  <CheckCircle2 size={17} /> A clear plan and regular progress updates
                </li>
                <li>
                  <CheckCircle2 size={17} /> High-quality work that is ready for launch
                </li>
                <li>
                  <CheckCircle2 size={17} /> Documentation and a smooth handoff
                </li>
              </ul>
            </section>

            <section className="detail-card">
              <h2>Skills and expertise</h2>
              <div className="detail-skill-list">
                {/* Unlike the cards, the detail page shows every tag. */}
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="detail-card client-detail-card">
              <div className="client-detail-heading">
                <Avatar
                  src={job.clientAvatar}
                  alt={job.client}
                  initials={job.clientInitials}
                  size="xlarge"
                />
                <div>
                  <h2>{job.client}</h2>
                  <p>Client since 2022 · United States</p>
                  <VerifiedBadge />
                </div>
                <button className="icon-button" aria-label="More client options">
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <div className="client-stats">
                <div>
                  <strong>{job.clientRating}</strong>
                  <span>
                    <Star size={13} fill="currentColor" /> Rating
                  </span>
                </div>
                <div>
                  <strong>{job.clientSpend}</strong>
                  <span>Total spent</span>
                </div>
                <div>
                  <strong>92%</strong>
                  <span>Hire rate</span>
                </div>
              </div>

              <div className="client-about">
                <p>
                  {job.client} is a fast-growing consumer brand focused on making everyday essentials
                  feel more considered. Their team is collaborative, kind, and comfortable giving
                  creative partners room to do their best work.
                </p>
                <Link className="text-link" to="/talent">
                  View client's past projects <ArrowRight size={15} />
                </Link>
              </div>
            </section>
          </article>

          {/* --- Sticky action sidebar ----------------------------------------- */}
          <aside className="detail-sidebar">
            <div className="apply-card">
              <div className="apply-card-top">
                <span>Ready to get started?</span>
                <Sparkles size={20} />
              </div>
              <h3>Send a proposal</h3>
              <p>Tell the client what you can do and why you're a great fit for this project.</p>
              <button className="button button-primary-full" onClick={handleApply}>
                Apply for this job <ArrowRight size={17} />
              </button>
              <div className="apply-card-foot">
                <ShieldCheck size={15} /> You won't be charged to apply
              </div>
            </div>

            <div className="detail-sidebar-card">
              <h3>Job overview</h3>
              <DetailMeta icon={<CalendarDays size={17} />} label="Posted" value={job.posted} />
              <DetailMeta
                icon={<UsersRound size={17} />}
                label="Proposals"
                value={`${job.proposals} so far`}
              />
              <DetailMeta icon={<Globe2 size={17} />} label="Location" value={job.location} />
              <DetailMeta
                icon={<BriefcaseBusiness size={17} />}
                label="Project length"
                value="1–3 months"
              />
            </div>

            <div className="safety-card">
              <LockKeyhole size={19} />
              <div>
                <strong>Stay safe on FreelanceHub</strong>
                <p>Never share payment details or agree to work outside the platform.</p>
                <a href="#safety">
                  Learn more <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* --- Related jobs ---------------------------------------------------- */}
        {related.length ? (
          <section className="section page-width related-section">
            <SectionHeading
              title="You might also like"
              action={
                <Link className="text-link arrow-link" to="/jobs">
                  See more jobs <ArrowRight size={16} />
                </Link>
              }
            />
            <div className="job-grid">
              {related.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />

      {/* Modal is mounted only while open, so its form state resets each time. */}
      {applyOpen ? (
        <ApplyModal
          job={job}
          submitted={submitted}
          onClose={() => setApplyOpen(false)}
          onSubmit={submitApplication}
        />
      ) : null}
    </div>
  )
}

/** Label/value row used in the "Job overview" sidebar card. */
function DetailMeta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="detail-meta">
      <span className="detail-meta-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

export default JobDetailsPage

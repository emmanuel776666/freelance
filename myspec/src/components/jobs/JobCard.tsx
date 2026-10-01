import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../common/Avatar'
import VerifiedBadge from '../common/VerifiedBadge'
import type { Job } from '../../types/job'

interface JobCardProps {
  job: Job
  /**
   * Compact mode drops the client footer, producing a shorter card for
   * sidebars and grids (the dashboard's saved-jobs list) where vertical space
   * is tighter.
   */
  compact?: boolean
}

/**
 * Job summary card used on the home page, the `/jobs` result list, the
 * "you might also like" row on a job detail page, and the dashboard.
 *
 * The card is a plain `<article>` rather than a link: only the title is a
 * router link so that the save button remains an independently clickable
 * control instead of being swallowed by a nested-anchor click.
 */
function JobCard({ job, compact = false }: JobCardProps) {
  // Saved state lives in context so the same job stays in sync across every
  // screen that renders a card for it.
  const { isSaved, toggleSave } = useApp()
  const saved = isSaved(job.id)

  return (
    <article className={`job-card ${compact ? 'job-card-compact' : ''}`}>
      <div className="job-card-heading">
        <div>
          {/* Only the title navigates, to keep the card's other controls usable. */}
          <Link className="job-card-title" to={`/jobs/${job.id}`}>
            {job.title}
          </Link>
          <div className="job-card-subtitle">
            <span>{job.client}</span>
            <span className="subtle-dot">•</span>
            <span>{job.posted}</span>
          </div>
        </div>

        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleSave(job.id)}
          aria-label={saved ? 'Remove saved job' : 'Save job'}
          title={saved ? 'Remove saved job' : 'Save job'}
        >
          {saved ? <BookmarkCheck size={19} fill="currentColor" /> : <Bookmark size={19} />}
        </button>
      </div>

      <p className="job-card-description">{job.description}</p>

      <div className="job-card-budget-row">
        <span className="job-budget">{job.budgetLabel}</span>
        <span className="job-type">{job.budgetType}</span>
        <span className="job-proposals">{job.proposals} proposals</span>
      </div>

      <div className="skill-row">
        {/* Cap the visible tags; overflow is summarised as "+N". */}
        {job.skills.slice(0, 3).map((skill) => (
          <span className="skill-chip" key={skill}>
            {skill}
          </span>
        ))}
        {job.skills.length > 3 ? <span className="skill-more">+{job.skills.length - 3}</span> : null}
      </div>

      {!compact ? (
        <div className="job-card-client">
          <Avatar src={job.clientAvatar} alt={job.client} initials={job.clientInitials} size="small" />
          <div className="client-inline">
            <strong>{job.client}</strong>
            <span>
              <Star size={12} fill="currentColor" /> {job.clientRating} ({job.clientReviews})
            </span>
          </div>
          {job.paymentVerified ? (
            <VerifiedBadge label="Verified" />
          ) : (
            <span className="unverified-label">Not verified</span>
          )}
        </div>
      ) : null}
    </article>
  )
}

export default JobCard

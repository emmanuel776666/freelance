import { X, Check, Send, Upload, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Job } from '../../types/job'

interface ApplyModalProps {
  job: Job
  /** When true the modal swaps to its success confirmation instead of the form. */
  submitted: boolean
  onClose: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

/**
 * Proposal dialog opened from a job detail page.
 *
 * The component is intentionally stateless: `JobDetailsPage` owns the
 * `submitted` flag and the submit handler, so closing and reopening the modal
 * always starts from a clean form.
 */
function ApplyModal({ job, submitted, onClose, onSubmit }: ApplyModalProps) {
  return (
    // Clicking the backdrop itself (but not the dialog) dismisses the modal.
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-title">
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close proposal form">
          <X size={19} />
        </button>

        {submitted ? (
          /* --- Success state ------------------------------------------------- */
          <div className="modal-success">
            <span className="success-icon">
              <Check size={28} />
            </span>
            <h2>Proposal sent!</h2>
            <p>
              Your proposal for <strong>{job.title}</strong> is on its way to {job.client}. You can
              track its status from your dashboard.
            </p>
            <Link className="button button-dark" to="/dashboard?view=proposals" onClick={onClose}>
              View my proposals <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* --- Form state --------------------------------------------------- */
          <>
            <div className="modal-heading">
              <span className="eyebrow">Send a proposal</span>
              <h2 id="apply-title">{job.title}</h2>
              <p>Make a strong first impression with a thoughtful, specific proposal.</p>
            </div>

            <form onSubmit={onSubmit}>
              <label className="form-field">
                <span>Your cover letter</span>
                {/* `minLength` mirrors the 80-character minimum the real product
                    enforces, giving instant native feedback before submit. */}
                <textarea
                  required
                  minLength={80}
                  placeholder="Tell the client about your experience and how you can help…"
                  rows={6}
                />
              </label>

              <div className="form-two-col">
                <label className="form-field">
                  <span>Proposed rate</span>
                  <input required defaultValue="45" type="number" min="1" />
                </label>
                <label className="form-field">
                  <span>Estimated duration</span>
                  <select defaultValue="1–3 months">
                    <option>Less than 1 month</option>
                    <option>1–3 months</option>
                    <option>3–6 months</option>
                    <option>6+ months</option>
                  </select>
                </label>
              </div>

              <div className="upload-box">
                <Upload size={18} />
                <span>
                  <strong>Attach a portfolio file</strong>
                  <small>PDF, DOCX, or ZIP up to 10MB</small>
                </span>
                {/* Visual affordance only; wire to a real file input when a
                    storage/upload API exists. */}
                <button type="button" className="button button-outline button-small">Browse</button>
              </div>

              <div className="form-actions">
                <button type="button" className="button button-ghost" onClick={onClose}>Cancel</button>
                <button className="button button-dark" type="submit">
                  Send proposal <Send size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplyModal

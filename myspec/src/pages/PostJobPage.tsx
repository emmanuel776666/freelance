import { useState } from 'react'
// `FormEvent` is a type, so it must be imported type-only under
// `verbatimModuleSyntax` — otherwise it would survive into the emitted bundle.
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

/** Wizard steps, in order. The sidebar highlights everything up to the current one. */
const TOTAL_STEPS = 3

/**
 * Three-step "post a job" wizard (`/jobs/new`).
 *
 * All three steps share a single `<form>` and are swapped with a `step` state
 * value rather than being separate routes. That keeps the entered values mounted
 * for the whole flow, and means "Back" is a state decrement rather than a
 * history navigation.
 *
 * Only step 1 has real controlled inputs. Steps 2 and 3 are static
 * `defaultValue` fields and a review panel, which is enough to demonstrate the
 * flow; wiring them to state is the natural next step when a POST endpoint
 * exists.
 */
function PostJobPage() {
  const { user, showToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Posting a job is a client-only action, so signed-out visitors get a gate
  // that sends them to login with a `returnTo` back to this page.
  //
  // This early return sits *after* every hook call, so hook order stays stable
  // across the signed-in/signed-out branches.
  if (!user) {
    return (
      <div className="auth-prompt-page">
        <div className="auth-prompt-card">
          <span className="eyebrow">Sign in required</span>
          <h1>Sign in to post a job</h1>
          <p>Create an account to connect with talented independent professionals.</p>
          <Link className="button button-dark" to="/login?returnTo=/jobs/new">
            Sign in <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  /**
   * One submit handler for all three steps.
   *
   * Steps 1 and 2 advance the wizard (the browser's native `required`
   * validation gates each transition). Step 3 is terminal: it "publishes" the
   * job and returns the client to their dashboard.
   */
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1)
      return
    }
    showToast('Your job is now live')
    // Back to the dashboard overview: there is no dedicated "my jobs" panel yet.
    navigate('/dashboard')
  }

  return (
    <div className="public-page">
      <Header />
      <main className="post-job-main">
        <div className="page-width post-job-layout">
          {/* --- Progress rail ------------------------------------------------- */}
          <aside className="post-job-steps">
            <h1>Post a job</h1>
            <p>Three quick steps to find the right talent.</p>
            <div className="step-list">
              {/* `step >= n` keeps completed steps highlighted as you advance. */}
              <div className={step >= 1 ? 'active' : ''}>
                <span>1</span>
                <div>
                  <strong>Job details</strong>
                  <small>Title, description, skills</small>
                </div>
              </div>
              <div className={step >= 2 ? 'active' : ''}>
                <span>2</span>
                <div>
                  <strong>Budget & timeline</strong>
                  <small>Rate, duration, experience</small>
                </div>
              </div>
              <div className={step >= 3 ? 'active' : ''}>
                <span>3</span>
                <div>
                  <strong>Review & publish</strong>
                  <small>Confirm and post</small>
                </div>
              </div>
            </div>
            <div className="post-tip">
              <Sparkles size={18} />
              <div>
                <strong>Tip:</strong> Clear, specific job posts attract better proposals.
              </div>
            </div>
          </aside>

          {/* --- Wizard body --------------------------------------------------- */}
          <div className="post-job-form-card">
            <form onSubmit={submit}>
              {step === 1 && (
                <>
                  <div className="form-card-heading">
                    <span>Step 1 of 3</span>
                    <h2>Job details</h2>
                  </div>
                  <label className="form-field">
                    <span>Job title</span>
                    <input
                      required
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g., Shopify Developer for Custom Storefront"
                    />
                  </label>
                  <label className="form-field">
                    <span>Description</span>
                    <textarea
                      required
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={6}
                      placeholder="Describe the project, deliverables, and any specific requirements..."
                    />
                  </label>
                  <label className="form-field">
                    <span>Skills & expertise</span>
                    {/* Static tag list — the tag input needs real add/remove state
                        to be interactive, which is out of scope for now. */}
                    <div className="tag-input">
                      <span>React</span>
                      <span>TypeScript</span>
                      <input placeholder="Add a skill" />
                    </div>
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-card-heading">
                    <span>Step 2 of 3</span>
                    <h2>Budget & timeline</h2>
                  </div>
                  <div className="form-two-col">
                    <label className="form-field">
                      <span>Budget type</span>
                      <select defaultValue="Hourly">
                        <option value="Hourly">Hourly</option>
                        <option value="Fixed-price">Fixed price</option>
                      </select>
                    </label>
                    <label className="form-field">
                      <span>Experience level</span>
                      {/* Mirrors the `experience` union on the `Job` type. */}
                      <select defaultValue="Intermediate">
                        <option value="Entry level">Entry level</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </label>
                  </div>
                  <label className="form-field">
                    <span>Budget range</span>
                    <div className="range-inputs">
                      <input type="number" placeholder="Min" defaultValue="25" />
                      <span>to</span>
                      <input type="number" placeholder="Max" defaultValue="60" />
                      <span>/hr</span>
                    </div>
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
                </>
              )}

              {step === 3 && (
                <>
                  <div className="form-card-heading">
                    <span>Step 3 of 3</span>
                    <h2>Review & publish</h2>
                  </div>
                  <div className="job-review">
                    <span className="review-label">Your job post</span>
                    {/* Placeholder copy keeps the panel from collapsing when a
                        client skipped straight to review. */}
                    <h3>{title || 'Job title'}</h3>
                    <p>{description || 'Job description will appear here...'}</p>
                    <div className="review-info">
                      <ShieldCheck size={14} /> Your job will be visible to thousands of qualified
                      freelancers immediately.
                    </div>
                  </div>
                </>
              )}

              <div className="post-form-actions">
                {/* No "Back" on the first step — it would be a no-op. */}
                {step > 1 ? (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => setStep((current) => current - 1)}
                  >
                    Back
                  </button>
                ) : null}
                {/* One submit button serves all three steps; the label and icon
                    change to reflect what pressing it will do next. */}
                <button className="button button-dark" type="submit">
                  {step < TOTAL_STEPS ? (
                    <>
                      Continue <ArrowRight size={16} />
                    </>
                  ) : (
                    'Publish job'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PostJobPage

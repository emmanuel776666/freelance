import Logo from '../common/Logo'
import { Globe2, ChevronDown, ArrowRight } from 'lucide-react'

/**
 * Site footer: link columns, newsletter capture, and legal row.
 *
 * Rendered by the marketing and detail pages (the dashboard shows its own
 * sidebar navigation instead). The link targets are `#` anchors because the
 * marketing sub-pages are out of scope for this prototype.
 */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <Logo />
          <p>Where work finds the people who make it happen.</p>
          <div className="footer-socials">
            <button aria-label="LinkedIn">in</button>
            <button aria-label="Instagram">ig</button>
            <button aria-label="Twitter">𝕏</button>
          </div>
        </div>

        <div className="footer-column">
          <h4>Find work</h4>
          <a href="#jobs">Browse jobs</a>
          <a href="#talent">Search talent</a>
          <a href="#resources">Career resources</a>
          <a href="#freelancer">Freelancer guide</a>
        </div>

        <div className="footer-column">
          <h4>For clients</h4>
          <a href="#post">Post a job</a>
          <a href="#talent">Hire talent</a>
          <a href="#pricing">Pricing</a>
          <a href="#enterprise">Enterprise</a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <a href="#about">About us</a>
          <a href="#news">Newsroom</a>
          <a href="#trust">Trust & safety</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-column footer-newsletter">
          <h4>Get the latest</h4>
          <p>Fresh opportunities and useful advice, once a week.</p>
          {/* Submission is a no-op in this prototype; no list is actually captured. */}
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button aria-label="Subscribe" type="submit">
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 FreelanceHub demo</span>
        <div>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#accessibility">Accessibility</a>
        </div>
        <button className="language-button">
          <Globe2 size={15} /> English <ChevronDown size={14} />
        </button>
      </div>
    </footer>
  )
}

export default Footer

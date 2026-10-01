import { Link } from 'react-router-dom'

/**
 * Wordmark used in the site header, the site footer, and the auth bar.
 *
 * Renders as a router link back to the home page so there is no full page
 * reload, and carries an explicit `aria-label` because the mark is decorative
 * text ("F" + "FreelanceHub") that would otherwise be read character by character.
 */
function Logo() {
  return (
    <Link className="brand" to="/" aria-label="FreelanceHub home">
      <span className="brand-mark">F</span>
      <span className="brand-name">freelancehub</span>
    </Link>
  )
}

export default Logo

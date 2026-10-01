import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

/**
 * 404 page, mounted as the router's catch-all route.
 *
 * Also rendered directly by `JobDetailsPage` and `TalentProfilePage` when a
 * route param does not match any seed record, so an unknown id gets the same
 * treatment as an unknown URL.
 */
function NotFoundPage() {
  return (
    <div className="public-page">
      <Header />
      <main>
        <div className="not-found-page">
          <h1>404</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link className="button button-dark" to="/">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage

import { Route, Routes } from 'react-router-dom'

// Pages live in a sibling `../pages` directory, not inside `routes/`.
import HomePage from '../pages/HomePage'
import JobsPage from '../pages/JobsPage'
import JobDetailsPage from '../pages/JobDetailsPage'
import TalentPage from '../pages/TalentPage'
import TalentProfilePage from '../pages/TalentProfilePage'
import LoginPage from '../pages/LoginPage'
import PostJobPage from '../pages/PostJobPage'
import DashboardPage from '../pages/DashboardPage'
import NotFoundPage from '../pages/NotFoundPage'

/**
 * Central route table.
 *
 * Kept as a separate module from `App.tsx` so the URL map can be read (and
 * changed) in one place without touching provider wiring. The router itself is
 * mounted in `main.tsx` via `<BrowserRouter>`, so this component only needs to
 * return the matched route element.
 *
 * All routes are lazy in intent but eagerly imported: the bundle is small
 * enough that code splitting here would add loader flashes without a real
 * performance win.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Marketing landing page. */}
      <Route path="/" element={<HomePage />} />

      {/* Job search. Read/write filters and the search box live in the `?q=` and
          sibling query params, which keeps results shareable via URL. */}
      <Route path="/jobs" element={<JobsPage />} />

      {/* Job detail. The page itself resolves `:jobId` against the seed data and
          renders a 404 when the id is unknown. */}
      <Route path="/jobs/:jobId" element={<JobDetailsPage />} />

      {/* Static 3-step job posting wizard. Declared after `/jobs/:jobId` is fine
          because React Router v6 ranks literal segments above params. */}
      <Route path="/jobs/new" element={<PostJobPage />} />

      {/* Talent directory and individual freelancer profiles. */}
      <Route path="/talent" element={<TalentPage />} />
      <Route path="/talent/:talentId" element={<TalentProfilePage />} />

      {/* Combined sign-in / sign-up screen. `?returnTo=` lets protected flows
          (apply, message) bounce the user back where they started. */}
      <Route path="/login" element={<LoginPage />} />

      {/* Signed-in workspace with its own sidebar (not URL-routed yet; the view
          is local state, and `?view=` is reserved for making it deep-linkable). */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Catch-all must stay last so it only matches when nothing else does. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes

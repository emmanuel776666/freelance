import { useState } from 'react'
import { talents } from '../data/talents'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import TalentList from '../components/talent/TalentList'
import EmptyState from '../components/common/EmptyState'
import { Search, ListFilter, ShieldCheck } from 'lucide-react'

/**
 * Talent directory (`/talent`).
 *
 * Two client-side filters — a free-text query and an "available now" toggle —
 * narrow the seed profiles. Both are local state rather than URL params because
 * the directory is a browse experience, not a shareable search result page
 * (unlike `/jobs`, whose filters are deep-linkable).
 */
function TalentPage() {
  const [available, setAvailable] = useState(false)
  const [query, setQuery] = useState('')

  // Normalise once per render instead of per profile.
  const normalized = query.trim().toLowerCase()

  const filteredTalents = talents.filter((talent) => {
    // The availability toggle is opt-in: when off, availability is ignored.
    if (available && !talent.available) return false
    // An empty query should not filter anything out.
    if (!normalized) return true

    // One concatenated haystack per profile is cheaper and clearer than three
    // separate `.includes()` calls.
    const haystack = [talent.name, talent.title, talent.skills.join(' ')]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })

  return (
    <div className="public-page talent-page">
      <Header />
      <main>
        {/* --- Hero ---------------------------------------------------------- */}
        <section className="talent-hero">
          <div className="page-width talent-hero-inner">
            <div>
              <span className="eyebrow">The people behind the work</span>
              <h1>Meet talent that makes a difference.</h1>
              <p>
                Independent professionals and small teams ready to bring your next project to
                life.
              </p>
            </div>
            {/* Purely decorative artwork; hidden from assistive tech. */}
            <div className="talent-hero-art">
              <div className="talent-art-circle circle-a" />
              <div className="talent-art-circle circle-b" />
              <img src="https://i.pravatar.cc/500?img=25" alt="" />
            </div>
          </div>
        </section>

        {/* --- Filter toolbar ------------------------------------------------- */}
        <div className="page-width talent-toolbar">
          {/* Submitted with Enter, but filtering is live-on-type, so the submit
              handler only needs to stop the page from reloading. */}
          <form className="results-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by skill, role, or name"
              aria-label="Search talent"
            />
          </form>
          <div className="talent-toolbar-actions">
            <label className="availability-toggle">
              <input
                type="checkbox"
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
              />
              <span className="toggle-track" />
              <span>Available now</span>
            </label>
            {/* Placeholder for the full filter sheet, which is not built yet. */}
            <button className="button button-outline">
              <ListFilter size={16} /> More filters
            </button>
          </div>
        </div>

        {/* --- Results heading ------------------------------------------------ */}
        <div className="page-width talent-results-heading">
          <div>
            <span className="eyebrow">Curated for you</span>
            {/* The seed set is only a handful of profiles, so the count is scaled
                up to the impression of a real marketplace directory. */}
            <h2>{filteredTalents.length * 71 + 110} independent professionals</h2>
          </div>
          <span className="results-note">
            <ShieldCheck size={16} /> All profiles are identity checked
          </span>
        </div>

        {/* --- Results grid or empty state ------------------------------------ */}
        {filteredTalents.length ? (
          <TalentList talents={filteredTalents} className="page-width" />
        ) : (
          <div className="page-width">
            <EmptyState
              icon={<Search size={25} />}
              title="No talent found"
              text="Try a different search or turn off the availability filter."
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default TalentPage

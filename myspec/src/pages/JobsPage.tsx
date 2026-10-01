import { useSearchParams } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import { useApp, categorySearchTerms } from '../context/AppContext'
import { categories } from '../data/categories'
import { jobs } from '../data/jobs'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import JobCard from '../components/jobs/JobCard'
import CheckFilter from '../components/common/CheckFilter'
import FilterGroup from '../components/common/FilterGroup'
import EmptyState from '../components/common/EmptyState'
import {
  Search,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react'

/** Hourly-rate buckets, as `[paramValue, displayLabel]` pairs. */
const BUDGET_BUCKETS: [string, string][] = [
  ['under25', 'Less than $25/hr'],
  ['25to50', '$25–$50/hr'],
  ['over50', '$50+/hr'],
]

/**
 * Job search and results (`/jobs`).
 *
 * **All filter state lives in the URL**, not in React state. `q`, `category`,
 * `experience`, `budget`, and `sort` are read from `useSearchParams`, which
 * means every result set is shareable and survives a refresh or a back button.
 * The one exception is the search input, which is mirrored into local state so
 * typing feels instant; it is pushed to the URL on submit.
 */
function JobsPage() {
  const [params, setParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // Facet values, read fresh from the URL on every render.
  const queryParam = params.get('q') || ''
  const category = params.get('category') || ''
  const experience = params.get('experience') || ''
  const budget = params.get('budget') || ''
  const sort = params.get('sort') || 'relevance'

  // Re-sync the text input when the URL changes from outside the page — e.g.
  // the header search, or a back navigation.
  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  /**
   * Set or clear one query param while preserving the others.
   *
   * Empty values are deleted rather than set to `""` so the URL stays clean and
   * `params.get()` keeps returning `null` for an unset facet.
   */
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  /** Commit the (possibly debounced-by-the-user) search box to the URL. */
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateParam('q', query.trim())
  }

  /** Reset every facet and the search box in one go. */
  const clearFilters = () => {
    setQuery('')
    setParams({})
  }

  /**
   * Apply every active facet, then sort.
   *
   * Memoised because it walks the full job list and rebuilds the array on each
   * render otherwise. The dependency list is exactly the five facet values,
   * which are all read from `params`.
   */
  const filteredJobs = useMemo(() => {
    const normalized = queryParam.toLowerCase()

    const result = jobs.filter((job) => {
      // Free-text match across title, description, and skills as one haystack.
      const matchesQuery =
        !normalized ||
        [job.title, job.description, job.skills.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(normalized)

      // Category has no field on `Job`, so it maps to keyword synonyms. An
      // unrecognised category falls back to matching its own name.
      const categoryTerms = categorySearchTerms[category] || [category]
      const matchesCategory =
        !category ||
        categoryTerms.some((term: string) =>
          `${job.title} ${job.description} ${job.skills.join(' ')}`
            .toLowerCase()
            .includes(term.toLowerCase())
        )

      const matchesExperience = !experience || job.experience === experience

      // Budget buckets overlap ranges, so both bounds are checked: a job is in
      // the "$25–$50" bucket when its range overlaps that band at all.
      const matchesBudget =
        !budget ||
        (budget === 'under25'
          ? job.budgetMax < 25
          : budget === '25to50'
            ? job.budgetMax >= 25 && job.budgetMin <= 50
            : job.budgetMin > 50)

      return matchesQuery && matchesCategory && matchesExperience && matchesBudget
    })

    // Copy before sorting: `jobs` is a module-level array and must not be
    // mutated in place.
    return [...result].sort((a, b) => {
      // "Most recent" is the seed array's natural order.
      if (sort === 'newest') return jobs.indexOf(a) - jobs.indexOf(b)
      if (sort === 'budget-high') return b.budgetMax - a.budgetMax
      if (sort === 'budget-low') return a.budgetMin - b.budgetMin
      // Relevance: featured jobs first. `Number(Boolean(...))` turns the flag
      // into a 0/1 sort key.
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    })
  }, [budget, category, experience, queryParam, sort])

  // Only the "real" facets count toward the badge; search and sort are not
  // shown as removable chips.
  const activeFilterCount = [category, experience, budget].filter(Boolean).length

  /** Display label for the active budget chip. */
  const budgetLabel = BUDGET_BUCKETS.find(([value]) => value === budget)?.[1] ?? budget

  return (
    <div className="public-page jobs-page">
      <Header />
      <main>
        {/* --- Hero ------------------------------------------------------------ */}
        <section className="jobs-hero">
          <div className="page-width jobs-hero-inner">
            <div>
              <span className="eyebrow">Find your next opportunity</span>
              <h1>Discover work that moves you forward.</h1>
              <div className="jobs-hero-stats">
                <strong>8,200+</strong>
                <span>new jobs this week</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Toolbar --------------------------------------------------------- */}
        <div className="page-width jobs-toolbar">
          <form className="results-search" onSubmit={submitSearch}>
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, skill, or keyword"
              aria-label="Search jobs"
            />
            <button className="button button-dark button-search-small" type="submit">
              Search
            </button>
          </form>
          {/* Toggles the sidebar on small screens; CSS keeps it pinned open on
              desktop regardless of this state. */}
          <button
            className="button button-outline filter-toggle"
            onClick={() => setFilterOpen((open) => !open)}
          >
            <Filter size={16} /> Filters{' '}
            {activeFilterCount ? <span className="filter-count">{activeFilterCount}</span> : null}
          </button>
        </div>

        <div className="page-width jobs-layout">
          {/* --- Filter sidebar ------------------------------------------------- */}
          <aside className={`filters-panel ${filterOpen ? 'is-open' : ''}`}>
            <div className="filters-heading">
              <div>
                <SlidersHorizontal size={18} />
                <strong>Filters</strong>
              </div>
              <button className="text-link" onClick={clearFilters}>
                Clear all
              </button>
            </div>

            <FilterGroup title="Category">
              <select
                value={category}
                onChange={(event) => updateParam('category', event.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup title="Experience level">
              {/* Single-select, implemented as a row of checkboxes: re-checking
                  the active level clears it. */}
              {['Entry level', 'Intermediate', 'Expert'].map((level) => (
                <CheckFilter
                  key={level}
                  label={level}
                  checked={experience === level}
                  onChange={() => updateParam('experience', experience === level ? '' : level)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Hourly rate">
              {BUDGET_BUCKETS.map(([value, label]) => (
                <CheckFilter
                  key={value}
                  label={label}
                  checked={budget === value}
                  onChange={() => updateParam('budget', budget === value ? '' : value)}
                />
              ))}
            </FilterGroup>

            <div className="filter-note">
              <ShieldCheck size={18} />
              <p>
                <strong>Work with confidence</strong>
                <br />
                Every payment is protected by our escrow system.
              </p>
            </div>
          </aside>

          {/* --- Results --------------------------------------------------------- */}
          <section className="results-section">
            <div className="results-header">
              <div>
                {/* Scaled-up count, matching the marketing impression of a real
                    marketplace rather than the size of the seed data. */}
                <strong>{filteredJobs.length * 138 + 314} jobs</strong>
                {queryParam ? (
                  <span> matching &ldquo;{queryParam}&rdquo;</span>
                ) : (
                  <span> ready for you</span>
                )}
              </div>
              <label className="sort-control">
                <span>Sort by</span>
                <select value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="newest">Most recent</option>
                  <option value="budget-high">Highest budget</option>
                  <option value="budget-low">Lowest budget</option>
                </select>
                <ChevronDown size={15} />
              </label>
            </div>

            {/* Removable chips for whatever is currently applied. */}
            {activeFilterCount ? (
              <div className="active-filters">
                {category ? (
                  <button onClick={() => updateParam('category', '')}>
                    {category} <X size={13} />
                  </button>
                ) : null}
                {experience ? (
                  <button onClick={() => updateParam('experience', '')}>
                    {experience} <X size={13} />
                  </button>
                ) : null}
                {budget ? (
                  <button onClick={() => updateParam('budget', '')}>
                    {budgetLabel} <X size={13} />
                  </button>
                ) : null}
              </div>
            ) : null}

            {filteredJobs.length ? (
              <div className="job-results-list">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search size={25} />}
                title="No jobs found"
                text="Try a different keyword or remove some filters to see more opportunities."
                action={
                  <button className="button button-dark" onClick={clearFilters}>
                    Clear filters
                  </button>
                }
              />
            )}

            {/* Pagination placeholder: all seed jobs are already rendered, so
                this is presentational only. */}
            {filteredJobs.length ? (
              <div className="load-more">
                <button className="button button-outline">
                  Load more jobs <ChevronDown size={16} />
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobsPage

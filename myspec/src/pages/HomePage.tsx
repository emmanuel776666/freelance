import { useNavigate, Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { jobs } from '../data/jobs'
import { talents } from '../data/talents'
import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SectionHeading from '../components/common/SectionHeading'
import JobCard from '../components/jobs/JobCard'
import TalentCard from '../components/talent/TalentCard'
import CategoryIcon from '../components/common/CategoryIcon'
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Star,
  UsersRound,
  Zap,
  ChevronRight,
} from 'lucide-react'

/**
 * Marketing landing page (`/`).
 *
 * Composed of static sections that point at the two real destinations of the
 * app: the job search (`/jobs`) and the talent directory (`/talent`). The only
 * interactive state is the hero search box, which forwards the query to
 * `/jobs?q=...` so the landing page holds no search logic of its own.
 */
function HomePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  /** Hand the hero query off to the search page. */
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchTerm.trim()
    // An empty box still navigates, just without a `q` param.
    navigate(query ? `/jobs?q=${encodeURIComponent(query)}` : '/jobs')
  }

  return (
    <div>
      <Header />

      <main>
        {/* --- Hero ------------------------------------------------------------ */}
        <section className="hero-section">
          <div className="hero-inner page-width">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="eyebrow-dot" />
                The world's work marketplace
              </div>
              <h1>
                Find the right <em>talent</em> to get the work done.
              </h1>
              <p className="hero-description">
                Connect with independent professionals and specialized teams who can move your
                business forward.
              </p>

              <form className="hero-search" onSubmit={submitSearch}>
                <div className="hero-search-input">
                  <Search size={21} />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="What are you looking for?"
                    aria-label="What are you looking for?"
                  />
                </div>
                <button className="button button-search" type="submit">
                  Search <ArrowRight size={17} />
                </button>
              </form>

              {/* Pre-filled searches, one link per popular category. */}
              <div className="hero-popular">
                <span>Popular:</span>
                <Link to="/jobs?q=web%20design">Web design</Link>
                <Link to="/jobs?q=AI">AI &amp; data</Link>
                <Link to="/jobs?q=marketing">Marketing</Link>
                <Link to="/jobs?q=writing">Writing</Link>
              </div>
            </div>

            {/* Decorative collage of talent photos and floating stat cards.
                Hidden from assistive tech since none of it is real content. */}
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-glow" />
              <div className="hero-person person-one">
                <img src="https://i.pravatar.cc/420?img=25" alt="" />
                <div className="floating-card floating-card-one">
                  <span className="mini-avatar">
                    <img src="https://i.pravatar.cc/80?img=25" alt="" />
                  </span>
                  <span>
                    <strong>Maya Chen</strong>
                    <small>Product designer</small>
                  </span>
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="hero-person person-two">
                <img src="https://i.pravatar.cc/420?img=68" alt="" />
                <div className="floating-card floating-card-two">
                  <span className="floating-star">
                    <Star size={15} fill="currentColor" />
                  </span>
                  <span>
                    <strong>98% match</strong>
                    <small>for your project</small>
                  </span>
                </div>
              </div>
              <div className="hero-badge badge-top">
                <UsersRound size={15} /> 5M+ pros
              </div>
              <div className="hero-badge badge-bottom">
                <Zap size={15} fill="currentColor" /> 24/7 access
              </div>
            </div>
          </div>
          {/* Gradient that fades the hero into the trust strip below. */}
          <div className="hero-bottom-fade" />
        </section>

        {/* --- Social proof ---------------------------------------------------- */}
        <section className="trust-strip page-width">
          <span className="trust-intro">Trusted by teams at</span>
          <div className="trust-logos">
            <strong>northstar</strong>
            <strong className="logo-serif">lumen</strong>
            <strong>ASTERA</strong>
            <strong className="logo-wide">MOSS &amp; MIND</strong>
            <strong className="logo-serif">relay</strong>
          </div>
          <div className="trust-rating">
            <span className="stars">★★★★★</span>
            <span>4.8/5 from 12,000+ reviews</span>
          </div>
        </section>

        {/* --- Category directory ---------------------------------------------- */}
        <section className="section page-width categories-section">
          <SectionHeading
            eyebrow="Explore the marketplace"
            title="Work that matches your ambition"
            description="From quick tasks to long-term partnerships, discover the right opportunity for every stage of your business."
            action={
              <Link className="text-link arrow-link" to="/jobs">
                Browse all categories <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="category-grid">
            {/* Each card pre-applies itself as a filter on the search page. */}
            {categories.map((category) => (
              <Link
                className="category-card"
                to={`/jobs?category=${encodeURIComponent(category.name)}`}
                key={category.name}
              >
                <span className={`category-icon category-${category.color}`}>
                  <CategoryIcon name={category.icon} />
                </span>
                <span className="category-card-copy">
                  <strong>{category.name}</strong>
                  <small>{category.count} jobs</small>
                </span>
                <ChevronRight size={17} className="category-arrow" />
              </Link>
            ))}
          </div>
        </section>

        {/* --- Featured jobs --------------------------------------------------- */}
        <section className="section page-width featured-section">
          <SectionHeading
            eyebrow="Fresh opportunities"
            title="Jobs worth your attention"
            description="New projects from verified clients looking for the right person to join their team."
            action={
              <Link className="button button-outline" to="/jobs">
                See all jobs <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="job-grid">
            {/* The seed array is already newest-first, so slicing gives the
                freshest posts. */}
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* --- Featured talent ------------------------------------------------- */}
        <section className="section page-width talent-section" id="talent">
          <SectionHeading
            eyebrow="Meet the talent"
            title="People who make great work happen"
            description="Connect with independent professionals and teams with the expertise to make your next idea real."
            action={
              <Link className="text-link arrow-link" to="/talent">
                Explore talent <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="talent-grid">
            {talents.slice(0, 3).map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        {/* --- How it works ---------------------------------------------------- */}
        <section className="section page-width how-section" id="resources">
          <div className="how-copy">
            <span className="eyebrow">A better way to work</span>
            <h2>Good work starts with a good match.</h2>
            <p>
              Whether you're hiring for a project or looking for your next opportunity, we make it
              easier to find the right people and build something lasting.
            </p>
            <Link className="button button-dark" to="/jobs">
              Start exploring <ArrowRight size={16} />
            </Link>
          </div>
          <div className="how-steps">
            <HowStep
              number="01"
              title="Search with intention"
              text="Use skills, experience, and project details to find a better fit."
            />
            <HowStep
              number="02"
              title="Build your shortlist"
              text="Compare profiles, portfolios, and past work before you decide."
            />
            <HowStep
              number="03"
              title="Make something great"
              text="Work together with clear milestones and support at every step."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/**
 * One numbered row in the "how it works" list.
 *
 * Local to this file because it is only used here.
 */
function HowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="how-step">
      <span className="step-number">{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <ChevronRight size={18} />
    </div>
  )
}

export default HomePage

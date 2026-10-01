/**
 * Domain types for the job marketplace.
 *
 * This project runs on in-memory seed data, so a `Job` is a flat, fully
 * denormalised object: everything a card or detail page needs to render is
 * already attached. When a real API is introduced these nested "client" fields
 * should move into a separate `Client` entity and be referenced by id.
 */

/** Pricing model a client chose when posting the job. */
export type BudgetType = 'Fixed-price' | 'Hourly'

/** A single job posting shown across search, detail, and dashboard views. */
export type Job = {
  /** Stable URL-safe identifier, used as the `/jobs/:jobId` route param. */
  id: string
  title: string
  description: string
  budgetType: BudgetType

  /**
   * Pre-formatted budget string for display (e.g. "$1,500–$2,500").
   * `budgetMin`/`budgetMax` are the numeric values used for filtering and sorting,
   * while `budgetLabel` is presentation-only so the UI formatting lives in the data.
   */
  budgetLabel: string
  budgetMin: number
  budgetMax: number

  /** Required experience level, also used as a search facet. */
  experience: 'Entry level' | 'Intermediate' | 'Expert'

  /** Skill tags; the first three are rendered on cards, all of them on the detail page. */
  skills: string[]

  /** Pre-formatted relative timestamp (e.g. "12 min ago"). */
  posted: string
  location: string

  /** Number of proposals received so far; shown as social proof. */
  proposals: number

  // --- Denormalised client fields -------------------------------------------------
  client: string
  clientInitials: string
  clientAvatar: string
  clientRating: number
  clientReviews: number
  clientSpend: string

  /** Whether the client has completed payment verification (escrow eligible). */
  paymentVerified: boolean

  /** Featured jobs are boosted to the top of the default "relevance" sort. */
  featured?: boolean
}

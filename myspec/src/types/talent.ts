/**
 * Domain type for an independent professional (freelancer) profile.
 *
 * Profiles are used by the talent directory (`/talent`), the profile page
 * (`/talent/:talentId`), and the review/portfolio sections on that page.
 */
export type Talent = {
  /** Stable URL-safe identifier, used as the `/talent/:talentId` route param. */
  id: string
  name: string

  /** Short positioning statement shown under the name on cards and profiles. */
  title: string
  avatar: string

  /** Average rating (0–5) and total number of reviews backing it. */
  rating: number
  reviews: number

  /** Pre-formatted hourly rate range, e.g. "$65–$85/hr". */
  rate: string
  location: string
  skills: string[]

  /** Drives the green availability dot and the "Available" filter on `/talent`. */
  available: boolean

  /** Long-form summary shown in the "About" section of the profile page. */
  bio: string
}

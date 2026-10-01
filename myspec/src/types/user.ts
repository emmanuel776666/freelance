/**
 * The currently signed-in user.
 *
 * Authentication is a local demo: any valid email/password combination creates
 * this object and it is persisted to `localStorage`. A real backend would
 * replace the demo `login()` call with a token exchange, but the rest of the UI
 * only depends on this shape, so no consumer would need to change.
 */
export type User = {
  name: string
  email: string

  /**
   * Marketplace role. Freelancers apply to jobs and send proposals; clients post
   * jobs and hire. The dashboard currently renders the same shell for both, but
   * the role is surfaced in the sidebar and drives the register form default.
   */
  role: 'freelancer' | 'client'

  /**
   * Up to two uppercase letters derived from the name, used as the avatar
   * fallback text when the remote avatar image is unavailable.
   */
  initials: string
  avatar: string
}

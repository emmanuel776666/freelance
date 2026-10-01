/**
 * Map of job id -> whether that job is in the user's saved list.
 *
 * A record is used rather than a `Set` because it round-trips through
 * `localStorage` (via `useStoredState`) without any custom serialisation, and
 * it keeps membership checks as simple property lookups: `savedJobs[id]`.
 */
export type SavedState = Record<string, boolean>

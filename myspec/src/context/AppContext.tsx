import { createContext, useContext, useState } from 'react'
import useStoredState from '../hooks/useStoredState'
import type { User } from '../types/user'
import type { SavedState } from '../types/savedState'
import type { ToastState } from '../types/toastState'
import Toast from '../components/common/Toast'

/**
 * Application-wide client state: the demo session, saved jobs, and toasts.
 *
 * These are the three pieces of state that more than one route needs and that
 * must survive navigation (and, thanks to `useStoredState`, a page refresh).
 * Everything else stays local to the component that owns it.
 */
export type AppContextValue = {
  /** Currently signed-in user, or `null` when signed out. */
  user: User | null
  /** Map of job id -> saved flag, persisted to `localStorage`. */
  savedJobs: SavedState
  /** Read-only convenience predicate: is this job saved? */
  isSaved: (id: string) => boolean
  /** Flip the saved flag for a job and notify the user. */
  toggleSave: (id: string) => void
  /** Raise a transient notification banner. */
  showToast: (message: string, kind?: 'success' | 'info') => void
  /** Sign a user in (demo: no credential check beyond the form). */
  login: (user: User) => void
  /** Sign the user out and clear the stored session. */
  logout: () => void
}

// `null` marks "no provider above me", which is what `useApp` detects and turns
// into a helpful error instead of a cryptic `undefined` dereference.
const AppContext = createContext<AppContextValue | null>(null)

/**
 * Access the app state.
 *
 * @throws If called outside `<AppProvider>`, which is always a wiring mistake
 *         rather than a runtime condition to recover from.
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

/**
 * Keyword synonyms for each top-level category, used by the `/jobs` category
 * facet.
 *
 * The seed jobs do not carry a `category` field — they only have free-text
 * titles, descriptions, and skills — so a category filter is approximated by
 * matching these terms against the job's searchable text. This mapping belongs
 * to the UI layer (rather than to `data/categories.ts`) because it is a
 * search-facet concern, not part of the category record itself.
 */
export const categorySearchTerms: Record<string, string[]> = {
  'Web & App Design': ['design', 'ui/ux', 'figma', 'branding'],
  'Web & App Development': ['shopify', 'javascript', 'react', 'typescript', 'python'],
  'Writing & Translation': ['writing', 'copywriting', 'seo', 'content'],
  'AI & Machine Learning': ['ai', 'python', 'openai', 'machine learning'],
  'Digital Marketing': ['marketing', 'email', 'seo', 'crm'],
  'Video & Animation': ['video', 'motion', 'after effects', 'animation'],
  'Music & Audio': ['audio', 'music', 'sound'],
  'Data & Analytics': ['data', 'sql', 'python', 'analytics', 'power bi'],
}

/** How long a toast stays on screen before dismissing itself, in ms. */
const TOAST_DURATION = 3200

/**
 * Provides `AppContext` and renders the single global `<Toast />` outlet.
 *
 * Mounted once at the app root (`App.tsx`), above the router, so toasts and auth
 * state are unaffected by navigation.
 */
function AppProvider({ children }: { children: React.ReactNode }) {
  // Both of these persist to localStorage, so a refresh keeps you signed in and
  // keeps your saved jobs.
  const [user, setUser] = useStoredState<User | null>('freelancehub-demo-user', null)
  const [savedJobs, setSavedJobs] = useStoredState<SavedState>('freelancehub-saved-jobs', {})

  // Toasts are intentionally *not* persisted: they describe a moment, and a
  // banner from a previous session would be noise on the next page load.
  const [toast, setToast] = useState<ToastState>(null)

  /** Show a banner, replacing any toast that is already visible. */
  const showToast = (message: string, kind: 'success' | 'info' = 'success') => {
    setToast({ message, kind })
    // Auto-dismiss. The timer is intentionally not cleaned up on unmount: the
    // provider lives for the app's lifetime, and the worst case is a late
    // `setToast(null)` on an already-null state.
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  /**
   * Add or remove a job from the saved list.
   *
   * The updater receives the current map so the toggle is correct even when
   * several saves are batched into the same render. The toast fires from inside
   * the updater, which is a side effect in what should be a pure function —
   * acceptable here because the state update is synchronous in React 18+, but
   * worth isolating if this ever needs to run in a reducer.
   */
  const toggleSave = (id: string) => {
    setSavedJobs((current) => {
      const nextValue = !current[id]
      showToast(nextValue ? 'Job saved to your saved jobs' : 'Removed from saved jobs', 'info')
      return { ...current, [id]: nextValue }
    })
  }

  /** Sign in and greet the user by first name. */
  const login = (nextUser: User) => {
    setUser(nextUser)
    showToast(`Welcome back, ${nextUser.name.split(' ')[0]}!`, 'success')
  }

  /** Sign out. The stored session is overwritten with `null` by useStoredState. */
  const logout = () => {
    setUser(null)
    showToast('You have been signed out', 'info')
  }

  // Built inline rather than memoised: the value changes on any state update
  // anyway, and every consumer here renders frequently, so `useMemo` would add
  // complexity without avoiding a re-render.
  const contextValue: AppContextValue = {
    user,
    savedJobs,
    isSaved: (id: string) => Boolean(savedJobs[id]),
    toggleSave,
    showToast,
    login,
    logout,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      {/* Single toast outlet for the whole app, rendered outside the routed
          content so it is never unmounted by navigation. */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppContext.Provider>
  )
}

export default AppProvider

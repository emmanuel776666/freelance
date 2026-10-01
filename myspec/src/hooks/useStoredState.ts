import { useState, useEffect } from 'react'

/**
 * `useState` that transparently persists its value to `localStorage`.
 *
 * This is what powers the demo's session and saved-jobs features: state survives
 * a page refresh without needing a backend.
 *
 * Behaviour:
 * - The initial state is a lazy initializer that reads and JSON-parses the stored
 *   value once on mount, falling back to `initialValue` when nothing is stored.
 * - Every subsequent change is written back in an effect.
 * - Both read and write are wrapped in `try/catch`. Browsers can throw here for
 *   real reasons (Safari private mode, disabled cookies, storage quota), and a
 *   persistence failure should never break the app — it degrades to plain
 *   in-memory state instead.
 *
 * @param key Storage key, namespaced by the caller (e.g. `'freelancehub-demo-user'`).
 * @param initialValue Value used when the key is absent or unparseable.
 * @returns A `[value, setValue]` tuple compatible with `useState`.
 */
function useStoredState<T>(key: string, initialValue: T) {
  // Lazy initializer: only runs on the first render, not on every re-render.
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      // `stored` can legitimately be the string "null" for a logged-out user,
      // which JSON.parse turns back into `null` — that is intentional.
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  // Persist on every change. `key` is included so the hook stays correct if a
  // caller ever switches keys on the same state hook.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Local storage is an enhancement; the app remains usable without it.
    }
  }, [key, value])

  // `as const` preserves the tuple type so destructuring is type-safe.
  return [value, setValue] as const
}

export default useStoredState

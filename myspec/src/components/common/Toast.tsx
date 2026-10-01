import { Check, X } from 'lucide-react'

interface ToastProps {
  /** Current toast, or `null` when nothing should be rendered. */
  toast: { message: string; kind?: 'success' | 'info' } | null
  /** Dismisses the toast early; the provider also clears it on a timer. */
  onClose: () => void
}

/**
 * Bottom-right notification banner.
 *
 * Rendered once by `AppProvider` and driven by context state, so any component
 * can raise a toast through `showToast()` without prop drilling. `role="status"`
 * gives it a polite live-region announcement rather than interrupting the user.
 */
function Toast({ toast, onClose }: ToastProps) {
  // Nothing to show: bail out before touching the DOM.
  if (!toast) return null

  return (
    <div className="toast" role="status">
      <span className="toast-icon">
        <Check size={16} />
      </span>
      <span>{toast.message}</span>
      <button onClick={onClose} aria-label="Dismiss notification">
        <X size={15} />
      </button>
    </div>
  )
}

export default Toast

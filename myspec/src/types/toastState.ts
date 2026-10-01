/**
 * Shape of the transient notification banner shown in the bottom-right corner.
 *
 * `kind` is kept for forward compatibility: the UI currently renders the same
 * visual treatment for every toast, but callers can already differentiate
 * "success" (something was completed) from "info" (something changed state).
 *
 * `null` means "no toast is currently visible", which lets the provider render
 * `<Toast />` unconditionally and have the component return `null` internally.
 */
export type ToastState = {
  /** Human readable message displayed to the user. */
  message: string
  /** Visual/semantic intent of the notification. Defaults to a success style. */
  kind?: 'success' | 'info'
} | null

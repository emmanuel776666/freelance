import { ShieldCheck } from 'lucide-react'

/**
 * Trust badge for a verified client or payment method.
 *
 * Shared between `JobCard` and `JobDetailsPage`, which previously each carried
 * their own copy of this markup.
 */
function VerifiedBadge({ label = 'Payment verified' }: { label?: string }) {
  return (
    <span className="verified-badge">
      {/* Slightly heavier stroke keeps the shield legible at small sizes. */}
      <ShieldCheck size={13} strokeWidth={2.5} />
      {label}
    </span>
  )
}

export default VerifiedBadge

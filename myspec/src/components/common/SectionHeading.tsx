/**
 * Shared heading block for marketing/section layouts.
 *
 * All optional parts render conditionally, so a caller can use it for a bare
 * `<h2>` or for a full eyebrow + title + description + trailing action row.
 */
interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string
  title: string
  description?: string
  /** Trailing element, usually a "See all" link or button. */
  action?: React.ReactNode
}

function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export default SectionHeading

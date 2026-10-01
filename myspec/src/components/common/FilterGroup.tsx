import type { ReactNode } from 'react'

interface FilterGroupProps {
  /** Section heading, e.g. "Experience level". */
  title: string
  children: ReactNode
}

/**
 * Titled wrapper for a group of related filter controls in the `/jobs` sidebar.
 * Purely presentational — it owns the heading and the divider spacing.
 */
function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default FilterGroup

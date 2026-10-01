import type { Talent } from '../../types/talent'
import TalentCard from './TalentCard'

interface TalentListProps {
  /** Already-filtered profiles to render. The caller owns the filtering rules. */
  talents: Talent[]
  /**
   * Extra classes merged onto the grid container, so the page can supply its
   * own width/padding utilities (e.g. `page-width`).
   */
  className?: string
}

/**
 * Responsive grid of freelancer cards.
 *
 * Purely presentational: it takes an already-filtered list so the directory
 * page keeps ownership of search/availability state and of the matching
 * empty-state and result-count messaging. Keeping it separate from that logic
 * also means a future "invite talent" surface can reuse the grid unchanged.
 */
function TalentList({ talents, className = '' }: TalentListProps) {
  return (
    <div className={`talent-grid talent-results-grid ${className}`.trim()}>
      {talents.map((talent) => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </div>
  )
}

export default TalentList

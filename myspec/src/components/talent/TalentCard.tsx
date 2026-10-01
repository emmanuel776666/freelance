import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Avatar from '../common/Avatar'
import type { Talent } from '../../types/talent'

interface TalentCardProps {
  talent: Talent
}

/**
 * Freelancer summary card linking to `/talent/:talentId`.
 *
 * The whole card is one link because there are no secondary interactive
 * controls to preserve (unlike `JobCard`, which hosts a save button).
 */
function TalentCard({ talent }: TalentCardProps) {
  return (
    <Link className="talent-card" to={`/talent/${talent.id}`}>
      <div className="talent-card-top">
        <Avatar src={talent.avatar} alt={talent.name} size="large" />
        {/* Purely decorative status dot; the text state is on the profile page. */}
        <span className={`availability-dot ${talent.available ? 'available' : ''}`} />
      </div>

      <div className="talent-card-name-row">
        <div>
          <h3>{talent.name}</h3>
          <span className="talent-title">{talent.title}</span>
        </div>
        <ArrowRight size={18} />
      </div>

      <div className="talent-rating-row">
        <span className="stars small-stars">★★★★★</span>
        <strong>{talent.rating}</strong>
        <span>({talent.reviews})</span>
      </div>

      <div className="talent-card-footer">
        <span>{talent.rate}</span>
        <span className="footer-location">
          <MapPin size={13} /> {talent.location}
        </span>
      </div>
    </Link>
  )
}

export default TalentCard

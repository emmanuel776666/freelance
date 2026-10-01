import {
  LayoutTemplate,
  Code2,
  PenLine,
  Sparkles,
  Megaphone,
  Video,
  Music2,
  BarChart3,
  BriefcaseBusiness,
} from 'lucide-react'

interface CategoryIconProps {
  /**
   * Icon key from `data/categories.ts`. Kept as a string (rather than storing
   * components) so the category data can be served from an API as plain JSON.
   */
  name: string
}

/**
 * Maps a category icon key to its Lucide component.
 *
 * Unknown keys fall back to a generic briefcase so a new category added to the
 * data file renders something sensible before an icon is chosen for it.
 */
function CategoryIcon({ name }: CategoryIconProps) {
  // Shared icon sizing/weight keeps the category grid visually consistent.
  const props = { size: 22, strokeWidth: 1.8 }

  switch (name) {
    case 'layout':
      return <LayoutTemplate {...props} />
    case 'code':
      return <Code2 {...props} />
    case 'pen':
      return <PenLine {...props} />
    case 'sparkles':
      return <Sparkles {...props} />
    case 'megaphone':
      return <Megaphone {...props} />
    case 'video':
      return <Video {...props} />
    case 'music':
      return <Music2 {...props} />
    case 'chart':
      return <BarChart3 {...props} />
    default:
      return <BriefcaseBusiness {...props} />
  }
}

export default CategoryIcon

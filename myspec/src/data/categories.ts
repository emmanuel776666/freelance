/**
 * Top-level marketplace categories rendered on the home page and as the
 * "Category" facet on `/jobs`.
 *
 * - `icon` is a string key resolved to a Lucide icon by
 *   `components/common/CategoryIcon.tsx` (kept as a string so this file stays
 *   free of JSX and can be moved to an API response unchanged).
 * - `color` maps to a `category-*` CSS class that supplies the icon tint.
 * - `count` is a display string for the marketing layout.
 */
export const categories = [
  { name: 'Web & App Design', count: '12,483', icon: 'layout', color: 'purple' },
  { name: 'Web & App Development', count: '18,992', icon: 'code', color: 'blue' },
  { name: 'Writing & Translation', count: '8,240', icon: 'pen', color: 'orange' },
  { name: 'AI & Machine Learning', count: '4,106', icon: 'sparkles', color: 'pink' },
  { name: 'Digital Marketing', count: '9,731', icon: 'megaphone', color: 'green' },
  { name: 'Video & Animation', count: '5,488', icon: 'video', color: 'red' },
  { name: 'Music & Audio', count: '2,173', icon: 'music', color: 'yellow' },
  { name: 'Data & Analytics', count: '6,904', icon: 'chart', color: 'teal' },
]

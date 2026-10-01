import { Check } from 'lucide-react'

interface CheckFilterProps {
  label: string
  checked: boolean
  onChange: () => void
}

/**
 * Single checkbox row used inside the `/jobs` filter sidebar.
 *
 * The real `<input type="checkbox">` stays in the DOM for keyboard and screen
 * reader support, but is visually replaced by `.fake-checkbox` so the control
 * can match the rest of the custom-styled filter panel.
 */
function CheckFilter({ label, checked, onChange }: CheckFilterProps) {
  return (
    <label className="check-filter">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="fake-checkbox">{checked && <Check size={12} />}</span>
      <span>{label}</span>
    </label>
  )
}

export default CheckFilter

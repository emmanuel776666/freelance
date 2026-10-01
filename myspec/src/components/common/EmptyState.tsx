/**
 * Zero-results placeholder used by search and list views.
 *
 * Always renders an icon, a heading, supporting copy, and optionally a single
 * call-to-action so a filtered-to-nothing state still tells the user what to do
 * next. `role="status"` announces the change to assistive tech when the list
 * it replaces is emptied by a filter interaction.
 */
function EmptyState({ icon, title, text, action }: {
  icon: React.ReactNode
  title: string
  text: string
  action?: React.ReactNode
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action ? <div className="action">{action}</div> : null}
    </div>
  )
}

export default EmptyState

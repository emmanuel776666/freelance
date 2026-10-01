/**
 * KPI tiles rendered at the top of the dashboard overview.
 *
 * `direction` drives the trend styling on each tile: `up` renders a green
 * TrendingUp icon, `neutral` renders muted helper text with no icon.
 */
export const dashboardStats = [
  { label: 'Earnings this month', value: '$4,280', change: '+18.4%', direction: 'up' },
  { label: 'Active contracts', value: '3', change: '1 ending soon', direction: 'neutral' },
  { label: 'New proposals', value: '8', change: '+3 this week', direction: 'up' },
  { label: 'Profile views', value: '1,204', change: '+24.7%', direction: 'up' },
]

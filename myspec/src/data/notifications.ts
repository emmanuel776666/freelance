/**
 * Notification feed data.
 *
 * Ready to back the dashboard notification bell and a notifications view.
 * `unread` drives the emphasis dot and `type` selects the row icon.
 */
export const notifications = [
  { id: 1, title: 'Your proposal was viewed', text: 'Northstar Goods viewed your proposal.', time: '2h ago', unread: true, type: 'proposal' },
  { id: 2, title: 'New message from James', text: '“I’ve attached the latest project brief.”', time: '5h ago', unread: true, type: 'message' },
  { id: 3, title: 'Payment released', text: 'Your payment of $1,250 was released.', time: 'Yesterday', unread: false, type: 'payment' },
  { id: 4, title: 'Recommended for you', text: '12 new jobs match your profile.', time: 'Yesterday', unread: false, type: 'job' },
]

import type { Talent } from '../types/talent'

/**
 * Seed freelancer profiles for the talent directory (`/talent`) and the
 * individual profile pages (`/talent/:talentId`).
 *
 * `available` is deliberately mixed so the "Available now" filter on the
 * directory page has something to actually exclude.
 */
export const talents: Talent[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    title: 'Product designer for thoughtful digital experiences',
    avatar: 'https://i.pravatar.cc/160?img=25',
    rating: 5,
    reviews: 86,
    rate: '$65–$85/hr',
    location: 'Vancouver, Canada',
    skills: ['Product Design', 'Figma', 'UX Research', 'Webflow'],
    available: true,
    bio: 'I help early-stage teams turn complex products into clear, confident experiences. I have partnered with startups and mission-driven companies across fintech, health, and climate.',
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    title: 'Full-stack engineer specializing in React and Node',
    avatar: 'https://i.pravatar.cc/160?img=68',
    rating: 4.9,
    reviews: 54,
    rate: '$75–$100/hr',
    location: 'London, United Kingdom',
    skills: ['React', 'TypeScript', 'Node.js', 'Postgres'],
    available: true,
    bio: 'I build reliable web products and the systems behind them. I care about clean architecture, fast delivery, and making complex features feel simple.',
  },
  {
    id: 'sofia-martinez',
    name: 'Sofia Martinez',
    title: 'Brand and content strategist for growing businesses',
    avatar: 'https://i.pravatar.cc/160?img=36',
    rating: 4.8,
    reviews: 39,
    rate: '$50–$75/hr',
    location: 'Austin, United States',
    skills: ['Brand Strategy', 'Copywriting', 'Content Strategy', 'Webflow'],
    available: false,
    bio: 'I help founders find the clearest version of their story and turn it into a brand people remember.',
  },
  {
    id: 'noah-williams',
    name: 'Noah Williams',
    title: 'Data scientist turning messy data into decisions',
    avatar: 'https://i.pravatar.cc/160?img=13',
    rating: 5,
    reviews: 28,
    rate: '$90–$120/hr',
    location: 'New York, United States',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Strategy'],
    available: true,
    bio: 'I partner with product and operations teams to make data useful, explainable, and actionable.',
  },
  {
    id: 'aisha-patel',
    name: 'Aisha Patel',
    title: 'Lifecycle marketer who builds lasting customer relationships',
    avatar: 'https://i.pravatar.cc/160?img=49',
    rating: 4.9,
    reviews: 61,
    rate: '$45–$70/hr',
    location: 'Toronto, Canada',
    skills: ['Email Marketing', 'CRM', 'Klaviyo', 'Analytics'],
    available: true,
    bio: 'I design lifecycle programs that feel personal, perform consistently, and keep customers coming back.',
  },
  {
    id: 'lucas-oliveira',
    name: 'Lucas Oliveira',
    title: 'Motion designer creating stories people remember',
    avatar: 'https://i.pravatar.cc/160?img=60',
    rating: 4.7,
    reviews: 22,
    rate: '$55–$85/hr',
    location: 'Lisbon, Portugal',
    skills: ['After Effects', 'Cinema 4D', 'Video Editing', 'Storyboarding'],
    available: true,
    bio: 'I bring ideas to life through motion, rhythm, and a healthy obsession with the final frame.',
  },
]

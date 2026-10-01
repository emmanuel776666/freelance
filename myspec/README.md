# FreelanceHub

A responsive React + Vite freelance marketplace experience branded as FreelanceHub. The project is a frontend prototype with realistic local data and interactive demo workflows.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` runs `tsc -b` (type-check) before `vite build`, so a type error fails the build rather than shipping.

## Included flows

- Landing page with marketplace search
- Job search with URL-backed search, filters, sorting, and empty states
- Job detail pages with save/apply interactions
- Proposal modal with validation and confirmation state
- Freelancer talent directory and talent profiles
- Local authentication demo with persisted sessions
- Job posting wizard
- Dashboard overview, saved jobs, proposals, contracts, messages, earnings, and settings
- Notification dropdown on the dashboard
- Responsive layouts for desktop, tablet, and mobile
- Local persistence for saved jobs and login state

## Demo authentication

The login page accepts any valid email and a non-empty password. For example:

```text
freelancer@example.com / password123
client@example.com / password123
```

The account type is selected in the create-account form. The prototype stores the session in `localStorage` so the dashboard remains available after refresh.

**Note:** authentication is simulated. No credentials are verified and nothing leaves the browser.

## Routes

| Path                 | Page                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `/`                  | Landing page                                                      |
| `/jobs`              | Job search — `?q=`, `?category=`, `?experience=`, `?budget=`, `?sort=` |
| `/jobs/:jobId`       | Job detail — renders the 404 page for an unknown id               |
| `/jobs/new`          | Post-a-job wizard (sign-in required)                              |
| `/talent`            | Talent directory                                                  |
| `/talent/:talentId`  | Talent profile — renders the 404 page for an unknown id           |
| `/login`             | Sign in / register — honours `?returnTo=`                         |
| `/dashboard`         | Signed-in workspace — `?view=` selects the panel                  |
| `*`                  | 404                                                               |

## Project structure

```
src/
  main.tsx                  Entry point: mounts <BrowserRouter> and imports styles.css
  App.tsx                   Thin shell composing the provider and the route table
  routes/
    AppRoutes.tsx           The URL map, in one readable table
  context/
    AppContext.tsx          Session, saved jobs, and toasts + <Toast /> outlet
  hooks/
    useStoredState.ts       useState that persists to localStorage (try/catch safe)
  types/
    job.ts  talent.ts  user.ts  savedState.ts  toastState.ts
  data/
    jobs.ts  talents.ts  categories.ts  dashboard.ts  notifications.ts  activity.ts
  pages/                    One file per route
  components/
    layout/                 Header, Footer
    common/                 Avatar, Logo, Toast, VerifiedBadge, EmptyState, filters, ...
    jobs/                   JobCard, ApplyModal
    talent/                 TalentCard, TalentList
  styles.css                The whole design system, in one file
```

### Architecture notes

- **Types and data are separated.** `src/types/` holds one domain type per file; `src/data/` holds the seed records. Neither imports the other except for `import type`, so the data can be replaced with API calls without touching components.
- **Filter state lives in the URL.** `/jobs` and `/dashboard` read their state from query params, making result sets shareable and back-button friendly.
- **`AppContext` is the only global state.** Everything else is local to the component that owns it. Saved jobs and the session survive a refresh via `useStoredState`.
- **No CSS-in-JS and no per-component stylesheets.** All styling is in `src/styles.css`, sectioned and indexed in the file header.

## Known gaps

These are deliberate placeholders, not bugs:

- The dashboard panels for proposals, contracts, messages, earnings, and settings render a heading only.
- The tag input on post-job step 1, the portfolio file browse button, and the social/OAuth sign-in buttons are visual only.
- Job and talent counts on the home and search pages are scaled up from the seed set to match a real marketplace's impression.
- No backend: the proposal, message, and newsletter forms do not send anything.

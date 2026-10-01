import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

/**
 * Browser entry point.
 *
 * The router is mounted here rather than inside `App` so that `App` stays free
 * of router concerns and the URL scheme (`BrowserRouter` vs `HashRouter`) is a
 * single decision made in one place.
 *
 * The global stylesheet is imported for its side effect: it defines the design
 * tokens and layout primitives that every component relies on.
 */
createRoot(document.getElementById('root')!).render(
  // `StrictMode` double-invokes effects in development to surface unsafe
  // side effects and missing cleanup. It has no effect on the production build.
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

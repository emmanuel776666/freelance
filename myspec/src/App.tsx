import AppProvider from './context/AppContext'
import AppRoutes from './routes/AppRoutes'

/**
 * Application shell.
 *
 * Deliberately thin: it exists only to compose the two pieces of global wiring
 * — the state provider and the route table. The router itself is mounted one
 * level up in `main.tsx`, so `App` needs no router hooks and can be rendered in
 * tests without a router wrapper.
 *
 * `AppProvider` sits *above* `AppRoutes` so session state and saved jobs survive
 * navigation between pages.
 */
function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App

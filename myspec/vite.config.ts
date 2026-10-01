import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration.
 *
 * Kept to the React plugin only: the app needs no path aliases, no proxy, and
 * no environment variables yet, so every option here is a Vite default that has
 * not been overridden. This file exists as the place to add them when a real
 * backend is wired up (a `/api` proxy in dev, for example).
 *
 * @see https://vite.dev/config/
 */
export default defineConfig({
  // Enables Fast Refresh and the automatic JSX runtime, so components do not
  // need to import React explicitly.
  plugins: [react()],
})

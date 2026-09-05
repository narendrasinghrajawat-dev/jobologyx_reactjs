import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Env files live under env/ (env/.env.test, env/.env.production) instead
  // of the project root, mirroring the jobologyx_nodejs backend layout.
  envDir: "env",
})

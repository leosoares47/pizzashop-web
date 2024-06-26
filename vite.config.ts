import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { UserConfig } from "vite"
import type { InlineConfig } from 'vitest'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test:{
    globals: true

  }
} as UserConfig & {
  test: InlineConfig
})

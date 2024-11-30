import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import Checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(), 
    Checker({
      typescript: true, // Disable TypeScript checking in the plugin
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

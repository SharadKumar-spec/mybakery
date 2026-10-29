import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    // Vite's dev server listens ONLY on port 5173.
    // Spring Boot owns port 8080 and proxies all requests here.
    host: '0.0.0.0',   // bind on all interfaces (IPv4 + IPv6)
    port: 5173,
    strictPort: true,  // crash immediately if 5173 is already taken
  },
})


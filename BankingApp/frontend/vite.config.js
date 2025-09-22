import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../mkcert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../mkcert/localhost.pem')),
    },
    port: 5173
  }
});
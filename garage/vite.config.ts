import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ root: process.cwd(), server: { fs: { allow: [path.resolve(process.cwd(), '..')] } }, optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'lucide-react'] }, plugins: [react()], build: { outDir: 'dist', emptyOutDir: true } })

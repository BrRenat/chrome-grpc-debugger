import { defineConfig } from 'vite'
import pluginLinaria from '@linaria/rollup'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginLinaria()],
})

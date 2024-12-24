import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'components', replacement: '/src/components' },
      { find: 'store', replacement: '/src/store' },
      { find: 'globalConstants', replacement: '/src/globalConstants' },
      { find: 'modules', replacement: '/src/modules' },
      { find: 'features', replacement: '/src/features' },
      { find: 'types', replacement: '/src/types' },
      { find: 'helpers', replacement: '/src/helpers' },
      { find: 'hooks', replacement: '/src/hooks' },
    ],
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
  },
})

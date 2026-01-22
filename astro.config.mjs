import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://pearlbeachcottages.com',
  integrations: [
    tailwind(),
    sitemap(),
    icon()
  ],
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    build: {
      // Disable source maps in production for security
      sourcemap: false,
      // Minify output for performance
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true
        }
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// base './' để có thể mở trực tiếp dist/index.html hoặc đặt ở thư mục con
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
});

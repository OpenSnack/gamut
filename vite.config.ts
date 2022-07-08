import { fileURLToPath, URL } from 'url';
import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@tailwindConfig': resolve(__dirname, 'tailwind.config.js')
        }
    },
    optimizeDeps: {
        include: [
            '@tailwindConfig'
        ],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
            include: [/node_modules/, 'tailwind.config.js']
        }
    },
    server: {
        port: 8080
    }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


const path = require('path')


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias:{
            '@' : path.resolve(__dirname, './src')
        },
    },
    server: {
        // https://dev.to/web2033/vite-dev-server-with-netlify-dev-support-1inh
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8888/.netlify/functions',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            }
        }
    }
})

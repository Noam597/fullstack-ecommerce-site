import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'


// const API_TARGET =
//   process.env.VITE_DOCKER === 'true'
//     ? 'http://server:3010'
//     : 'http://localhost:3010'
// // https://vite.dev/config/
// export default defineConfig({
  
//   plugins: [react()],
//   server: {
//     host:true,
//     fs:{
//       strict:false
//     },
//     proxy: {
//       '/users': {
//         target: API_TARGET,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/store': {
//         target: API_TARGET,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/payment': {
//         target: API_TARGET,
//         changeOrigin: true,
//         secure: false,
//       },
//       '/admin': {
//         target: API_TARGET,
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   },
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: './src/vitest.setup.ts', 
//   },
// })
// export default defineConfig(({ mode }) => {
//   // 🔑 Load env variables the Vite way
//   const env = loadEnv(mode, process.cwd(), '')

//   const API_TARGET =
//     env.VITE_DOCKER === 'true'
//       ? 'http://server:3010'
//       : 'http://localhost:3010'

//   return {
//     plugins: [react()],
//     server: {
//       host: true,
//       fs: {
//         strict: false,
//       },
//       proxy: {
//         '/users': {
//           target: API_TARGET,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/store': {
//           target: API_TARGET,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/payment': {
//           target: API_TARGET,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/admin': {
//           target: API_TARGET,
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//     test: {
//       globals: true,
//       environment: 'jsdom',
//       setupFiles: './src/vitest.setup.ts',
//     },
//   }
// })

export default defineConfig(({ mode }) => {
  // Load env vars (Vite handles .env.production / .env.development)
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],

    // 🔥 DEV SERVER ONLY (npm run dev)
    server: {
      host: true,
      fs: {
        strict: false,
      },
      proxy: {
        '/users': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/store': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/payment': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/admin': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/vitest.setup.ts',
    },
  }
})
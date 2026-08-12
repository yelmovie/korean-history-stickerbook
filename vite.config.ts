import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const NAVY = '#10233f'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // dev 서버에서도 서비스워커를 등록해 오프라인 동작을 확인할 수 있게 한다
      devOptions: { enabled: true, type: 'module' },
      manifest: {
        name: '한국사 스티커북',
        short_name: '스티커북',
        description: '유물을 관찰하고 근거를 골라 스티커를 모으는 초등 한국사 탐구 웹앱',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'landscape',
        background_color: NAVY,
        theme_color: NAVY,
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // 앱 셸 + 그림/폰트/효과음까지 전부 precache (합계 약 13MB).
        // 수업 중 와이파이가 끊겨도 아직 안 들어간 스테이지까지 그대로 진행된다.
        globPatterns: ['**/*.{js,css,html,webp,woff2,json,png,ico,mp3}'],
        // BGM 6.5MB 는 설치를 느리게 만들어 제외 → 아래 runtimeCaching 으로 처음 들을 때 캐시.
        // sfx/*.mp3(134KB)는 매 문항 쓰이므로 precache 대상에 남긴다.
        globIgnores: ['**/node_modules/**', 'assets/sound/*.mp3'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/sound/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'bgm',
              // 스테이지 5개 + 메인 테마 = 6개. 넉넉히 8.
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
})

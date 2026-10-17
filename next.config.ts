import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// 语言路由（`/` = 中文、`/en/` = 英文）在 i18n/routing.ts 声明、proxy.ts 执行，
// 这里不再需要手写 rewrites / redirects。
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // 图已经是手工 LANCZOS + cwebp -q 90 的成品，不必再过一遍优化服务。
  // 自动宽高、懒加载、blur 占位、内容哈希与 immutable 缓存都来自静态导入本身，
  // 和这个开关无关；放弃的只是按分辨率自动生成 srcset。
  images: { unoptimized: true },
  // 国内镜像（cn.nippon-expedition.com，GitHub Pages）用同一份源码导出纯静态，
  // 只在 .github/workflows/cn-mirror.yml 里打开。Vercel 那份不受影响。
  // trailingSlash：导出成 codex/index.html，GitHub Pages 对 /codex 和 /codex/ 都能响应。
  ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' as const, trailingSlash: true } : {}),
}

export default withNextIntl(nextConfig)

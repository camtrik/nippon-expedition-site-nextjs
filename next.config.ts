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
}

export default withNextIntl(nextConfig)

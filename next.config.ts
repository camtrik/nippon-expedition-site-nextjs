import type { NextConfig } from 'next'

// 决定 5：`/` = 中文、`/en/` = 英文。实现上所有页面都住在 `app/[lang]/` 里，
// 中文那一份靠 rewrite 把前缀藏掉——URL 的形状和实现解耦。
const nextConfig: NextConfig = {
  // 路由检查顺序是 redirects(2) → rewrites(4)，所以这两组不会互相咬：
  // 外面进来的 `/zh/faq/` 先被收敛到 `/faq/`，rewrite 是内部的、不重走 redirect。
  async redirects() {
    return [
      // `/zh/*` 不是正规地址，收敛到不带前缀的那份，免得同一份内容两个 URL。
      { source: '/zh', destination: '/', permanent: true },
      { source: '/zh/:path+', destination: '/:path+', permanent: true },
    ]
  },

  async rewrites() {
    return {
      // ⚠️ beforeFiles 的规则是**逐条链式套用**的——不是「命中一条就停」
      // （那是 afterFiles 的语义）。所以第二条必须把 `zh` 也排除掉，否则
      // 第一条刚把 `/` 变成 `/zh/`，第二条又会把它变成 `/zh/zh/` 然后 404。
      beforeFiles: [
        { source: '/', destination: '/zh' },
        { source: '/:path((?!en$|en/|zh$|zh/|_next/|api/).*)', destination: '/zh/:path' },
      ],
    }
  },
}

export default nextConfig

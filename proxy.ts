import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'

/**
 * next-intl 的路由中间件，负责三件事：
 * ① `/faq` 内部改写到 `/zh/faq`（中文不带前缀）；`/zh/faq` 重定向回 `/faq`。
 * ② 首访语言判断：没有 NEXT_LOCALE cookie 时按 Accept-Language 决定，英文读者访问 `/` 会被送到 `/en`。
 * ③ 记住选择：用过语言开关后写 NEXT_LOCALE cookie，之后以它为准。
 */
const intl = createMiddleware(routing)

/**
 * 国内镜像：Vercel 在大陆跨境慢，大陆访客整站跳到 GitHub Pages 上的静态版
 * （.github/workflows/cn-mirror.yml 每次推送 main 自动发布）。地区取 Vercel 的
 * x-vercel-ip-country 头；预览部署的域名不在 MAIN_HOSTS 里，不跳。
 * ⚠️ 以后加了不能静态导出的页面（要服务端的那种），在这里按路径放行，别让大陆访客跳到镜像上的 404。
 */
// 2026-10-17 实测（Globalping 国内 30 节点，同一批节点对比同一个静态文件）：Vercel 中位 ~300ms，
// 镜像中位 ~775ms、建连慢近 3 倍，镜像反而更慢，所以先关掉跳转。镜像照常自动发布，
// 直接访问 cn. 可以对比；确认对某类线路更快再打开。
const REDIRECT_CN = false
const CN_MIRROR = 'https://cn.nippon-expedition.com'
const MAIN_HOSTS = new Set(['nippon-expedition.com', 'www.nippon-expedition.com'])

export default function proxy(req: NextRequest) {
  if (REDIRECT_CN && req.headers.get('x-vercel-ip-country') === 'CN' && MAIN_HOSTS.has(req.nextUrl.hostname)) {
    // 镜像上中文页在根目录、没有 /zh 前缀
    const path = req.nextUrl.pathname.replace(/^\/zh(?=\/|$)/, '') || '/'
    return NextResponse.redirect(CN_MIRROR + path + req.nextUrl.search, 307)
  }
  return intl(req)
}

export const config = {
  // 只拦页面请求；带扩展名的静态文件、_next/、_vercel/ 一律放行
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}

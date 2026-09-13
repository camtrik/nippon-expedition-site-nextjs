import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

/**
 * next-intl 的路由中间件，负责三件事：
 * ① `/faq` 内部改写到 `/zh/faq`（中文不带前缀）；`/zh/faq` 重定向回 `/faq`。
 * ② 首访语言判断：没有 NEXT_LOCALE cookie 时按 Accept-Language 决定，英文读者访问 `/` 会被送到 `/en`。
 * ③ 记住选择：用过语言开关后写 NEXT_LOCALE cookie，之后以它为准。
 */
export default createMiddleware(routing)

export const config = {
  // 只拦页面请求；带扩展名的静态文件、_next/、_vercel/ 一律放行
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}

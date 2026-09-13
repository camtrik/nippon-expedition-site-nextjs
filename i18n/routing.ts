import { defineRouting } from 'next-intl/routing'

/**
 * 记住语言选择的 cookie。proxy 里的中间件和 components/LangSwitch.tsx 都按这份配置写，
 * 名字和有效期只在这里定一次。放一年：以前的 localStorage 方案是永久的，别退化成会话级。
 */
export const localeCookie = { name: 'NEXT_LOCALE', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 365 }

/**
 * `/` = 中文、`/en/…` = 英文。中文是默认语言，所以不带前缀（as-needed）；
 * `/zh/…` 会被 proxy 收敛到不带前缀的那份，同一份内容只有一个 URL。
 *
 * 语言判断（Accept-Language → NEXT_LOCALE cookie）和这套前缀规则都由 proxy.ts 里的
 * next-intl 中间件执行，这里只是声明。
 */
export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
  // hreflang 已经由 generateMetadata 写进 <head>（zh-Hans / en / x-default，照旧站的契约），
  // 不再让中间件往响应头里加一份 Link: 头——两处值不一致（它会写 zh）。
  alternateLinks: false,
  localeCookie,
})

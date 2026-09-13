// 站点级常量。

import { DEFAULT_LANG, hrefFor, type Lang } from './i18n'

/**
 * 绝对地址的基准，metadata 的 canonical / hreflang / og:image 都从它拼。
 * 部署到 Vercel 之后设 NEXT_PUBLIC_SITE_ORIGIN；本地没设就用占位域名，
 * 反正相对路径在页面里照样能点，只有 <head> 里那几个绝对地址会不对。
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://nippon-expedition.vercel.app'
).replace(/\/+$/, '')

/** 页面清单。加一页就在这里加一条，导航、hreflang、metadata 全跟着走。 */
export const PAGES = [
  { id: 'overview', path: '', nav: 'overview', desc: 'home' },
  { id: 'changelog', path: 'changelog', nav: 'log', desc: 'changelog' },
  { id: 'faq', path: 'faq', nav: 'faq', desc: 'faq' },
] as const

export type PageId = (typeof PAGES)[number]['id']

export function pageById(id: PageId) {
  const p = PAGES.find((p) => p.id === id)
  if (!p) throw new Error(`没有这个页面：${id}`)
  return p
}

/** 一页在某语言下的绝对地址——canonical 和 hreflang 用。 */
export function absHref(lang: Lang, path: string): string {
  return SITE_ORIGIN + hrefFor(lang, path)
}

/** 构建时间。页面是全静态的，所以这就是「最后部署」的时刻。 */
export const BUILD_TIME = new Date()
  .toISOString()
  .replace('T', ' ')
  .replace(/:\d\d\.\d+Z$/, ' UTC')

export { DEFAULT_LANG }

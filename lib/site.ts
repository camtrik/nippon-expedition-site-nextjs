// 站点级常量。

/**
 * 绝对地址的基准，metadata 的 canonical / hreflang / og:image 都从它拼。
 * 默认就是正式域名；要临时换（比如测别的域名）设 NEXT_PUBLIC_SITE_ORIGIN。
 * 别写回 *.vercel.app：那个域名在大陆被 DNS 污染，项目里已设成 308 跳到正式域名。
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://nippon-expedition.com'
).replace(/\/+$/, '')

/**
 * 页面清单。加一页就在这里加一条，导航、hreflang、metadata 全跟着走。顺序就是导航的顺序。
 * href 是不带语言前缀的站内路径，交给 i18n/navigation 的 Link / getPathname 加前缀。
 * also：这些路径开头的页面也算在这一项下面（导航高亮用）——兵种页、人物页都归「图鉴」。
 */
export const PAGES = [
  { id: 'overview', href: '/', nav: 'overview', desc: 'home', also: [] },
  { id: 'lore', href: '/lore', nav: 'lore', desc: 'lore', also: [] },
  { id: 'codex', href: '/codex', nav: 'codex', desc: 'codex', also: ['/units/', '/chars/'] },
  { id: 'changelog', href: '/changelog', nav: 'log', desc: 'changelog', also: [] },
  { id: 'faq', href: '/faq', nav: 'faq', desc: 'faq', also: [] },
  { id: 'compat', href: '/compat', nav: 'stats', desc: 'compat', also: [] },
] as const

export type PageId = (typeof PAGES)[number]['id']

export function pageById(id: PageId) {
  const p = PAGES.find((p) => p.id === id)
  if (!p) throw new Error(`没有这个页面：${id}`)
  return p
}

/** 构建时间。页面是全静态的，所以这就是「最后部署」的时刻。 */
export const BUILD_TIME = new Date()
  .toISOString()
  .replace('T', ' ')
  .replace(/:\d\d\.\d+Z$/, ' UTC')

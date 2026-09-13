// 语言清单。顺序也决定 hreflang 的排列，和旧站 sitegen/config.py 的 LANGS 一致。
export const LANGS = ['zh', 'en'] as const
export type Lang = (typeof LANGS)[number]

/** 在根布局服务的语言——它的页面挂在站点根目录，不带前缀。 */
export const DEFAULT_LANG: Lang = 'zh'

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v)
}

/** content/ 里到处都是的「中英同字段」形状（ROADMAP 决定 3，178 处）。 */
export type Bilingual = { zh: string; en: string }

/**
 * 读一个双语字段。空串按「没有」处理，回落到 DEFAULT_LANG——
 * 照旧站 sitegen/text.py 的 pick()。hero.note.zh 就是个空串，靠这条不渲染空标签。
 */
export function pick(field: Bilingual | string, lang: Lang): string {
  if (typeof field === 'string') return field
  return field[lang] || field[DEFAULT_LANG] || ''
}

/** `{version}` / `{n}` 这种占位符。词表里只有这两种，不值得引模板库。 */
export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
}

/** 一条路径在另一种语言下的地址。中文不带前缀（决定 5）。 */
export function hrefFor(lang: Lang, path: string): string {
  const p = path.replace(/^\/+/, '')
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
  return p ? `${prefix}/${p}` : prefix || '/'
}

/**
 * 把路由参数收窄成 Lang。
 * ⚠️ 这里不做 404：那是路由层的事，`export const dynamicParams = false` 已经让
 * LANGS 之外的段直接 404 了。抛错只是给 TS 一个收窄，同时把「走到这儿就是路由配错了」写明。
 */
export function asLang(v: string): Lang {
  if (!isLang(v)) throw new Error(`路由参数 lang=${v} 不在 LANGS 里——检查 dynamicParams 配置`)
  return v
}

// 语言清单。顺序也决定 hreflang 的排列，和旧站 sitegen/config.py 的 LANGS 一致。
export const LANGS = ['zh', 'en'] as const
export type Lang = (typeof LANGS)[number]

/** 在根布局服务的语言——它的页面挂在站点根目录，不带前缀。 */
export const DEFAULT_LANG: Lang = 'zh'

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v)
}

// 语言相关的小工具。路由、词表、切换都交给 next-intl（i18n/ 目录）；
// 这里只剩内容层的东西：content/ 里 {zh, en} 同字段的读法，以及每种语言的固定元数据。
import type { Locale } from 'next-intl'

import { routing } from '@/i18n/routing'

export type { Locale }

/** content/ 里到处都是的「中英同字段」形状（178 处）。 */
export type Bilingual = Record<Locale, string>

/**
 * 读一个双语内容字段。空串按「没有」处理，回落到默认语言。
 * hero.note.zh 就是个空串，靠这条不渲染空标签。
 * ⚠️ 只用于 content/ 的正文；站点词表走 useTranslations() / getTranslations()。
 */
export function pick(field: Bilingual | string, locale: Locale): string {
  if (typeof field === 'string') return field
  return field[locale] || field[routing.defaultLocale] || ''
}

/**
 * 每种语言的固定元数据。这些不是译文——语言开关上永远显示目标语言自己的名字，
 * <html lang> 和 hreflang 也不随当前语言变——所以不放 messages/ 里。
 */
export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; hreflang: string; ogLocale: string; label: string }
> = {
  zh: { htmlLang: 'zh-CN', hreflang: 'zh-Hans', ogLocale: 'zh_CN', label: '中文' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', label: 'EN' },
}

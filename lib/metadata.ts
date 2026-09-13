// generateMetadata 的共用部分。契约照旧站 site/partials/head.html：
// canonical + 三条 hreflang（zh-Hans / en / x-default 指中文）+ og + twitter。
import type { Metadata } from 'next'

import harbour from '@/assets/site/harbour-1800.webp'
import { pageDesc, ui } from '@/lib/content/ui'
import { DEFAULT_LANG, LANGS, hrefFor, pick, type Lang } from '@/lib/i18n'
import { SITE_ORIGIN, pageById, type PageId } from '@/lib/site'

export function buildMetadata(lang: Lang, id: PageId): Metadata {
  const page = pageById(id)
  const site = pick(ui.site, lang)
  const title =
    id === 'overview' ? pick(ui.siteFull, lang) : `${pick(ui.nav[page.nav], lang)} · ${site}`
  const description = pick(pageDesc[page.desc], lang)

  const languages = Object.fromEntries([
    ...LANGS.map((l) => [l === 'zh' ? 'zh-Hans' : 'en', hrefFor(l, page.path)]),
    // x-default 指中文：这是作者自己的语言，也是工坊主条目的语言
    ['x-default', hrefFor(DEFAULT_LANG, page.path)],
  ])

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: { canonical: hrefFor(lang, page.path), languages },
    openGraph: {
      type: 'website',
      siteName: pick(ui.siteFull, lang),
      title,
      description,
      locale: pick(ui.ogLocale, lang),
      url: hrefFor(lang, page.path),
      images: [{ url: harbour.src, width: harbour.width, height: harbour.height }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// generateMetadata 的共用部分。契约照旧站 site/partials/head.html：
// canonical + 三条 hreflang（zh-Hans / en / x-default 指中文）+ og + twitter。
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

import harbour from '@/assets/site/harbour-1800.webp'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { LOCALE_META, type Locale } from '@/lib/i18n'
import { SITE_ORIGIN, pageById, type PageId } from '@/lib/site'

export async function buildMetadata(id: PageId): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations()
  const page = pageById(id)
  const hrefIn = (l: Locale) => getPathname({ locale: l, href: page.href })

  const title = id === 'overview' ? t('siteFull') : `${t(`nav.${page.nav}`)} · ${t('site')}`
  const description = t(`pageDesc.${page.desc}`)

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [LOCALE_META[l].hreflang, hrefIn(l)]),
    // x-default 指中文：这是作者自己的语言，也是工坊主条目的语言
    ['x-default', hrefIn(routing.defaultLocale)],
  ])

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: { canonical: hrefIn(locale), languages },
    openGraph: {
      type: 'website',
      siteName: t('siteFull'),
      title,
      description,
      locale: LOCALE_META[locale].ogLocale,
      url: hrefIn(locale),
      images: [{ url: harbour.src, width: harbour.width, height: harbour.height }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

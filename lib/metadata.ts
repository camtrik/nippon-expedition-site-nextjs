// generateMetadata 的共用部分。契约照旧站 site/partials/head.html：
// canonical + 三条 hreflang（zh-Hans / en / x-default 指中文）+ og + twitter。
import type { Metadata } from 'next'
import type { StaticImageData } from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'

import harbour from '@/assets/site/harbour-1800.webp'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { LOCALE_META, type Locale } from '@/lib/i18n'
import { SITE_ORIGIN, pageById, type PageId } from '@/lib/site'

/**
 * 详情页（兵种 / 人物）不在 PAGES 里，自己给路径、标题、描述和分享图；
 * id 仍然是它归属的那一项（'codex'），只用来兜底。
 */
type Detail = { href: string; title: string; description: string; image?: StaticImageData }

export async function buildMetadata(id: PageId, detail?: Detail): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations()
  const page = pageById(id)
  const hrefIn = (l: Locale) => getPathname({ locale: l, href: detail?.href ?? page.href })

  const title = detail
    ? `${detail.title} · ${t('site')}`
    : id === 'overview'
      ? t('siteFull')
      : `${t(`nav.${page.nav}`)} · ${t('site')}`
  const description = detail?.description ?? t(`pageDesc.${page.desc}`)
  const image = detail?.image ?? harbour

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
      images: [{ url: image.src, width: image.width, height: image.height }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

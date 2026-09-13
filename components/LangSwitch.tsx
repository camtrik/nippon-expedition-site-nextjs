'use client'

/**
 * 语言开关。切语言 = 换 URL（`/faq` ⇄ `/en/faq`），不是换客户端 state：
 * 工坊上中英是两个独立条目，各自要有能分享、能被单独索引的地址。
 * 但换 URL 不等于整页刷新：走客户端软导航，只把页面内容换掉，文档不卸载；
 * scroll={false} 让滚动位置留在原处（Next 默认会滚回顶部）。
 *
 * ⚠️ 这里故意不用 i18n/navigation 的 <Link locale=…>。那个组件切回默认语言时会链到
 * 带前缀的 `/zh/faq`，指望 proxy 用 307 收敛成 `/faq`；但 Next 16 的客户端路由会按已知的
 * 路由模式直接软导航，只有数据请求走到那个重定向，地址栏就停在 `/zh/faq`（实测稳定复现，
 * prefetch={false} 也救不了）。所以这里直接链到规范地址（getPathname 算出来的），
 * 并在点击时自己写 NEXT_LOCALE cookie——不写的话 proxy 会按旧 cookie 把 `/faq` 再送回 `/en/faq`。
 * prefetch={false} 同理：预取发生在 cookie 更新之前，取回来的会是另一种语言。
 *
 * #hash 要跟着带过去：HashSync 滚动时只改地址栏，usePathname 里没有它，href 里也就没有。
 * 所以点击时现读 location.hash 拼上再导航。带修饰键的点击（新标签页打开）照常走默认行为。
 */
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { MouseEvent } from 'react'

import { getPathname, usePathname } from '@/i18n/navigation'
import { localeCookie, routing } from '@/i18n/routing'
import { LOCALE_META, type Locale } from '@/lib/i18n'

/** 和 proxy 里 next-intl 写的是同一个 cookie；名字和有效期都从 routing 读，不会各写各的。 */
function rememberLocale(locale: Locale) {
  const { name, maxAge, sameSite } = localeCookie
  document.cookie = `${name}=${locale}; path=/; max-age=${maxAge}; SameSite=${sameSite}`
}

export function LangSwitch() {
  const pathname = usePathname()
  const locale = useLocale()
  const router = useRouter()

  function onSwitch(e: MouseEvent<HTMLAnchorElement>, l: Locale, href: string) {
    rememberLocale(l)
    if (!location.hash || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    router.push(href + location.hash, { scroll: false })
  }

  return (
    <div className="lang-switch">
      {routing.locales.map((l) => {
        if (l === locale) {
          return (
            <span key={l} className="lang-switch__item lang-switch__item--current">
              {LOCALE_META[l].label}
            </span>
          )
        }
        const href = getPathname({ href: pathname, locale: l })
        return (
          <NextLink
            key={l}
            className="lang-switch__item"
            href={href}
            hrefLang={LOCALE_META[l].hreflang}
            onClick={(e) => onSwitch(e, l, href)}
            prefetch={false}
            scroll={false}
          >
            {LOCALE_META[l].label}
          </NextLink>
        )
      })}
    </div>
  )
}

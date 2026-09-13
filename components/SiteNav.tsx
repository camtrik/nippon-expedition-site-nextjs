// 顶部药丸导航。设计稿有 6 项（简介 / 背景故事 / 图鉴 / 更新记录 / 常见问题 / 兼容性），
// 阶段 1 只建了 3 页，所以先渲染这 3 项，其余等对应阶段再加回来。
//
// ⚠️ current 由页面传进来，不是在这里算的：Server Component 拿不到当前路径
// （useSelectedLayoutSegment 只在客户端有）。为了不为一个高亮引入客户端 JS，
// 导航由 components/PageShell.tsx 在每页渲染一次，页面把自己的 id 传下来。
import Image from 'next/image'

import mon from '@/assets/site/mon.webp'
import { ui } from '@/lib/content/ui'
import { hrefFor, pick, type Lang } from '@/lib/i18n'
import { LANGS } from '@/lib/i18n'
import { PAGES, type PageId } from '@/lib/site'

export function SiteNav({ lang, current }: { lang: Lang; current: PageId }) {
  return (
    <nav className="site-nav" aria-label={pick(ui.navAria, lang)}>
      <div className="site-nav__pill">
        <a className="site-nav__logo" href={hrefFor(lang, '')}>
          <Image className="site-nav__mark" src={mon} alt="" width={24} height={24} priority />
          <span>{pick(ui.site, lang)}</span>
        </a>

        <div className="site-nav__links">
          {PAGES.map((p) => (
            <a
              key={p.id}
              className="site-nav__link"
              href={hrefFor(lang, p.path)}
              aria-current={p.id === current ? 'page' : undefined}
            >
              {pick(ui.nav[p.nav], lang)}
            </a>
          ))}
        </div>

        <LangSwitch lang={lang} current={current} />
      </div>
    </nav>
  )
}

/**
 * 切语言 = 换 URL，不是换客户端 state（ROADMAP 决定 5）。设计稿那份是 setState +
 * localStorage 的单 URL 切换，会把英文工坊条目的读者留在中文页上。
 *
 * data-lang 不是装饰：layout 里那段内联脚本靠它把选择写进 localStorage['npex-lang']，
 * 首访自动跳转判断读的就是这个键。不写，跳转会每次都触发，把别人分享的链接顶掉。
 */
function LangSwitch({ lang, current }: { lang: Lang; current: PageId }) {
  const path = PAGES.find((p) => p.id === current)!.path
  const label: Record<Lang, string> = { zh: '中文', en: 'EN' }
  return (
    <div className="lang-switch">
      {LANGS.map((l) =>
        l === lang ? (
          <span key={l} className="lang-switch__item lang-switch__item--current">
            {label[l]}
          </span>
        ) : (
          <a
            key={l}
            className="lang-switch__item"
            href={hrefFor(l, path)}
            hrefLang={l === 'zh' ? 'zh-Hans' : 'en'}
            data-lang={l}
          >
            {label[l]}
          </a>
        ),
      )}
    </div>
  )
}

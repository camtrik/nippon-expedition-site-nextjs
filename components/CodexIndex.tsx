// 图鉴索引：兵种 / 人物两个页签。页签是两条真地址（/codex 与 /codex/chars），
// 不是客户端切换——各自能分享、能被索引，和语言开关是同一个道理。
import { useLocale, useTranslations } from 'next-intl'

import { ArtCard } from '@/components/art'
import { Link } from '@/i18n/navigation'
import { allChars, allUnits, charGroups, unitKindGroups } from '@/lib/content/codex'
import type { Bi } from '@/lib/content/schema'
import { pick, type Locale } from '@/lib/i18n'

/** 另一种语言的名字。设计稿在每张卡下面都给一行（showAltName）。 */
export const altName = (name: Bi, locale: Locale) => name[locale === 'zh' ? 'en' : 'zh']

/** 称号：中文套『』，英文原样（"The Onmyo Miko"） */
export const epithetText = (epithet: Bi, locale: Locale) =>
  locale === 'zh' ? `『${epithet.zh}』` : epithet.en

export function CodexIndex({ tab }: { tab: 'units' | 'chars' }) {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="page">
      <div className="measure">
        <h1 className="page__title">{t('nav.codex')}</h1>
        <p className="page__lede">{t('codexLede')}</p>

        <nav className="codex-tabs" aria-label={t('nav.codex')}>
          <Link className="codex-tabs__tab" href="/codex" aria-current={tab === 'units' ? 'page' : undefined}>
            {t('tabUnits')}
            <span className="codex-tabs__count">{allUnits.length}</span>
          </Link>
          <Link className="codex-tabs__tab" href="/codex/chars" aria-current={tab === 'chars' ? 'page' : undefined}>
            {t('tabChars')}
            <span className="codex-tabs__count">{allChars.length}</span>
          </Link>
        </nav>

        {tab === 'units'
          ? unitKindGroups.map((g) => (
              <section className="codex-group" key={g.kind}>
                <h2 className="eyebrow">{t(`unitKinds.${g.kind}`)}</h2>
                <ul className="codex-grid">
                  {g.items.map((u) => (
                    <li key={u.slug}>
                      <ArtCard
                        kind="units"
                        slug={u.slug}
                        name={pick(u.name, locale)}
                        sub={[altName(u.name, locale)]}
                        href={`/units/${u.slug}`}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          : charGroups.map((g) => (
              <section className="codex-group" key={g.id}>
                <h2 className={`eyebrow${g.id === 'generic' ? '' : ' codex-group__legend'}`}>{t(`charGroups.${g.id}`)}</h2>
                <ul className="codex-grid">
                  {/* 一人一张卡，用默认外观（武士大将朱甲、伊吹人形）；其余外观在人物页里切换 */}
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <ArtCard
                        kind="chars"
                        slug={c.looks[0].key}
                        name={pick(c.name, locale)}
                        sub={[c.epithet ? epithetText(c.epithet, locale) : '', altName(c.name, locale)].filter(Boolean)}
                        accent={Boolean(c.epithet)}
                        href={`/chars/${c.slug}`}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
      </div>
    </div>
  )
}

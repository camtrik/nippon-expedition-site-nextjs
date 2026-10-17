import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'

import { Segs } from '@/components/Seg'
import { routing } from '@/i18n/routing'
import type { Change, MainEntry, SubmodEntry } from '@/lib/content/releases'
import { bodyFor, latestReleased, mainReleases, submodReleases } from '@/lib/content/releases'
import type { Tag } from '@/lib/content/schema'
import { LOCALE_META } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('changelog')
}

// 版式照旧站 site/_templates/log.html 与 site/styles/log/*：居中单栏、
// 版本号与日期徽章同一行、正文是普通的 h3 + 原生圆点列表。
export default function ChangelogPage() {
  const t = useTranslations()

  return (
    <div className="page log-page">
      <div className="measure">
        <div className="log-column">
          {/*
            页签是纯 CSS：两个隐藏的 radio 排在最前面，后面的 .log-hero 与 .log-timeline
            都是它们的兄弟，才能用 :checked ~ 同时选到页签和面板。零 JS。
          */}
          <input className="log-views__radio" type="radio" name="logview" id="logview-main" defaultChecked />
          <input className="log-views__radio" type="radio" name="logview" id="logview-submod" />

          <header className="log-hero">
            <p className="log-hero__eyebrow">CHANGELOG</p>
            <h1 className="log-hero__title">{t('nav.log')}</h1>
            <div className="log-hero__meta">
              <div className="log-views" role="group" aria-label={t('logViewsLabel')}>
                <label className="log-views__tab" htmlFor="logview-main">
                  {t('logMain')}
                  <span className="log-views__count">{mainReleases.length}</span>
                </label>
                <label className="log-views__tab" htmlFor="logview-submod">
                  {t('logSubmod')}
                  <span className="log-views__count">{submodReleases.length}</span>
                </label>
                <span className="log-views__ink" aria-hidden="true" />
              </div>

              {latestReleased && (
                <p className="stamp log-stamp">
                  {t('latest')} <strong>v{latestReleased.version}</strong> · <strong>{latestReleased.date}</strong>
                </p>
              )}
            </div>
          </header>

          <div className="log-timeline">
            <div className="log-panel log-panel--main">
              {mainReleases.length === 0 && <p className="log-empty">{t('empty')}</p>}
              {mainReleases.map((r) => (
                <MainRelease key={r.source} entry={r} latest={r === latestReleased} />
              ))}
            </div>

            <div className="log-panel log-panel--submod">
              {submodReleases.length === 0 && <p className="log-empty">{t('empty')}</p>}
              {submodReleases.map((r) => (
                <SubmodRelease key={r.source} entry={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 回落到中文正文时，正文块要标上中文的 lang，让屏幕阅读器换对发音。 */
const FALLBACK_LANG = LOCALE_META[routing.defaultLocale].htmlLang

function MainRelease({ entry, latest }: { entry: MainEntry; latest: boolean }) {
  const locale = useLocale()
  const t = useTranslations()
  const { body, fallback } = bodyFor(entry, locale)
  return (
    <article className={latest ? 'release release--latest' : 'release'}>
      <div className="release__head">
        <span className="release__version">v{entry.version}</span>
        {entry.date && <span className="release__date">{entry.date}</span>}
        <span className="release__badges">
          <span className={`type-badge type-badge--${entry.type}`}>{t(`types.${entry.type}`)}</span>
          <TagPills tags={entry.tags} />
        </span>
      </div>

      <div className="release-body" lang={fallback ? FALLBACK_LANG : undefined}>
        {fallback && <p className="release__untranslated">{t('untranslated')}</p>}
        {body.lede && (
          <p>
            <Segs segs={body.lede.segs} />
          </p>
        )}
        {body.groups.map((g, i) => (
          <section key={i}>
            <h3>{g.head}</h3>
            {g.note && (
              <p>
                <Segs segs={g.note.segs} />
              </p>
            )}
            {g.items.length > 0 && (
              <ul>
                {g.items.map((item, j) => (
                  <li key={j}>
                    <ChangeBody change={item} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}

function SubmodRelease({ entry }: { entry: SubmodEntry }) {
  const locale = useLocale()
  const t = useTranslations()
  const { body, fallback } = bodyFor(entry, locale)
  const title = entry.title[locale] ?? entry.title[routing.defaultLocale] ?? entry.source
  return (
    <article className="release">
      <div className="release__head">
        {/* url 是这个包自己的工坊页，标题本身就是链接。⚠️ 正文里不要再自链一次（隔壁 AGENTS.md）。 */}
        {entry.url ? (
          <a className="release__version release__version--named" href={entry.url} target="_blank" rel="noopener">
            {title}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="release__version release__version--named">{title}</span>
        )}
        <span className="release__badges">
          <TagPills tags={entry.tags} />
        </span>
      </div>

      <div className="release-body" lang={fallback ? FALLBACK_LANG : undefined}>
        {fallback && <p className="release__untranslated">{t('untranslated')}</p>}
        {body.lede && (
          <p>
            <Segs segs={body.lede.segs} />
          </p>
        )}
        <ul>
          {body.changes.map((c, i) => (
            <li key={i}>
              {/* 顶层条目开头的日期是标签，不是正文；缩进的子条目不带 */}
              {c.date && <span className="entry-date">{c.date}</span>}
              <ChangeBody change={c} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** 一条改动的正文加它的子条目。⚠️ 标志位来自源串里的 ⚠️，字形已经在 loader 里摘掉了。 */
function ChangeBody({ change }: { change: Change }) {
  const t = useTranslations()
  return (
    <>
      {change.body.warn && <span className="warn-label">{t('warnLabel')}</span>}
      <Segs segs={change.body.segs} />
      {change.sub.length > 0 && (
        <ul>
          {change.sub.map((s, j) => (
            <li key={j}>
              {s.warn && <span className="warn-label">{t('warnLabel')}</span>}
              <Segs segs={s.segs} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function TagPills({ tags }: { tags: readonly Tag[] }) {
  const t = useTranslations('tagLabels')
  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className={`tag-pill tag-pill--${tag}`}>
          {t(tag)}
        </span>
      ))}
    </>
  )
}

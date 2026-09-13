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

export default function ChangelogPage() {
  const t = useTranslations()

  return (
    <div className="page">
      <div className="measure">
        <h1 className="page__title">{t('nav.log')}</h1>

        {latestReleased && (
          <p className="stamp log-stamp">
            <span>{t('latest')}</span>
            <strong>
              v{latestReleased.version} · {latestReleased.date}
            </strong>
          </p>
        )}

        {/*
          页签是纯 CSS：两个隐藏的 radio 排在最前面，后面的兄弟用 :checked ~ 选。
          零 JS，视觉和设计稿一致。radio + label 本身就是可访问的一组选择。
        */}
        <div className="log-tabs">
          <h2 className="sr-only">{t('logViewsLabel')}</h2>
          <input className="log-tabs__radio" type="radio" name="logview" id="logview-main" defaultChecked />
          <input className="log-tabs__radio" type="radio" name="logview" id="logview-submod" />

          <div className="log-tabs__bar">
            <label className="log-tabs__tab" htmlFor="logview-main">
              <span>{t('logMain')}</span>
              <span className="log-tabs__count">{mainReleases.length}</span>
            </label>
            <label className="log-tabs__tab" htmlFor="logview-submod">
              <span>{t('logSubmod')}</span>
              <span className="log-tabs__count">{submodReleases.length}</span>
            </label>
          </div>

          <div className="log-view log-view--main">
            {mainReleases.length === 0 && <p>{t('empty')}</p>}
            {mainReleases.map((r) => (
              <MainRelease key={r.source} entry={r} />
            ))}
          </div>

          <div className="log-view log-view--submod">
            {submodReleases.length === 0 && <p>{t('empty')}</p>}
            {submodReleases.map((r) => (
              <SubmodRelease key={r.source} entry={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 回落到中文正文时，正文块要标上中文的 lang，让屏幕阅读器换对发音。 */
const FALLBACK_LANG = LOCALE_META[routing.defaultLocale].htmlLang

function MainRelease({ entry }: { entry: MainEntry }) {
  const locale = useLocale()
  const t = useTranslations()
  const { body, fallback } = bodyFor(entry, locale)
  return (
    <article className="release">
      <div className="release__head">
        <p className="release__version">v{entry.version}</p>
        {entry.date && <p className="release__date">{entry.date}</p>}
        <p className="release__type">
          <span className={`pill type--${entry.type}`}>{t(`types.${entry.type}`)}</span>
        </p>
        <Tags tags={entry.tags} />
      </div>

      <div className="release__body" lang={fallback ? FALLBACK_LANG : undefined}>
        {fallback && <p className="release__untranslated">{t('untranslated')}</p>}
        {body.lede && (
          <p className="release__lede">
            <Segs segs={body.lede.segs} />
          </p>
        )}
        {body.groups.map((g, i) => (
          <div className="release__group" key={i}>
            <p className="eyebrow release__group-head">{g.head}</p>
            {g.note && (
              <p className="release__group-note">
                <Segs segs={g.note.segs} />
              </p>
            )}
            {g.items.length > 0 && (
              <ul className="dots">
                {g.items.map((item, j) => (
                  <li key={j}>
                    <ChangeBody change={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        <h2 className="release__title">{title}</h2>
        {/* url 是这个包自己的工坊页。⚠️ 正文里不要再自链一次（隔壁 AGENTS.md）。 */}
        {entry.url && (
          <a className="release__ws" href={entry.url} target="_blank" rel="noopener">
            {t('wsOpen')} →
          </a>
        )}
        <Tags tags={entry.tags} className="release__chips" />
      </div>

      <div className="release__body" lang={fallback ? FALLBACK_LANG : undefined}>
        {fallback && <p className="release__untranslated">{t('untranslated')}</p>}
        {body.lede && (
          <p className="release__lede">
            <Segs segs={body.lede.segs} />
          </p>
        )}
        <ul className="changes">
          {body.changes.map((c, i) => (
            <li key={i}>
              {/* 顶层条目开头的日期是标签，不是正文；缩进的子条目不带（旧站的 .entry-date 规则） */}
              {c.date && <p className="entry-date">{c.date}</p>}
              <p className="changes__body">
                <ChangeBody change={c} inline />
              </p>
              {c.sub.length > 0 && (
                <ul className="dots changes__sub">
                  {c.sub.map((s, j) => (
                    <li key={j}>
                      {s.warn && <span className="warn-label">{t('warnLabel')}</span>}
                      <Segs segs={s.segs} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** 一条改动的正文。⚠️ 标志位来自源串里的 ⚠️，字形已经在 loader 里摘掉了。 */
function ChangeBody({ change, inline = false }: { change: Change; inline?: boolean }) {
  const t = useTranslations()
  return (
    <>
      {change.body.warn && <span className="warn-label">{t('warnLabel')}</span>}
      <Segs segs={change.body.segs} />
      {!inline && change.sub.length > 0 && (
        <ul className="dots changes__sub">
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

function Tags({ tags, className = '' }: { tags: readonly Tag[]; className?: string }) {
  const t = useTranslations('tagLabels')
  if (tags.length === 0) return null
  return (
    <ul className={`chips ${className}`.trim()}>
      {tags.map((tag) => (
        <li key={tag}>{t(tag)}</li>
      ))}
    </ul>
  )
}

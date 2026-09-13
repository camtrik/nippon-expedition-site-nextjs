import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { Segs } from '@/components/Seg'
import type { Change, MainEntry, SubmodEntry } from '@/lib/content/releases'
import { bodyFor, latestReleased, mainReleases, submodReleases } from '@/lib/content/releases'
import { tagLabels, ui } from '@/lib/content/ui'
import { DEFAULT_LANG, asLang, pick, type Lang } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/changelog'>): Promise<Metadata> {
  return buildMetadata(asLang((await params).lang), 'changelog')
}

export default async function ChangelogPage({ params }: PageProps<'/[lang]/changelog'>) {
  const lang = asLang((await params).lang)

  return (
    <PageShell lang={lang} current="changelog">
      <div className="page">
        <div className="measure">
          <h1 className="page__title">{pick(ui.nav.log, lang)}</h1>

          {latestReleased && (
            <p className="stamp log-stamp">
              <span>{pick(ui.latest, lang)}</span>
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
            <h2 className="sr-only">{pick(ui.logViewsLabel, lang)}</h2>
            <input
              className="log-tabs__radio"
              type="radio"
              name="logview"
              id="logview-main"
              defaultChecked
            />
            <input className="log-tabs__radio" type="radio" name="logview" id="logview-submod" />

            <div className="log-tabs__bar">
              <label className="log-tabs__tab" htmlFor="logview-main">
                <span>{pick(ui.logMain, lang)}</span>
                <span className="log-tabs__count">{mainReleases.length}</span>
              </label>
              <label className="log-tabs__tab" htmlFor="logview-submod">
                <span>{pick(ui.logSubmod, lang)}</span>
                <span className="log-tabs__count">{submodReleases.length}</span>
              </label>
            </div>

            <div className="log-view log-view--main">
              {mainReleases.length === 0 && <p>{pick(ui.empty, lang)}</p>}
              {mainReleases.map((r) => (
                <MainRelease key={r.source} entry={r} lang={lang} />
              ))}
            </div>

            <div className="log-view log-view--submod">
              {submodReleases.length === 0 && <p>{pick(ui.empty, lang)}</p>}
              {submodReleases.map((r) => (
                <SubmodRelease key={r.source} entry={r} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function MainRelease({ entry, lang }: { entry: MainEntry; lang: Lang }) {
  const { body, fallback } = bodyFor(entry, lang)
  return (
    <article className="release">
      <div className="release__head">
        <p className="release__version">v{entry.version}</p>
        {entry.date && <p className="release__date">{entry.date}</p>}
        <p className="release__type">
          <span className={`pill type--${entry.type}`}>{pick(ui.types[entry.type], lang)}</span>
        </p>
        <Tags tags={entry.tags} lang={lang} />
      </div>

      <div className="release__body" lang={fallback ? DEFAULT_LANG : undefined}>
        {fallback && <p className="release__untranslated">{pick(ui.untranslated, lang)}</p>}
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
                    <ChangeBody change={item} lang={lang} />
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

function SubmodRelease({ entry, lang }: { entry: SubmodEntry; lang: Lang }) {
  const { body, fallback } = bodyFor(entry, lang)
  const title = entry.title[lang] ?? entry.title[DEFAULT_LANG] ?? entry.source
  return (
    <article className="release">
      <div className="release__head">
        <h2 className="release__title">{title}</h2>
        {/* url 是这个包自己的工坊页。⚠️ 正文里不要再自链一次（隔壁 AGENTS.md）。 */}
        {entry.url && (
          <a className="release__ws" href={entry.url} target="_blank" rel="noopener">
            {pick(ui.wsOpen, lang)} →
          </a>
        )}
        <Tags tags={entry.tags} lang={lang} className="release__chips" />
      </div>

      <div className="release__body" lang={fallback ? DEFAULT_LANG : undefined}>
        {fallback && <p className="release__untranslated">{pick(ui.untranslated, lang)}</p>}
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
                <ChangeBody change={c} lang={lang} inline />
              </p>
              {c.sub.length > 0 && (
                <ul className="dots changes__sub">
                  {c.sub.map((s, j) => (
                    <li key={j}>
                      {s.warn && <span className="warn-label">{pick(ui.warnLabel, lang)}</span>}
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
function ChangeBody({
  change,
  lang,
  inline = false,
}: {
  change: Change
  lang: Lang
  inline?: boolean
}) {
  return (
    <>
      {change.body.warn && <span className="warn-label">{pick(ui.warnLabel, lang)}</span>}
      <Segs segs={change.body.segs} />
      {!inline && change.sub.length > 0 && (
        <ul className="dots changes__sub">
          {change.sub.map((s, j) => (
            <li key={j}>
              {s.warn && <span className="warn-label">{pick(ui.warnLabel, lang)}</span>}
              <Segs segs={s.segs} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function Tags({
  tags,
  lang,
  className = '',
}: {
  tags: readonly string[]
  lang: Lang
  className?: string
}) {
  if (tags.length === 0) return null
  return (
    <ul className={`chips ${className}`.trim()}>
      {tags.map((t) => (
        <li key={t}>{pick(tagLabels[t], lang)}</li>
      ))}
    </ul>
  )
}

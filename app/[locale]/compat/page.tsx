// 兼容性。版式照设计稿 v.stats（design/远征尼朋官网.dc.html:1190-1338）：图例四张卡，
// 下面一张拓扑图——本体居中，右边按泳道排第三方 mod，中间一列是兼容包，左边是前置。
//
// 设计稿的拓扑图是一整套 JS（悬停、拖动、按宽度缩放）。这里全部换成 CSS：
// 坐标在构建时算好（lib/content/compat-page.ts），缩放用容器查询单位，
// 悬停时只亮相关节点用 :has()——规则按节点逐条生成，放在下面那个 <style> 里。拖动不做。
// 窄屏（拓扑图缩到看不清）改显示同一份数据的列表。
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Segs } from '@/components/Seg'
import { compatPage, HUB, LANG, layout, NODE, STAGE, type Edge } from '@/lib/content/compat-page'
import { inline } from '@/lib/content/inline'
import type { Bi } from '@/lib/content/schema'
import { pick, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('compat')
}

const G = layout(compatPage)

/** 节点位置走 CSS 变量，换算成真实像素的那一步在 CSS 里（× --u） */
const at = (x: number, y: number, w: number, exp: number, h = NODE.h) =>
  ({ '--x': x, '--y': y, '--w': w, '--h': h, '--exp': exp }) as CSSProperties

/** 漂浮动画的周期与相位，按序号错开，免得一起上下（设计稿同款取法） */
const drift = (i: number, base: number) =>
  ({ '--dur': `${(base + (i % 7) * 0.39).toFixed(2)}s`, '--delay': `-${((i % 9) * 0.73).toFixed(2)}s` }) as CSSProperties

/** 悬停某个节点时，除了它和它的亲戚，其余全部压暗 */
function focusRules(): string {
  const items = [...G.nodes, ...G.vias, ...G.langs]
  return items
    .map(({ key }) => {
      const on = `.cp-stage:has([data-k="${key}"]:is(:hover,:focus-visible))`
      return (
        `${on} .cp-item:not([data-k="${key}"]):not([data-kin~="${key}"]){opacity:.14}` +
        `${on} .cp-item[data-kin~="${key}"]{box-shadow:var(--cp-ring)}` +
        `${on} .cp-edge:not([data-kin~="${key}"]){opacity:.06}` +
        `${on} .cp-lane{opacity:.42}`
      )
    })
    .join('\n')
}

const url = (u: string | Bi | undefined, locale: Locale) => (u ? pick(u, locale) : undefined)

export default function CompatPage() {
  const locale = useLocale()
  const t = useTranslations()
  const label = (g: string) => compatPage.groups.find((x) => x.key === g)?.label

  return (
    <div className="page">
      <div className="measure">
        <h1 className="page__title">{t('nav.stats')}</h1>
        <p className="page__lede">{pick(compatPage.lede, locale)}</p>

        <ul className="cp-legend">
          {compatPage.groups.map((g) => (
            <li key={g.key}>
              <p className="cp-legend__label">
                <span className={`cp-dot cp-dot--${g.key}`} aria-hidden="true" />
                {pick(g.label, locale)}
              </p>
              <p className="cp-legend__desc">{pick(g.desc, locale)}</p>
            </li>
          ))}
        </ul>

        <div className="cp-wrap">
          <style>{focusRules()}</style>
          <div className="cp-stage">
            {G.lanes.map((l, i) => (
              <div className={`cp-lane cp-lane--${l.group}`} style={at(l.x + l.w / 2, l.y, l.w, l.w, l.h)} key={i}>
                <p className="cp-lane__label">
                  <span className={`cp-dot cp-dot--${l.group === 'via' ? 'full' : l.group}`} aria-hidden="true" />
                  {l.group === 'via' ? t('compat.patches') : pick(label(l.group)!, locale)}
                </p>
              </div>
            ))}

            <svg className="cp-edges" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden="true">
              <defs>
                {(['full', 'ok', 'conflict', 'required', 'lang'] as const).map((g) => (
                  <marker id={`cp-mk-${g}`} key={g} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M0 1.6 L9 5 L0 8.4 z" className={`cp-mk cp-mk--${g}`} />
                  </marker>
                ))}
              </defs>
              {G.edges.map((e, i) => (
                <EdgePath e={e} i={i} key={i} />
              ))}
            </svg>

            <div className="cp-hub" style={at(HUB.x, HUB.y, HUB.r * 2, HUB.r * 2)}>
              <span className="cp-hub__halo" />
              <span className="cp-hub__ring cp-hub__ring--dash" />
              <span className="cp-hub__ring cp-hub__ring--arc" />
              <div className="cp-hub__core">
                <p className="cp-hub__name">{pick(compatPage.hub, locale)}</p>
                <p className="cp-hub__sub">{pick(compatPage.hubSub, locale)}</p>
                <span className="cp-hub__line" />
              </div>
            </div>

            {G.vias.map((v, i) => (
              <a
                className="cp-item cp-via"
                href={v.info.url}
                target="_blank"
                rel="noopener"
                data-k={v.key}
                data-kin={v.kin.join(' ')}
                style={{ ...at(v.x, v.y, v.w, v.exp), ...drift(i, 6.8) }}
                key={v.key}
              >
                <span className="cp-port cp-port--l" />
                <span className="cp-port cp-port--r" />
                <span className="cp-item__title">
                  <span className="cp-diamond" aria-hidden="true" />
                  {pick(v.info.label, locale)}
                </span>
                <span className="cp-item__more">
                  <span>
                    {t('compat.connects')}
                    {v.kids.map((k) => pick(compatPage.nodes.find((n) => n.key === k)!.short, locale)).join(locale === 'zh' ? '、' : ', ')}
                  </span>
                  <span className="cp-item__cta">{t('compat.open')}</span>
                </span>
              </a>
            ))}

            {G.nodes.map((n, i) => {
              const href = url(n.data.url, locale)
              const Tag = href ? 'a' : 'div'
              const seg = inline(pick(n.data.note, locale))
              return (
                <Tag
                  className={`cp-item cp-node cp-node--${n.data.group}`}
                  {...(href ? { href, target: '_blank', rel: 'noopener' } : { tabIndex: 0 })}
                  data-k={n.key}
                  data-kin={n.kin.join(' ')}
                  style={{ ...at(n.x, n.y, n.w, n.exp), ...drift(i, 6.3) }}
                  key={n.key}
                >
                  <span className={`cp-port ${n.data.group === 'required' ? 'cp-port--r' : 'cp-port--l'}`} />
                  <span className="cp-item__title">
                    <span className="cp-item__short">{pick(n.data.short, locale)}</span>
                    <span className="cp-item__name">{pick(n.data.name, locale)}</span>
                    {n.data.tbd && <span className="cp-badge">{t('compat.tbd')}</span>}
                  </span>
                  <span className="cp-item__more">
                    <span>
                      {seg.warn && <span className="warn-label">{t('warnLabel')}</span>}
                      <Segs segs={seg.segs} />
                    </span>
                    {n.data.via && (
                      <span className="cp-item__via">
                        {t('compat.via')} {pick(n.data.via.label, locale)}
                      </span>
                    )}
                    {href && <span className="cp-item__cta">{t('compat.open')}</span>}
                  </span>
                </Tag>
              )
            })}

            {G.langs.map((l, i) => (
              <a
                className="cp-item cp-lang"
                href={l.data.url}
                target="_blank"
                rel="noopener"
                data-k={l.key}
                data-kin={l.kin.join(' ')}
                style={{ ...at(l.x, l.y, l.w, l.exp, LANG.h), ...drift(i, 7.2) }}
                key={l.key}
              >
                <span className="cp-item__title">
                  <span className="cp-dot cp-dot--lang" aria-hidden="true" />
                  <span className="cp-item__short">{pick(l.data.short, locale)}</span>
                  <span className="cp-item__name">{pick(l.data.name, locale)}</span>
                  <span className="cp-badge cp-badge--lang">
                    {l.data.only === 'zh' ? t('compat.langOnlyZh') : t('compat.langOnlyEn')}
                  </span>
                </span>
                <span className="cp-item__more">
                  <span>{pick(l.data.note, locale)}</span>
                  <span className="cp-item__cta">{t('compat.open')}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <p className="cp-hint">{t('compat.hint')}</p>

        {/* 窄屏：同一份数据排成列表 */}
        <div className="cp-list">
          {compatPage.groups.map((g) => (
            <section className="cp-list__group" key={g.key}>
              <h2 className="eyebrow eyebrow--rule">
                <span className={`cp-dot cp-dot--${g.key}`} aria-hidden="true" />
                {pick(g.label, locale)}
              </h2>
              <ul className="rows">
                {compatPage.nodes
                  .filter((n) => n.group === g.key)
                  .map((n) => {
                    const href = url(n.url, locale)
                    const seg = inline(pick(n.note, locale))
                    return (
                      <li key={n.key}>
                        <p className="rows__head">
                          <span className="rows__name">
                            {href ? (
                              <a href={href} target="_blank" rel="noopener">
                                {pick(n.name, locale)} ↗
                              </a>
                            ) : (
                              pick(n.name, locale)
                            )}
                          </span>
                          {n.tbd && <span className="cp-badge">{t('compat.tbd')}</span>}
                        </p>
                        <p className="rows__desc">
                          {seg.warn && <span className="warn-label">{t('warnLabel')}</span>}
                          <Segs segs={seg.segs} />
                        </p>
                        {n.via && (
                          <p className="rows__desc cp-list__via">
                            {t('compat.via')}{' '}
                            <a href={n.via.url} target="_blank" rel="noopener">
                              {pick(n.via.label, locale)} ↗
                            </a>
                          </p>
                        )}
                      </li>
                    )
                  })}
                {g.key === 'required' &&
                  compatPage.langs.map((l) => (
                    <li key={l.key}>
                      <p className="rows__head">
                        <span className="rows__name">
                          <a href={l.url} target="_blank" rel="noopener">
                            {pick(l.name, locale)} ↗
                          </a>
                        </span>
                        <span className="cp-badge cp-badge--lang">
                          {l.only === 'zh' ? t('compat.langOnlyZh') : t('compat.langOnlyEn')}
                        </span>
                      </p>
                      <p className="rows__desc">{pick(l.note, locale)}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="cp-note">
          <Segs segs={inline(pick(compatPage.note, locale)).segs} />
        </p>
      </div>
    </div>
  )
}

function EdgePath({ e, i }: { e: Edge; i: number }) {
  const kin = e.kin.join(' ')
  return (
    <g className={`cp-edge cp-edge--${e.kind} cp-edge--g-${e.group}`} data-kin={kin}>
      <path className="cp-edge__halo" d={e.d} />
      <path className="cp-edge__line" d={e.d} markerEnd={e.kind === 'lang' ? undefined : `url(#cp-mk-${e.group})`} />
      {e.kind === 'flow' && <path className="cp-edge__flow" d={e.d} style={{ animationDuration: `${2.8 + (i % 5) * 0.36}s` }} />}
      {e.kind === 'flow' && (
        <circle className="cp-spark" r="2.9">
          <animateMotion dur={`${3.6 + (i % 6) * 0.4}s`} begin={`-${(i * 0.5).toFixed(2)}s`} repeatCount="indefinite" path={e.d} />
        </circle>
      )}
      {e.kind === 'conflict' && e.mid && <Cross m={e.mid} />}
    </g>
  )
}

/** 冲突边正中一个 × */
function Cross({ m }: { m: NonNullable<Edge['mid']> }) {
  const l = Math.hypot(m.dx, m.dy) || 1
  const ux = (m.dx / l) * 7
  const uy = (m.dy / l) * 7
  const qx = (-m.dy / l) * 7
  const qy = (m.dx / l) * 7
  const f = (n: number) => n.toFixed(1)
  const d =
    `M${f(m.x - ux - qx)} ${f(m.y - uy - qy)} L${f(m.x + ux + qx)} ${f(m.y + uy + qy)} ` +
    `M${f(m.x - ux + qx)} ${f(m.y - uy + qy)} L${f(m.x + ux - qx)} ${f(m.y + uy - qy)}`
  return <path className="cp-edge__cross" d={d} />
}

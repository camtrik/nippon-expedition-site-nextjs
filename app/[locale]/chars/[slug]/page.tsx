// 人物页。版式照设计稿 v.char（design/远征尼朋官网.dc.html:750-1003）：
// 左边立绘（多套外观时下面一排卡片可切换，纯 CSS radio），右边位阶、称号、名字、短文、
// 身份、背景故事、分形态数值表、武器与坐骑；底下是特性 / 技能 / 部队属性三栏、
// 技能树（只列本 mod 原创的那几行，生成物）和远征同伴的四档羁绊。
import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import { notFound } from 'next/navigation'

import { altName, epithetText } from '@/components/CodexIndex'
import { loadCard, loadFull, SkillIcon } from '@/components/art'
import { Link } from '@/i18n/navigation'
import { allChars, charBySlug, type Char } from '@/lib/content/codex'
import type { Bi, GenNodeData } from '@/lib/content/schema'
import { pick } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export const dynamicParams = false

export function generateStaticParams() {
  return allChars.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/chars/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const c = charBySlug(slug)
  if (!c) return {}
  const locale = await getLocale()
  return buildMetadata('codex', {
    href: `/chars/${slug}`,
    title: pick(c.name, locale),
    description: pick(c.desc, locale),
    image: await loadFull('chars', c.looks[0].key),
  })
}

type Look = { key: string; label?: Bi; card: StaticImageData; portrait: StaticImageData }

export default async function CharPage({ params }: PageProps<'/[locale]/chars/[slug]'>) {
  const { slug } = await params
  const c = charBySlug(slug)
  if (!c) notFound()
  const looks: Look[] = await Promise.all(
    c.looks.map(async (l) => ({ ...l, card: await loadCard('chars', l.key), portrait: await loadFull('chars', l.key) })),
  )
  return <CharDetail c={c} looks={looks} />
}

const NUMERALS = { zh: ['壹', '贰', '叁', '肆'], en: ['I', 'II', 'III', 'IV'] }

function CharDetail({ c, looks }: { c: Char; looks: Look[] }) {
  const locale = useLocale()
  const t = useTranslations()
  const back = (
    <Link className="detail__back" href="/codex/chars">
      ← {t('tabChars')}
    </Link>
  )
  const rows = (list: { k: Bi; v: Bi; form?: Bi }[]) =>
    list.map((r, i) => (
      <li key={i}>
        <p className="rows__head">
          <span className="rows__name">{pick(r.k, locale)}</span>
          {r.form && <span className="rows__form">{pick(r.form, locale)}</span>}
        </p>
        <p className="rows__desc">{pick(r.v, locale)}</p>
      </li>
    ))

  return (
    <div className="page detail">
      <div className="measure">
        {back}
        <div className="detail__top">
          <aside className="detail__aside detail__aside--char">
            <Looks name={pick(c.name, locale)} looks={looks} />
          </aside>

          <div className="detail__main detail__main--char">
            <header className="detail__header">
              <p className="detail__pills">
                <span className="pill pill--jade">{pick(c.rankLabel, locale)}</span>
              </p>
              {c.epithet && <p className="detail__epithet">{epithetText(c.epithet, locale)}</p>}
              <h1 className="detail__name">{pick(c.name, locale)}</h1>
              <p className="detail__alt">{altName(c.name, locale)}</p>
              <p className="detail__desc">{pick(c.desc, locale)}</p>
            </header>

            {c.identity.length > 0 && (
              <section className="detail__section">
                <h2 className="eyebrow eyebrow--rule">{t('detail.secIdentity')}</h2>
                <dl className="kv kv--grid">
                  {c.identity.map((r, i) => (
                    <div key={i}>
                      <dt>{pick(r.k, locale)}</dt>
                      <dd>{pick(r.v, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {c.story && (
              <section className="detail__section">
                <h2 className="eyebrow eyebrow--rule">{t('detail.secStory')}</h2>
                {c.story.map((para, i) => (
                  <p className="detail__story" key={i}>
                    {pick(para, locale)}
                  </p>
                ))}
              </section>
            )}

            {c.stats && (
              <section className="detail__section">
                <h2 className="eyebrow eyebrow--rule">{t('detail.secStats')}</h2>
                <div className="forms-scroll">
                  <table className="forms">
                    <thead>
                      <tr>
                        <td />
                        {c.stats.forms.map((f, i) => (
                          <th scope="col" key={i}>
                            {pick(f, locale)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.stats.rows.map((r, i) => (
                        <tr key={i}>
                          <th scope="row">{pick(r.k, locale)}</th>
                          {r.v.map((cell, j) => (
                            <td key={j}>{pick(cell, locale)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {c.stats.note && <p className="forms__note">{pick(c.stats.note, locale)}</p>}
              </section>
            )}

            {[
              { head: t('detail.secWeapons'), list: c.weapons },
              { head: t('detail.secMounts'), list: c.mounts },
            ]
              .filter((b) => b.list.length)
              .map((b) => (
                <section className="detail__section" key={b.head}>
                  <h2 className="eyebrow eyebrow--rule">{b.head}</h2>
                  <ul className="rows">{rows(b.list)}</ul>
                </section>
              ))}
          </div>
        </div>

        <div className="detail__groups">
          {c.traits.length > 0 && (
            <section>
              <h2 className="eyebrow eyebrow--rule">{t('detail.secCharTraits')}</h2>
              <ul className="bullets">
                {c.traits.map((tr, i) => (
                  <li className="bullets__item" key={i}>
                    <span className="bullets__arrow" aria-hidden="true">
                      ▲
                    </span>
                    <p className="bullets__name">{pick(tr.k, locale)}</p>
                    <p className="bullets__desc">
                      {pick(tr.v, locale)}
                      {tr.form && ` · ${pick(tr.form, locale)}`}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {[
            { head: t('detail.secAbilities'), list: c.abilities },
            { head: t('detail.secAttrs'), list: c.attrs },
          ]
            .filter((b) => b.list.length)
            .map((b) => (
              <section key={b.head}>
                <h2 className="eyebrow eyebrow--rule">{b.head}</h2>
                <ul className="rows rows--tiles">{rows(b.list)}</ul>
              </section>
            ))}
        </div>

        {c.tree && c.gen && (
          <section className="tree" id="tree">
            <h2 className="eyebrow eyebrow--rule">{t('detail.secTree')}</h2>
            {c.tree.note && <p className="tree__note">{pick(c.tree.note, locale)}</p>}
            {c.tree.branches.map((b, i) => {
              const nodes = c.gen!.branches.find((g) => g.indent === b.indent)?.nodes ?? []
              return (
                <div className="tree__branch" key={i}>
                  <div className="tree__branch-head">
                    <h3 className="tree__label">{pick(b.label, locale)}</h3>
                    {b.sub && <p className="tree__sub">{pick(b.sub, locale)}</p>}
                  </div>
                  <ol className="tree__nodes">
                    {nodes.map((n) => (
                      <TreeNode n={n} key={n.key} />
                    ))}
                  </ol>
                </div>
              )
            })}
          </section>
        )}

        {c.companion && (
          <section className="bond-detail" id="bond">
            <h2 className="eyebrow eyebrow--rule">{t('detail.secBond')}</h2>
            <ol className="bond-detail__tiers">
              {c.companion.tiers.map((tier, i) => (
                <li key={i}>
                  <span className="bond-detail__num">{NUMERALS[locale][i]}</span>
                  <div>
                    <p className="bond-detail__name">{pick(tier.name, locale)}</p>
                    <p className="bond-detail__desc">{pick(tier.desc, locale)}</p>
                    {tier.rewards.length > 0 && (
                      <ul className="dots bond-detail__rewards">
                        {tier.rewards.map((r, j) => (
                          <li key={j}>{pick(r, locale)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {c.companion.effects.length > 0 && (
              <>
                <p className="eyebrow bond-detail__effects-head">
                  {t('detail.bondEffects')} · {pick(c.companion.trait, locale)}
                </p>
                <dl className="kv kv--grid">
                  {c.companion.effects.map((r, i) => (
                    <div key={i}>
                      <dt>{pick(r.k, locale)}</dt>
                      <dd>{pick(r.v, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </section>
        )}

        {back}
      </div>
    </div>
  )
}

/**
 * 立绘。只有一套外观就是一张图；多套（武士大将三张脸、伊吹两种形态）时下面排一行兵牌，
 * 点哪张换哪张——纯 CSS radio，和更新记录的页签是同一个做法，零 JS。
 * 每套最多四个：CSS 里 :checked 的组合是按序号写死的（80-codex.css）。
 */
function Looks({ name, looks }: { name: string; looks: Look[] }) {
  const locale = useLocale()
  const t = useTranslations()
  if (looks.length === 1) {
    return (
      <div className="detail__art">
        <Image src={looks[0].portrait} alt={name} sizes="(max-width: 700px) 80vw, 300px" priority />
      </div>
    )
  }
  return (
    <div className="looks">
      {looks.map((l, i) => (
        <input
          className="looks__radio"
          type="radio"
          name="look"
          id={`look-${i}`}
          key={l.key}
          defaultChecked={i === 0}
          aria-label={l.label ? pick(l.label, locale) : String(i + 1)}
        />
      ))}
      <div className="detail__art looks__stage">
        {looks.map((l, i) => (
          <Image
            className={`looks__portrait looks__portrait--${i}`}
            src={l.portrait}
            alt={`${name}${l.label ? ` · ${pick(l.label, locale)}` : ''}`}
            sizes="(max-width: 700px) 80vw, 300px"
            priority={i === 0}
            key={l.key}
          />
        ))}
      </div>
      <p className="eyebrow looks__head">{t('detail.looks')}</p>
      <div className="looks__thumbs">
        {looks.map((l, i) => (
          <label className={`looks__thumb looks__thumb--${i}`} htmlFor={`look-${i}`} key={l.key}>
            <Image src={l.card} alt="" sizes="80px" />
            {l.label && <span>{pick(l.label, locale)}</span>}
          </label>
        ))}
      </div>
    </div>
  )
}

function TreeNode({ n }: { n: GenNodeData }) {
  const locale = useLocale()
  const t = useTranslations()
  const many = n.levels.length > 1
  // 级数很多的只留了首尾两级（登峰造极 100 级）——第二个标签写成「… 100 级」
  const gap = many && n.levels.length === 2 && n.levels[1].level - n.levels[0].level > 1
  return (
    <li className={`tree__node${n.reuse ? ' tree__node--reuse' : ''}`}>
      <span className="tree__icon">
        {n.icon ? <SkillIcon file={n.icon} /> : <span aria-hidden="true">{pick(n.name, locale).slice(0, 1)}</span>}
      </span>
      <div className="tree__body">
        <p className="tree__head">
          <span className="tree__name">{pick(n.name, locale)}</span>
          {n.hub && <span className="pill pill--jade tree__hub">{pick(n.hub, locale)}</span>}
          {n.reuse && <span className="tree__reuse">{t('detail.reuse')}</span>}
        </p>
        {n.unlock && <p className="tree__unlock">{pick(n.unlock, locale)}</p>}
        {n.levels.map((lv, i) => (
          <div className="tree__level" key={lv.level}>
            {many && (
              <p className="tree__level-label">
                {gap && i === 1 ? t('detail.levelLast', { n: lv.level }) : t('detail.level', { n: lv.level })}
              </p>
            )}
            <ul className="tree__effects">
              {lv.lines.map((line, j) => (
                <li key={j}>{pick(line, locale)}</li>
              ))}
            </ul>
          </div>
        ))}
        {n.desc && <p className="tree__desc">{pick(n.desc, locale)}</p>}
      </div>
    </li>
  )
}

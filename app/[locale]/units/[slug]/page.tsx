// 兵种页。版式照设计稿 v.unit（design/远征尼朋官网.dc.html:589-748）：
// 左边兵牌大图与招募费 / 维持费，右边定位、名字、短文、长文、两块键值表与数值；
// 底下三栏是兵种特性（▲▼）、技能、部队属性——后两栏的名字、描述、图标是游戏原文（生成物）。
import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { altName } from '@/components/CodexIndex'
import { loadCard, loadFull, SkillIcon } from '@/components/art'
import { Link } from '@/i18n/navigation'
import { allUnits, unitBySlug, type Unit } from '@/lib/content/codex'
import type { GenAbilityData } from '@/lib/content/schema'
import { pick } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export const dynamicParams = false

export function generateStaticParams() {
  return allUnits.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/units/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const u = unitBySlug(slug)
  if (!u) return {}
  const locale = await getLocale()
  return buildMetadata('codex', {
    href: `/units/${slug}`,
    title: pick(u.name, locale),
    description: pick(u.desc, locale),
    image: await loadCard('units', slug),
  })
}

export default async function UnitPage({ params }: PageProps<'/[locale]/units/[slug]'>) {
  const { slug } = await params
  const u = unitBySlug(slug)
  if (!u) notFound()
  const full = await loadFull('units', slug)
  return <UnitDetail u={u} full={full} />
}

function UnitDetail({ u, full }: { u: Unit; full: Awaited<ReturnType<typeof loadFull>> }) {
  const locale = useLocale()
  const t = useTranslations()
  const back = (
    <Link className="detail__back" href="/codex">
      ← {t('tabUnits')}
    </Link>
  )

  return (
    <div className="page detail">
      <div className="measure">
        {back}
        <div className="detail__top">
          <aside className="detail__aside">
            <div className="detail__art detail__art--unit">
              <Image src={full} alt={pick(u.name, locale)} sizes="(max-width: 700px) 60vw, 320px" priority />
            </div>
            {u.cost && (
              <dl className="detail__cost">
                <div>
                  <dt className="eyebrow">{t('detail.costRecruit')}</dt>
                  <dd>{u.cost.recruit}</dd>
                </div>
                <div>
                  <dt className="eyebrow">{t('detail.costUpkeep')}</dt>
                  <dd>{u.cost.upkeep}</dd>
                </div>
              </dl>
            )}
          </aside>

          <div className="detail__main">
            <p className="detail__pills">
              <span className="pill pill--jade">{pick(u.groupName, locale)}</span>
            </p>
            <p className="detail__role">{pick(u.role, locale)}</p>
            <h1 className="detail__name">{pick(u.name, locale)}</h1>
            <p className="detail__alt">{altName(u.name, locale)}</p>
            <p className="detail__desc">{pick(u.desc, locale)}</p>

            {u.story && (
              <section className="detail__section">
                <h2 className="eyebrow eyebrow--rule">{t('detail.secStory')}</h2>
                {u.story.map((para, i) => (
                  <p className="detail__story" key={i}>
                    {pick(para, locale)}
                  </p>
                ))}
              </section>
            )}

            <div className="detail__blocks">
              {[
                { head: t('detail.secType'), rows: u.type },
                { head: t('detail.secRecruit'), rows: u.recruit },
              ]
                .filter((b) => b.rows.length)
                .map((b) => (
                  <section key={b.head}>
                    <h2 className="eyebrow eyebrow--rule">{b.head}</h2>
                    <dl className="kv">
                      {b.rows.map((r, i) => (
                        <div key={i}>
                          <dt>{pick(r.k, locale)}</dt>
                          <dd>{pick(r.v, locale)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
            </div>

            {u.stats.length > 0 && (
              <section className="detail__section">
                <h2 className="eyebrow eyebrow--rule">{t('detail.secStats')}</h2>
                <dl className="stats">
                  {u.stats.map((s, i) => {
                    const v = pick(s.v, locale)
                    // 大多数格子是数字；「实心炮弹，落地会弹跳……」这种整句的不该用 20px 粗体右对齐
                    const text = v.length > 14
                    return (
                      <div key={i} className={text ? 'stats__row--text' : undefined}>
                        <dt>{pick(s.k, locale)}</dt>
                        <dd>{v}</dd>
                        {s.n && <dd className="stats__note">{pick(s.n, locale)}</dd>}
                      </div>
                    )
                  })}
                </dl>
              </section>
            )}
          </div>
        </div>

        <div className="detail__groups">
          {u.traits.length > 0 && (
            <section>
              <h2 className="eyebrow eyebrow--rule">{t('detail.secTraits')}</h2>
              <ul className="bullets">
                {u.traits.map((tr, i) => (
                  <li className={tr.down ? 'bullets__item bullets__item--down' : 'bullets__item'} key={i}>
                    <span className="bullets__arrow" aria-hidden="true">
                      {tr.down ? '▼' : '▲'}
                    </span>
                    <p className="bullets__name">{pick(tr.name, locale)}</p>
                    <p className="bullets__desc">{pick(tr.desc, locale)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {u.gen.abilities.length > 0 && (
            <section>
              <h2 className="eyebrow eyebrow--rule">{t('detail.secAbilities')}</h2>
              <ul className="skills">
                {u.gen.abilities.map((a) => (
                  <SkillRow key={a.key} a={a} effect={u.effects[a.key] ? pick(u.effects[a.key], locale) : undefined} />
                ))}
              </ul>
            </section>
          )}

          {(u.gen.attrs.length > 0 || u.attrsExtra.length > 0) && (
            <section>
              <h2 className="eyebrow eyebrow--rule">{t('detail.secAttrs')}</h2>
              <ul className="skills">
                {u.gen.attrs.map((a) => (
                  <SkillRow key={a.key} a={a} />
                ))}
                {u.attrsExtra.map((x, i) => (
                  <li className="skills__item" key={i}>
                    <span className="skills__icon skills__icon--blank" aria-hidden="true" />
                    <div className="skills__body">
                      <p className="skills__head">
                        <span className="skills__name">{pick(x.name, locale)}</span>
                      </p>
                      <p className="skills__desc">{pick(x.desc, locale)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {back}
      </div>
    </div>
  )
}

/** 一条技能 / 部队属性：图标、名字、来源标签、游戏描述，以及设计书里的效果说明（金线那一段） */
function SkillRow({ a, effect }: { a: GenAbilityData; effect?: string }) {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <li className="skills__item">
      {a.icon ? (
        <SkillIcon file={a.icon} className="skills__icon" />
      ) : (
        <span className="skills__icon skills__icon--blank" aria-hidden="true" />
      )}
      <div className="skills__body">
        <p className="skills__head">
          <span className="skills__name">{pick(a.name, locale)}</span>
          <span className="skills__tag">{a.source === 'vanilla' ? t('detail.srcVanilla') : t('detail.srcMod')}</span>
        </p>
        {a.desc && <p className="skills__desc">{pick(a.desc, locale)}</p>}
        {effect && <p className="skills__effect">{effect}</p>}
      </div>
    </li>
  )
}

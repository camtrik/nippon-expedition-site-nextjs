// 背景故事。版式照设计稿 v.lore（design/远征尼朋官网.dc.html:433-526）：
// 夜色头图（加载海报），几章左栏标题 + 右栏正文，最后一章是夜板上的胜利路线。
import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

import poster from '@/assets/site/poster-1800.webp'
import { VictoryRoutes } from '@/components/VictoryRoutes'
import { lore } from '@/lib/content/lore'
import { pick } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('lore')
}

/** 章节序号。中文用一二三四，英文用阿拉伯数字——设计稿如此（loreRoutesNum） */
const NUMS = { zh: ['一', '二', '三', '四', '五', '六'], en: ['1', '2', '3', '4', '5', '6'] }

export default function LorePage() {
  const locale = useLocale()
  const t = useTranslations()
  const nums = NUMS[locale]

  return (
    <>
      <section className="lore-hero">
        <Image className="lore-hero__art" src={poster} alt="" priority sizes="100vw" />
        <div className="lore-hero__scrim" />
        <div className="measure lore-hero__inner">
          <p className="eyebrow lore-hero__eyebrow">{t('nav.lore')}</p>
          <h1 className="lore-hero__title">{pick(lore.title, locale)}</h1>
          <p className="lore-hero__lede">{pick(lore.lede, locale)}</p>
        </div>
      </section>

      {lore.chapters.map((c, i) => (
        <section className={`band lore-chapter${i % 2 ? ' lore-chapter--alt' : ''}`} id={c.id} key={c.id} data-anchor>
          <div className="measure rail">
            <div className="rail__head">
              <p className="lore-num">{nums[i]}</p>
              <h2 className="rail__title">{pick(c.title, locale)}</h2>
            </div>
            <div className="rail__body lore-chapter__body">
              {c.quote.length > 0 && (
                <blockquote className="lore-quote">
                  {c.quote.map((line, j) => (
                    <p key={j}>{pick(line, locale)}</p>
                  ))}
                </blockquote>
              )}
              {c.body.map((p, j) => (
                <p className="lore-chapter__para" key={j}>
                  {pick(p, locale)}
                </p>
              ))}
              {c.pairs.length > 0 && (
                <dl className="lore-pairs">
                  {c.pairs.map((pair, j) => (
                    <div key={j}>
                      <dt className="eyebrow">{pick(pair.k, locale)}</dt>
                      <dd>{pick(pair.v, locale)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="band plate--night" id="routes" data-anchor>
        <div className="measure rail">
          <div className="rail__head">
            <p className="lore-num lore-num--night">{nums[lore.chapters.length]}</p>
            <h2 className="rail__title">{pick(lore.routesTitle, locale)}</h2>
          </div>
          <div className="rail__body">
            <VictoryRoutes />
          </div>
        </div>
      </section>
    </>
  )
}

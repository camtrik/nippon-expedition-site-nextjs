// 胜利路线：短期胜利一张卡，分叉连接件，两条长期路线并排。
// 简介页的夜板和背景故事页的第四章用的是同一块，只是外面的标题不同。
import { useLocale, useTranslations } from 'next-intl'

import { Segs } from '@/components/Seg'
import { victory } from '@/lib/content/home'
import { inline } from '@/lib/content/inline'
import { pick } from '@/lib/i18n'

export function VictoryRoutes() {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <>
      {victory.note && (
        <p className="victory__note">
          <Segs segs={inline(pick(victory.note, locale)).segs} />
        </p>
      )}

      <div className="victory__card victory__card--short">
        <VictoryCard card={victory.short} />
      </div>

      {/* 分叉：两条长线是并行的，不是二选一——这个标签就是说这件事的，别省 */}
      <div className="victory__fork">
        <span className="victory__fork-label">{t('forkLabel')}</span>
      </div>

      <ul className="victory__routes">
        {victory.routes.map((route, i) => (
          <li className="victory__card" key={i}>
            <VictoryCard card={route} />
          </li>
        ))}
      </ul>
    </>
  )
}

function VictoryCard({ card }: { card: (typeof victory)['short'] }) {
  const locale = useLocale()
  return (
    <>
      {card.tag && (
        <span className="victory__tag" aria-hidden="true">
          {card.tag}
        </span>
      )}
      <p className="eyebrow victory__kind">{pick(card.kind, locale)}</p>
      <h3 className="victory__name">{pick(card.name, locale)}</h3>
      <p className="victory__quote">{pick(card.quote, locale)}</p>
      <ul className="dots victory__goals">
        {card.goals.map((g, i) => (
          <li key={i}>
            <Segs segs={inline(pick(g, locale)).segs} />
          </li>
        ))}
      </ul>
      {card.outcome && <p className="victory__outcome">{pick(card.outcome, locale)}</p>}
    </>
  )
}

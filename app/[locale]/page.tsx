import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import type { ReactNode } from 'react'

import harbour from '@/assets/site/harbour-1800.webp'
import mon from '@/assets/site/mon.webp'
import { ArtCard, SceneImage } from '@/components/art'
import { Segs } from '@/components/Seg'
import { VictoryRoutes } from '@/components/VictoryRoutes'
import { Link } from '@/i18n/navigation'
import {
  ai,
  buildings,
  companions,
  compat,
  credits,
  hero,
  lords,
  overview,
  relocations,
  units,
  victory,
} from '@/lib/content/home'
import { charBySlug } from '@/lib/content/codex'
import { inline } from '@/lib/content/inline'
import { latestReleased } from '@/lib/content/releases'
import { pick } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('overview')
}

// 语言不走 props：每个区块自己 useLocale() 读内容、useTranslations() 读词表。
// 这些都是同步的 Server Component，next-intl 的 hook 在服务端一样能用。
export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <>
      <Hero />

      {/* 日板：这个包里到底有什么 */}
      <Band id="overview" title={pick(overview.title, locale)}>
        <Overview />
      </Band>
      <Band id="lords" title={pick(lords.title, locale)}>
        <Lords />
      </Band>
      <Band id="companions" title={pick(companions.title, locale)}>
        <Companions />
      </Band>
      {/* ⚠️ 这个区块的标题用词表的 tabUnits，不是 units.title——设计稿如此 */}
      <Band id="units" title={t('tabUnits')}>
        <Units />
      </Band>
      <Band id="buildings" title={pick(buildings.title, locale)}>
        <Buildings />
      </Band>

      {/* 夜板：战役自己的故事，和它转折的那个分叉。位置就在建筑之后（设计稿 :367） */}
      <Victory />

      {/* 日板：参考资料 */}
      <Band id="relocations" title={pick(relocations.title, locale)}>
        <Relocations />
      </Band>
      <Band id="ai" title={pick(ai.title, locale)}>
        <AiBand />
      </Band>
      <Band id="compat" title={pick(compat.title, locale)}>
        <Compat />
      </Band>
      <Band id="credits" title={pick(credits.title, locale)}>
        <Credits />
      </Band>
    </>
  )
}

/**
 * 左栏标题 + 右栏内容。id 就是分享锚点——用旧站那套裸 id（#overview…#credits）。
 * data-anchor 让 HashSync 在滚到这里时把地址栏改成 #id。
 */
function Band({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="band" id={id} data-anchor>
      <div className="measure rail">
        <div className="rail__head">
          <h2 className="rail__title">{title}</h2>
        </div>
        <div className="rail__body">{children}</div>
      </div>
    </section>
  )
}

function Hero() {
  const locale = useLocale()
  const t = useTranslations()
  const note = pick(hero.note, locale)
  return (
    <section className="hero">
      <Image className="hero__art" src={harbour} alt={pick(hero.art_alt, locale)} priority sizes="100vw" />
      <div className="hero__scrim" />
      <div className="measure hero__inner">
        <Image className="hero__crest" src={mon} alt={pick(hero.crest_alt, locale)} width={64} height={64} priority />
        <p className="eyebrow hero__eyebrow">{pick(hero.eyebrow, locale)}</p>
        <h1 className="hero__title">
          {/* 字标是拉丁字面量，中英两版共用一份 */}
          <span className="hero__wordmark">{hero.wordmark}</span>
          <span className="hero__name">{pick(hero.name, locale)}</span>
        </h1>
        <p className="hero__premise">{pick(hero.premise, locale)}</p>
        {/* 中文那份是空串，所以只有英文页会出现这句 */}
        {note && <p className="hero__disclaimer">{note}</p>}

        <div className="hero__actions">
          <p className="eyebrow hero__actions-label">{t('heroActionsLabel')}</p>
          <div className="hero__buttons">
            <a className="cta" href={t('workshopUrl')} target="_blank" rel="noopener">
              {t('subscribe')}
            </a>
            <Link className="cta cta--ghost" href="/lore">
              {t('nav.lore')}
            </Link>
            <Link className="cta cta--ghost" href="/codex">
              {t('nav.codex')}
            </Link>
          </div>
        </div>

        {/* 版本号来自 latestReleased()，不硬编码 */}
        {latestReleased && (
          <Link className="hero__latest" href="/changelog">
            <span>{t('latest')}</span>
            <strong>
              v{latestReleased.version} · {latestReleased.date}
            </strong>
            <span className="hero__latest-more">{t('nav.log')} →</span>
          </Link>
        )}
      </div>
    </section>
  )
}

function Overview() {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <>
      <ul className="overview__plain">
        {overview.plain.map((item, i) => (
          <li key={i}>
            <Segs segs={inline(pick(item, locale)).segs} />
          </li>
        ))}
      </ul>

      {/* 子 mod 越来越多，默认收起。原生 <details>，零 JS（同 FAQ 的做法）。 */}
      <details className="overview__packs">
        <summary className="overview__packs-summary">
          <span className="overview__packs-head">
            {t('packsTitle')}
            <span className="overview__packs-count">{overview.packs.length}</span>
          </span>
          <span className="overview__packs-rule" aria-hidden="true" />
          <span className="overview__packs-glyph" aria-hidden="true" />
        </summary>
        <p className="overview__packs-hint">{t('packsHint')}</p>
        <ul className="packs">
          {overview.packs.map((pack) => (
            <li className="pack" key={pack.url}>
              <span className="pill pack__kind">{t('packKind')}</span>
              <h3 className="pack__name">
                <a href={pack.url} target="_blank" rel="noopener">
                  {pick(pack.name, locale)}
                </a>
              </h3>
              <p className="pack__note">
                <Segs segs={inline(pick(pack.note, locale)).segs} />
              </p>
              {pack.points && pack.points.length > 0 && (
                <ul className="dots pack__points">
                  {pack.points.map((p, i) => (
                    <li key={i}>
                      <Segs segs={inline(pick(p, locale)).segs} />
                    </li>
                  ))}
                </ul>
              )}
              <p className="pack__cta pack__foot">
                <a href={pack.url} target="_blank" rel="noopener">
                  {t('subscribe')} ↗
                </a>
              </p>
            </li>
          ))}
        </ul>
      </details>

      {overview.requires.map((item, i) => (
        <p className="overview__requires" key={i}>
          <Segs segs={inline(pick(item, locale)).segs} />
        </p>
      ))}
    </>
  )
}

function Lords() {
  const locale = useLocale()
  const t = useTranslations()
  // ⚠️ JSON 是 rows[].items[] 两层，设计稿的取数把它拍平了。这里按 JSON 的真实形状来，
  // 美术位的左右交替按「摊平后的行序」算——设计稿也是按索引算的，不是读 side 字段。
  const rows = lords.rows.flatMap((row) => row.items)
  return (
    <ul className="lords">
      {rows.map((item, i) => {
        const people = item.people ?? (item.slug && item.name ? [{ slug: item.slug, name: item.name }] : [])
        return (
          <li key={i}>
            <div className="lords__art">
              {/* 卡面用图鉴里这个人物的第一套外观（武士大将有三张脸，这里放朱甲那张） */}
              {people.map((p) => (
                <ArtCard
                  key={p.slug}
                  kind="chars"
                  slug={charBySlug(p.slug)?.looks[0].key ?? p.slug}
                  name={pick(p.name, locale)}
                  href={`/chars/${p.slug}`}
                />
              ))}
            </div>
            <div className="lords__copy">
              <p
                className={`eyebrow lords__kind${item.rank === 'legendary' ? ' lords__kind--legendary' : ''}`}
              >
                {pick(item.kind, locale)}
              </p>
              {item.name && <h3 className="lords__name">{pick(item.name, locale)}</h3>}
              <p className="lords__body">
                <Segs segs={inline(pick(item.body, locale)).segs} />
              </p>
              {item.slug && (
                <Link className="lords__more" href={`/chars/${item.slug}`}>
                  {t('moreLabel')} →
                </Link>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Companions() {
  const locale = useLocale()
  const numerals = companions.numerals[locale]
  return (
    <>
      <p className="band__lede">{pick(companions.lede, locale)}</p>

      <div className="bond">
        <p className="eyebrow bond__label">{pick(companions.tiers_label, locale)}</p>
        <p className="bond__tiers">
          {companions.tiers.map((t, i) => (
            <span key={i}>
              {i > 0 && <span className="bond__arrow"> → </span>}
              {pick(t, locale)}
            </span>
          ))}
        </p>
        <ul className="dots bond__notes">
          {companions.notes.map((n, i) => (
            <li key={i}>
              <Segs segs={inline(pick(n, locale)).segs} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="companions">
        {companions.items.map((c) => (
          <li key={c.slug}>
            <Link className="companion__link" href={`/chars/${c.slug}`}>
              <SceneImage slug={c.slug} alt="" />
              <h3 className="companion__name">{pick(c.name, locale)}</h3>
            </Link>
            <p className="eyebrow">{pick(companions.chapters_label, locale)}</p>
            <ol className="chapters">
              {c.chapters.map((ch, i) => (
                <li key={i}>
                  <span className="chapters__num">{numerals[i] ?? String(i + 1)}</span>
                  <span>{pick(ch, locale)}</span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </>
  )
}

function Units() {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <>
      {units.groups.map((group, i) => (
        <div className="unit-group" key={i}>
          <p className="eyebrow eyebrow--rule">{pick(group.name, locale)}</p>
          <ul className="units">
            {group.items.map((u) => (
              <li key={u.slug}>
                <ArtCard kind="units" slug={u.slug} name={pick(u.name, locale)} href={`/units/${u.slug}`} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link className="units__more" href="/codex">
        {t('nav.codex')} →
      </Link>
    </>
  )
}

function Buildings() {
  const locale = useLocale()
  return (
    <ul className="buildings">
      {buildings.items.map((b, i) => (
        <li key={i}>
          <h3>{pick(b.name, locale)}</h3>
          <p>
            <Segs segs={inline(pick(b.body, locale)).segs} />
          </p>
        </li>
      ))}
    </ul>
  )
}

function Victory() {
  const locale = useLocale()
  return (
    <section className="band plate--night" id="victory" data-anchor>
      <div className="measure rail">
        <div className="rail__head">
          <h2 className="rail__title">{pick(victory.title, locale)}</h2>
        </div>
        <div className="rail__body">
          <VictoryRoutes />
        </div>
      </div>
    </section>
  )
}

function Relocations() {
  const locale = useLocale()
  return (
    <>
      <p className="band__lede">{pick(relocations.lede, locale)}</p>
      <div className="table-scroll">
        <table className="reloc">
          <thead>
            <tr>
              <th scope="col">{pick(relocations.head.lord, locale)}</th>
              <th scope="col">{pick(relocations.head.dest, locale)}</th>
            </tr>
          </thead>
          <tbody>
            {relocations.rows.map((r, i) => (
              <tr key={i}>
                <th scope="row">{pick(r.lord, locale)}</th>
                <td>{pick(r.dest, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function AiBand() {
  const locale = useLocale()
  return (
    <>
      <p className="band__lede">{pick(ai.lede, locale)}</p>
      <ul className="dots">
        {ai.items.map((item, i) => (
          <li key={i}>
            <Segs segs={inline(pick(item, locale)).segs} />
          </li>
        ))}
      </ul>
      {/* 「句子—链接—句子」是内容里手工拆开的，保持原样拼回去 */}
      <p className="band__tail">
        {pick(ai.more, locale)}
        <a href={ai.more_link.url} target="_blank" rel="noopener">
          {pick(ai.more_link.label, locale)}
        </a>
        {pick(ai.more_tail, locale)}
      </p>
    </>
  )
}

function Compat() {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <ul className="dots">
      {compat.items.map((item, i) => {
        const seg = inline(pick(item, locale))
        return (
          <li key={i}>
            {seg.warn && <span className="warn-label">{t('warnLabel')}</span>}
            <Segs segs={seg.segs} />
          </li>
        )
      })}
    </ul>
  )
}

function Credits() {
  const locale = useLocale()
  return (
    <>
      <p className="band__lede">{pick(credits.lede, locale)}</p>
      <ul className="credits__list">
        {credits.items.map((c) => (
          <li key={c.url}>
            <a href={c.url} target="_blank" rel="noopener">
              {pick(c.label, locale)} ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="band__tail">
        <Segs segs={inline(pick(credits.tail, locale)).segs} />
      </p>
    </>
  )
}

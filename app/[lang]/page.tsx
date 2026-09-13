import type { Metadata } from 'next'
import Image from 'next/image'
import type { ReactNode } from 'react'

import harbour from '@/assets/site/harbour-1800.webp'
import mon from '@/assets/site/mon.webp'
import { ArtCard, SceneImage } from '@/components/art'
import { PageShell } from '@/components/PageShell'
import { Segs } from '@/components/Seg'
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
import { inline } from '@/lib/content/inline'
import { latestReleased } from '@/lib/content/releases'
import { ui } from '@/lib/content/ui'
import { asLang, hrefFor, pick, type Bilingual, type Lang } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  return buildMetadata(asLang((await params).lang), 'overview')
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const lang = asLang((await params).lang)

  return (
    <PageShell lang={lang} current="overview">
      <Hero lang={lang} />

      {/* 日板：这个包里到底有什么 */}
      <Band id="overview" title={overview.title} lang={lang}>
        <Overview lang={lang} />
      </Band>
      <Band id="lords" title={lords.title} lang={lang}>
        <Lords lang={lang} />
      </Band>
      <Band id="companions" title={companions.title} lang={lang}>
        <Companions lang={lang} />
      </Band>
      {/* ⚠️ 这个区块的标题用 ui.tabUnits，不是 units.title——设计稿如此 */}
      <Band id="units" title={ui.tabUnits} lang={lang}>
        <Units lang={lang} />
      </Band>
      <Band id="buildings" title={buildings.title} lang={lang}>
        <Buildings lang={lang} />
      </Band>

      {/* 夜板：战役自己的故事，和它转折的那个分叉。位置就在建筑之后（设计稿 :367） */}
      <Victory lang={lang} />

      {/* 日板：参考资料 */}
      <Band id="relocations" title={relocations.title} lang={lang}>
        <Relocations lang={lang} />
      </Band>
      <Band id="ai" title={ai.title} lang={lang}>
        <AiBand lang={lang} />
      </Band>
      <Band id="compat" title={compat.title} lang={lang}>
        <Compat lang={lang} />
      </Band>
      <Band id="credits" title={credits.title} lang={lang}>
        <Credits lang={lang} />
      </Band>
    </PageShell>
  )
}

/** 左栏标题 + 右栏内容。id 就是分享锚点——用旧站那套裸 id（#overview…#credits）。 */
function Band({
  id,
  title,
  lang,
  children,
}: {
  id: string
  title: Bilingual
  lang: Lang
  children: ReactNode
}) {
  return (
    <section className="band" id={id}>
      <div className="measure rail">
        <div className="rail__head">
          <h2 className="rail__title">{pick(title, lang)}</h2>
        </div>
        <div className="rail__body">{children}</div>
      </div>
    </section>
  )
}

function Hero({ lang }: { lang: Lang }) {
  const note = pick(hero.note, lang)
  return (
    <section className="hero">
      <Image className="hero__art" src={harbour} alt={pick(hero.art_alt, lang)} priority sizes="100vw" />
      <div className="hero__scrim" />
      <div className="measure hero__inner">
        <Image className="hero__crest" src={mon} alt={pick(hero.crest_alt, lang)} width={64} height={64} priority />
        <p className="eyebrow hero__eyebrow">{pick(hero.eyebrow, lang)}</p>
        <h1 className="hero__title">
          {/* 字标是拉丁字面量，中英两版共用一份 */}
          <span className="hero__wordmark">{hero.wordmark}</span>
          <span className="hero__name">{pick(hero.name, lang)}</span>
        </h1>
        <p className="hero__premise">{pick(hero.premise, lang)}</p>
        {/* 中文那份是空串，所以只有英文页会出现这句 */}
        {note && <p className="hero__disclaimer">{note}</p>}

        <div className="hero__actions">
          <p className="eyebrow hero__actions-label">{pick(ui.heroActionsLabel, lang)}</p>
          {/* 设计稿这里还有指向背景故事和图鉴的两个次级按钮——那两页阶段 3 才有 */}
          <a className="cta" href={pick(ui.workshopUrl, lang)} target="_blank" rel="noopener">
            {pick(ui.subscribe, lang)}
          </a>
        </div>

        {/* 版本号来自 latestReleased()，不硬编码 */}
        {latestReleased && (
          <a className="hero__latest" href={hrefFor(lang, 'changelog')}>
            <span>{pick(ui.latest, lang)}</span>
            <strong>
              v{latestReleased.version} · {latestReleased.date}
            </strong>
            <span className="hero__latest-more">{pick(ui.nav.log, lang)} →</span>
          </a>
        )}
      </div>
    </section>
  )
}

function Overview({ lang }: { lang: Lang }) {
  return (
    <>
      <ul className="overview__plain">
        {overview.plain.map((item, i) => (
          <li key={i}>
            <Segs segs={inline(pick(item, lang)).segs} />
          </li>
        ))}
      </ul>

      <p className="eyebrow eyebrow--rule overview__packs-head">{pick(ui.packsTitle, lang)}</p>
      <p className="overview__packs-hint">{pick(ui.packsHint, lang)}</p>
      <ul className="packs">
        {overview.packs.map((pack) => (
          <li className="pack" key={pack.url}>
            <span className="pill pack__kind">{pick(ui.packKind, lang)}</span>
            <h3 className="pack__name">
              <a href={pack.url} target="_blank" rel="noopener">
                {pick(pack.name, lang)}
              </a>
            </h3>
            <p className="pack__note">
              <Segs segs={inline(pick(pack.note, lang)).segs} />
            </p>
            {pack.points && pack.points.length > 0 && (
              <ul className="dots pack__points">
                {pack.points.map((p, i) => (
                  <li key={i}>
                    <Segs segs={inline(pick(p, lang)).segs} />
                  </li>
                ))}
              </ul>
            )}
            <p className="pack__cta pack__foot">
              <a href={pack.url} target="_blank" rel="noopener">
                {pick(ui.subscribe, lang)} ↗
              </a>
            </p>
          </li>
        ))}
      </ul>

      {overview.requires.map((item, i) => (
        <p className="overview__requires" key={i}>
          <Segs segs={inline(pick(item, lang)).segs} />
        </p>
      ))}
    </>
  )
}

function Lords({ lang }: { lang: Lang }) {
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
              {people.map((p) => (
                <ArtCard key={p.slug} kind="chars" slug={p.slug} name={pick(p.name, lang)} />
              ))}
            </div>
            <div className="lords__copy">
              <p
                className={`eyebrow lords__kind${item.rank === 'legendary' ? ' lords__kind--legendary' : ''}`}
              >
                {pick(item.kind, lang)}
              </p>
              {item.name && <h3 className="lords__name">{pick(item.name, lang)}</h3>}
              <p className="lords__body">
                <Segs segs={inline(pick(item.body, lang)).segs} />
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Companions({ lang }: { lang: Lang }) {
  const numerals = companions.numerals[lang]
  return (
    <>
      <p className="band__lede">{pick(companions.lede, lang)}</p>

      <div className="bond">
        <p className="eyebrow bond__label">{pick(companions.tiers_label, lang)}</p>
        <p className="bond__tiers">
          {companions.tiers.map((t, i) => (
            <span key={i}>
              {i > 0 && <span className="bond__arrow"> → </span>}
              {pick(t, lang)}
            </span>
          ))}
        </p>
        <ul className="dots bond__notes">
          {companions.notes.map((n, i) => (
            <li key={i}>
              <Segs segs={inline(pick(n, lang)).segs} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="companions">
        {companions.items.map((c) => (
          <li key={c.slug}>
            <SceneImage slug={c.slug} alt="" />
            <h3 className="companion__name">{pick(c.name, lang)}</h3>
            <p className="eyebrow">{pick(companions.chapters_label, lang)}</p>
            <ol className="chapters">
              {c.chapters.map((ch, i) => (
                <li key={i}>
                  <span className="chapters__num">{numerals[i] ?? String(i + 1)}</span>
                  <span>{pick(ch, lang)}</span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </>
  )
}

function Units({ lang }: { lang: Lang }) {
  return (
    <>
      {units.groups.map((group, i) => (
        <div className="unit-group" key={i}>
          <p className="eyebrow eyebrow--rule">{pick(group.name, lang)}</p>
          <ul className="units">
            {group.items.map((u) => (
              <li key={u.slug}>
                <ArtCard kind="units" slug={u.slug} name={pick(u.name, lang)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

function Buildings({ lang }: { lang: Lang }) {
  return (
    <ul className="buildings">
      {buildings.items.map((b, i) => (
        <li key={i}>
          <h3>{pick(b.name, lang)}</h3>
          <p>
            <Segs segs={inline(pick(b.body, lang)).segs} />
          </p>
        </li>
      ))}
    </ul>
  )
}

function Victory({ lang }: { lang: Lang }) {
  return (
    <section className="band plate--night" id="victory">
      <div className="measure rail">
        <div className="rail__head">
          <h2 className="rail__title">{pick(victory.title, lang)}</h2>
        </div>
        <div className="rail__body">
          {victory.note && (
            <p className="victory__note">
              <Segs segs={inline(pick(victory.note, lang)).segs} />
            </p>
          )}

          <div className="victory__card victory__card--short">
            <VictoryCard card={victory.short} lang={lang} />
          </div>

          {/* 分叉：两条长线是并行的，不是二选一——这个标签就是说这件事的，别省 */}
          <div className="victory__fork">
            <span className="victory__fork-label">{pick(ui.forkLabel, lang)}</span>
          </div>

          <ul className="victory__routes">
            {victory.routes.map((route, i) => (
              <li className="victory__card" key={i}>
                <VictoryCard card={route} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function VictoryCard({ card, lang }: { card: (typeof victory)['short']; lang: Lang }) {
  return (
    <>
      {card.tag && (
        <span className="victory__tag" aria-hidden="true">
          {card.tag}
        </span>
      )}
      <p className="eyebrow victory__kind">{pick(card.kind, lang)}</p>
      <h3 className="victory__name">{pick(card.name, lang)}</h3>
      <p className="victory__quote">{pick(card.quote, lang)}</p>
      <ul className="dots victory__goals">
        {card.goals.map((g, i) => (
          <li key={i}>
            <Segs segs={inline(pick(g, lang)).segs} />
          </li>
        ))}
      </ul>
      {card.outcome && <p className="victory__outcome">{pick(card.outcome, lang)}</p>}
    </>
  )
}

function Relocations({ lang }: { lang: Lang }) {
  return (
    <>
      <p className="band__lede">{pick(relocations.lede, lang)}</p>
      <div className="table-scroll">
        <table className="reloc">
          <thead>
            <tr>
              <th scope="col">{pick(relocations.head.lord, lang)}</th>
              <th scope="col">{pick(relocations.head.dest, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {relocations.rows.map((r, i) => (
              <tr key={i}>
                <th scope="row">{pick(r.lord, lang)}</th>
                <td>{pick(r.dest, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function AiBand({ lang }: { lang: Lang }) {
  return (
    <>
      <p className="band__lede">{pick(ai.lede, lang)}</p>
      <ul className="dots">
        {ai.items.map((item, i) => (
          <li key={i}>
            <Segs segs={inline(pick(item, lang)).segs} />
          </li>
        ))}
      </ul>
      {/* 「句子—链接—句子」是内容里手工拆开的，保持原样拼回去 */}
      <p className="band__tail">
        {pick(ai.more, lang)}
        <a href={ai.more_link.url} target="_blank" rel="noopener">
          {pick(ai.more_link.label, lang)}
        </a>
        {pick(ai.more_tail, lang)}
      </p>
    </>
  )
}

function Compat({ lang }: { lang: Lang }) {
  return (
    <ul className="dots">
      {compat.items.map((item, i) => {
        const seg = inline(pick(item, lang))
        return (
          <li key={i}>
            {seg.warn && <span className="warn-label">{pick(ui.warnLabel, lang)}</span>}
            <Segs segs={seg.segs} />
          </li>
        )
      })}
    </ul>
  )
}

function Credits({ lang }: { lang: Lang }) {
  return (
    <>
      <p className="band__lede">{pick(credits.lede, lang)}</p>
      <ul className="credits__list">
        {credits.items.map((c) => (
          <li key={c.url}>
            <a href={c.url} target="_blank" rel="noopener">
              {pick(c.label, lang)} ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="band__tail">
        <Segs segs={inline(pick(credits.tail, lang)).segs} />
      </p>
    </>
  )
}

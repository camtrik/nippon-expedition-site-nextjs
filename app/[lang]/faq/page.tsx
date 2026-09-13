import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { Segs } from '@/components/Seg'
import { anchorFor, faq } from '@/lib/content/faq'
import { inline } from '@/lib/content/inline'
import { latestReleased } from '@/lib/content/releases'
import { faqCount, faqStatus, ui } from '@/lib/content/ui'
import { asLang, fill, hrefFor, pick, type Lang } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[lang]/faq'>): Promise<Metadata> {
  return buildMetadata(asLang((await params).lang), 'faq')
}

export default async function FaqPage({ params }: PageProps<'/[lang]/faq'>) {
  const lang = asLang((await params).lang)

  return (
    <PageShell lang={lang} current="faq">
      <div className="page">
        <div className="measure">
          <h1 className="page__title">{pick(ui.nav.faq, lang)}</h1>

          {/* 版本号来自 latestReleased()，不手填——手填的那份迟早对不上 */}
          {latestReleased && (
            <p className="stamp faq-stamp">
              {fill(pick(ui.faqCurrent, lang), { version: latestReleased.version })}
            </p>
          )}

          <div className="faq-bands">
            {faq.sections.map((section) => (
              <section className="rail faq-band" key={section.slug} id={section.slug}>
                <div className="rail__head">
                  <h2 className="rail__title">{pick(section.title, lang)}</h2>
                  <p className="rail__count">{countLabel(section.items.length, lang)}</p>
                </div>
                <div className="rail__body">
                  <ul className="faq-list">
                    {section.items.map((item) => (
                      // ⚠️ id 是 q-<slug>，slug 直接来自 content/faq.json。
                      // 这些地址散在工坊评论里，上线之后一个都不许改。
                      <li className="faq-item" key={item.slug} id={anchorFor(item.slug)}>
                        <details>
                          <summary className="faq-summary">
                            <span className="faq-q">
                              <span className="faq-q__text">{pick(item.question, lang)}</span>
                              {item.status && item.version && (
                                <span className={`pill faq-status--${item.status}`}>
                                  {fill(pick(faqStatus[item.status], lang), {
                                    version: item.version,
                                  })}
                                </span>
                              )}
                            </span>
                            <span className="faq-glyph" aria-hidden="true" />
                          </summary>
                          <div className="faq-answer">
                            {item.answer.map((para, i) => (
                              <p key={i}>
                                <Segs segs={inline(pick(para, lang)).segs} />
                              </p>
                            ))}
                            {item.links && item.links.length > 0 && (
                              <div className="faq-links">
                                {item.links.map((link) => (
                                  <a key={link.url} href={link.url} target="_blank" rel="noopener">
                                    {pick(link.label, lang)} ↗
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          <p className="faq-tail">
            {pick(faq.tail, lang)}{' '}
            <a href={hrefFor(lang, 'changelog')}>{pick(ui.faqTailLink, lang)}</a>
          </p>
        </div>
      </div>
    </PageShell>
  )
}

function countLabel(n: number, lang: Lang): string {
  return fill(pick(n === 1 ? faqCount.one : faqCount.other, lang), { n })
}

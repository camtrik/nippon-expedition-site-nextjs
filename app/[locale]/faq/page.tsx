import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'

import { Segs } from '@/components/Seg'
import { Link } from '@/i18n/navigation'
import { anchorFor, faq } from '@/lib/content/faq'
import { inline } from '@/lib/content/inline'
import { latestReleased } from '@/lib/content/releases'
import { pick } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('faq')
}

export default function FaqPage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="page">
      <div className="measure">
        <h1 className="page__title">{t('nav.faq')}</h1>

        {/* 版本号来自 latestReleased()，不手填——手填的那份迟早对不上 */}
        {latestReleased && (
          <p className="stamp faq-stamp">{t('faqCurrent', { version: latestReleased.version })}</p>
        )}

        <div className="faq-bands">
          {faq.sections.map((section) => (
            <section className="rail faq-band" key={section.slug} id={section.slug}>
              <div className="rail__head">
                <h2 className="rail__title">{pick(section.title, locale)}</h2>
                {/* 单复数交给 ICU（messages 里的 faqCount），不用自己分 one / other */}
                <p className="rail__count">{t('faqCount', { n: section.items.length })}</p>
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
                            <span className="faq-q__text">{pick(item.question, locale)}</span>
                            {item.status && item.version && (
                              <span className={`pill faq-status--${item.status}`}>
                                {t(`faqStatus.${item.status}`, { version: item.version })}
                              </span>
                            )}
                          </span>
                          <span className="faq-glyph" aria-hidden="true" />
                        </summary>
                        <div className="faq-answer">
                          {item.answer.map((para, i) => (
                            <p key={i}>
                              <Segs segs={inline(pick(para, locale)).segs} />
                            </p>
                          ))}
                          {item.links && item.links.length > 0 && (
                            <div className="faq-links">
                              {item.links.map((link) => (
                                <a key={link.url} href={link.url} target="_blank" rel="noopener">
                                  {pick(link.label, locale)} ↗
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
          {pick(faq.tail, locale)} <Link href="/changelog">{t('faqTailLink')}</Link>
        </p>
      </div>
    </div>
  )
}

// 黑底页脚。设计稿是一行：站名 + 部署时间 + 两个链接。
// 旧站那条 FOOTER_LEDE 和 7 条工坊链接设计稿都没有——子 mod 在简介页的卡片网格里。
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { BUILD_TIME } from '@/lib/site'

export function SiteFooter() {
  const t = useTranslations()
  return (
    <footer className="site-footer">
      <div className="measure site-footer__inner">
        <div className="site-footer__group">
          <span>{t('siteFull')}</span>
          <span>
            {t('footerDeployed')}
            <time dateTime={BUILD_TIME.slice(0, 10)}>{BUILD_TIME}</time>
          </span>
        </div>
        <div className="site-footer__group">
          <a href={t('workshopUrl')} target="_blank" rel="noopener">
            {t('workshop')}
          </a>
          <Link href="/changelog">{t('nav.log')}</Link>
        </div>
      </div>
    </footer>
  )
}

// 黑底页脚。设计稿是一行：站名 + 部署时间 + 两个链接。
// 旧站那条 FOOTER_LEDE 和 7 条工坊链接设计稿都没有——子 mod 在简介页的卡片网格里。
import { ui } from '@/lib/content/ui'
import { hrefFor, pick, type Lang } from '@/lib/i18n'
import { BUILD_TIME } from '@/lib/site'

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer">
      <div className="measure site-footer__inner">
        <div className="site-footer__group">
          <span>{pick(ui.siteFull, lang)}</span>
          <span>
            {pick(ui.footerDeployed, lang)}
            <time dateTime={BUILD_TIME.slice(0, 10)}>{BUILD_TIME}</time>
          </span>
        </div>
        <div className="site-footer__group">
          <a href={pick(ui.workshopUrl, lang)} target="_blank" rel="noopener">
            {pick(ui.workshop, lang)}
          </a>
          <a href={hrefFor(lang, 'changelog')}>{pick(ui.nav.log, lang)}</a>
        </div>
      </div>
    </footer>
  )
}

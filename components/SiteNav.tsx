// 顶部药丸导航。六项照设计稿：简介 / 背景故事 / 图鉴 / 更新记录 / 常见问题 / 兼容性。
//
// 这是 Server Component：词表在服务端就填好，不进浏览器。只有需要知道当前路径的
// 两小块（高亮 NavLink、语言开关 LangSwitch）是客户端组件，边界压到叶子上。
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import mon from '@/assets/site/mon.webp'
import { Link } from '@/i18n/navigation'
import { PAGES } from '@/lib/site'
import { LangSwitch } from './LangSwitch'
import { NavLink } from './NavLink'

export function SiteNav() {
  const t = useTranslations()
  return (
    <nav className="site-nav" aria-label={t('navAria')}>
      <div className="site-nav__pill">
        <Link className="site-nav__logo" href="/">
          <Image className="site-nav__mark" src={mon} alt="" width={24} height={24} priority />
          <span>{t('site')}</span>
        </Link>

        <div className="site-nav__links">
          {PAGES.map((p) => (
            <NavLink key={p.id} href={p.href} also={p.also}>
              {t(`nav.${p.nav}`)}
            </NavLink>
          ))}
        </div>

        <LangSwitch />
      </div>
    </nav>
  )
}

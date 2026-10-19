import type { Viewport } from 'next'
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl'

import '../globals.css'

import { HashSync } from '@/components/HashSync'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { routing } from '@/i18n/routing'
import { LOCALE_META } from '@/lib/i18n'
import { fontVariables } from '../fonts'
import { Analytics } from '@vercel/analytics/react'

// zh / en 两套页面都在构建时展开。加语言就改 i18n/routing.ts 一处。
// dynamicParams=false：locales 之外的段（/xx/）直接 404，不用在组件里兜。
export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#fbf9f8',
  colorScheme: 'light',
}

// 三个页面各自的 title / description 在自己的 generateMetadata 里（lib/metadata.ts）。
// 图标不在这里声明：app/favicon.ico 由 Next 自动挂上，再写一遍会多出一条重复的 <link>。

/*
  全站唯一的一段内联 JS，只做一件事：#q-<slug> 这样的直链要能看到答案——
  把命中的 <details> 展开再重新对位。原生 <details> 没法用纯 CSS 从 :target 强制展开。
  放在 <head> 里同步执行，首屏画出来之前就展开了，不会闪。

  首访语言判断和记住语言选择以前也在这里（localStorage + location.replace）；
  现在由 proxy.ts 里的 next-intl 中间件在服务端做（Accept-Language + NEXT_LOCALE cookie），
  没有闪动，也不需要客户端脚本。
*/
const BOOT = `(function(){function o(){var h=location.hash.slice(1);if(!h)return;
var el=document.getElementById(decodeURIComponent(h));if(!el)return;
var d=el.tagName==='DETAILS'?el:el.querySelector('details');
if(d&&!d.open){d.open=true;el.scrollIntoView()}}
document.addEventListener('DOMContentLoaded',o);
window.addEventListener('hashchange',o)})();`

export default function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  // 语言来自 app/[locale] 这个根参数（见 i18n/request.ts），不用从 params 里取再传下去
  const locale = useLocale()
  const t = useTranslations()

  return (
    <html lang={LOCALE_META[locale].htmlLang} className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        {/* 客户端组件（NavLink / LangSwitch）从这个 Provider 拿 locale 和词表 */}
        <NextIntlClientProvider>
          <a className="skip-link" href="#main">
            {t('skipToContent')}
          </a>
          <div className="shell">
            <SiteNav />
            <main id="main" className="shell__main">
              {children}
            </main>
            <SiteFooter />
          </div>
          <HashSync />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

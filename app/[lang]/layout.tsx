import type { Metadata, Viewport } from 'next'

import '../globals.css'

import { SiteFooter } from '@/components/SiteFooter'
import { fontVariables } from '../fonts'
import { ui } from '@/lib/content/ui'
import { LANGS, asLang, pick } from '@/lib/i18n'

// zh / en 两套页面都在构建时展开。加语言就改 LANGS 一处。
// dynamicParams=false：LANGS 之外的段（/xx/）直接 404，不用在组件里兜。
export const dynamicParams = false

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: '#fbf9f8',
  colorScheme: 'light',
}

// 三个页面各自的 title / description 在自己的 generateMetadata 里（lib/metadata.ts）。
export const metadata: Metadata = {
  icons: { icon: '/favicon.ico' },
}

/*
  全站唯一的一段 JS。三件事，都不需要 React：

  ① 首访语言判断。浏览器语言不是中文的读者，第一次访问自动去英文页。
     ⚠️ 一辈子只做一次——用过语言开关就写下 localStorage['npex-lang']，之后不再触发。
     改成每次访问都判断会把别人分享的链接顶掉。用 replace 不是 assign：不留 history 条目。
  ② 记住语言选择（① 的开关）。委托监听，不需要给语言开关标 'use client'。
  ③ #q-<slug> 这样的直链要能看到答案：把命中的 <details> 展开再重新对位。
     原生 <details> 没法用纯 CSS 从 :target 强制展开，这三行是唯一的替代。

  放在 <head> 里同步执行，所以 ① 在首屏画出来之前就决定了，不会闪。
*/
const BOOT = `(function(){var K='npex-lang';
function s(){try{return window.localStorage}catch(e){return null}}
(function(){var st=s();if(st&&st.getItem(K))return;var p=location.pathname;
if(p==='/en'||p.slice(0,4)==='/en/')return;
var t=navigator.languages||[navigator.language||''];
for(var i=0;i<t.length;i++)if(/^zh/i.test(t[i]))return;
location.replace('/en'+(p==='/'?'':p)+location.search+location.hash)})();
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest&&e.target.closest('[data-lang]');if(!a)return;
var st=s();if(st)try{st.setItem(K,a.getAttribute('data-lang'))}catch(x){}},true);
function o(){var h=location.hash.slice(1);if(!h)return;
var el=document.getElementById(decodeURIComponent(h));if(!el)return;
var d=el.tagName==='DETAILS'?el:el.querySelector('details');
if(d&&!d.open){d.open=true;el.scrollIntoView()}}
document.addEventListener('DOMContentLoaded',o);
window.addEventListener('hashchange',o)})();`

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const lang = asLang((await params).lang)

  return (
    <html lang={pick(ui.langHtml, lang)} className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {pick(ui.skipToContent, lang)}
        </a>
        <div className="shell">
          {children}
          <SiteFooter lang={lang} />
        </div>
      </body>
    </html>
  )
}

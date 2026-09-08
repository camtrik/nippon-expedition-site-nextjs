import type { Metadata } from 'next'
import { LANGS } from '@/lib/i18n'
import '../globals.css'

// zh / en 两套页面都在构建时展开。加语言就改 LANGS 一处。
// dynamicParams=false：LANGS 之外的段（/xx/）直接 404，不用在组件里兜。
export const dynamicParams = false

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: '远征尼朋 · 玉海舰队',
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params

  return (
    <html lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
      <body>{children}</body>
    </html>
  )
}

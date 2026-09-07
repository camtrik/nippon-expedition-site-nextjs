import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LANGS, isLang } from '@/lib/i18n'
import '../globals.css'

// zh / en 两套页面都在构建时展开。加语言就改 LANGS 一处。
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: '远征尼朋 · 玉海舰队',
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <html lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
      <body>{children}</body>
    </html>
  )
}

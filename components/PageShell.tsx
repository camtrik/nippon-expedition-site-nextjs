// 导航 + <main>。每个页面用它包一层，把自己的 id 传进来当导航高亮。
//
// 为什么不放在 layout.tsx 里：Server Component 拿不到当前路径，
// 而为了一个 aria-current 就把导航标成 'use client'，等于给每页背上 React 运行时。
// 页面只有三个，各写一行包装比这划算。页脚不需要知道当前页，所以留在 layout 里。
import type { ReactNode } from 'react'

import { SiteNav } from './SiteNav'
import type { Lang } from '@/lib/i18n'
import type { PageId } from '@/lib/site'

export function PageShell({
  lang,
  current,
  children,
}: {
  lang: Lang
  current: PageId
  children: ReactNode
}) {
  return (
    <>
      <SiteNav lang={lang} current={current} />
      <main id="main" className="shell__main">
        {children}
      </main>
    </>
  )
}

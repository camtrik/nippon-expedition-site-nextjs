'use client'

// 导航项。当前页的高亮从路由本身读（usePathname），不用页面把自己的 id 传上来。
import type { ReactNode } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  return (
    <Link className="site-nav__link" href={href} aria-current={pathname === href ? 'page' : undefined}>
      {children}
    </Link>
  )
}

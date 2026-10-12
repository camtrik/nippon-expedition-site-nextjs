'use client'

// 导航项。当前页的高亮从路由本身读（usePathname），不用页面把自己的 id 传上来。
import type { ReactNode } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

export function NavLink({
  href,
  also = [],
  children,
}: {
  href: string
  /** 这些路径开头的页面也高亮这一项（兵种页、人物页归「图鉴」） */
  also?: readonly string[]
  children: ReactNode
}) {
  const pathname = usePathname()
  const here =
    pathname === href ||
    (href !== '/' && pathname.startsWith(href + '/')) ||
    also.some((p) => pathname.startsWith(p))
  return (
    <Link className="site-nav__link" href={href} aria-current={here ? 'page' : undefined}>
      {children}
    </Link>
  )
}

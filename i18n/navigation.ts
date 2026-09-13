import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * 站内导航一律从这里拿，不用 next/link 也不手拼前缀：
 * `<Link href="/faq">` 在英文页自动变成 `/en/faq`，带 `locale` 属性就是语言切换。
 */
export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing)

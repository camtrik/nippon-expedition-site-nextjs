'use client'

/**
 * 滚动时把地址栏的 #hash 同步成当前所在的小节——看到哪一节，复制地址栏就是哪一节的链接。
 * 不做 ¶ 复制按钮：地址栏本身就是分享入口，少一套 UI。
 *
 * 候选是带 data-anchor 的元素（简介的 band、FAQ 的分组）。FAQ 的单个问题只有展开时才算，
 * 这样 #q-<slug> 只会出现在读者真的点开看的时候；layout 里的 BOOT 脚本会在对方打开链接时把它展开。
 *
 * 用 replaceState 而不是 pushState：滚动不该往历史里塞记录，否则后退键要按几十下。
 * Next 16 会把原生 history 调用并入路由状态（见 docs「Native History API」），不会触发导航。
 */
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** 小节顶部越过视口上方这个比例时，算「读到这一节了」。 */
const LINE = 1 / 3

function candidates(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-anchor]')).filter(
    (el) => el.dataset.anchor !== 'open' || el.querySelector('details')?.open,
  )
}

function current(): string {
  const els = candidates()
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
  const line = atBottom ? window.innerHeight : window.innerHeight * LINE
  let id = ''
  for (const el of els) {
    if (el.getBoundingClientRect().top <= line) id = el.id
  }
  return id
}

function write(id: string) {
  const hash = id ? `#${id}` : ''
  if (location.hash === hash) return
  window.history.replaceState(null, '', location.pathname + location.search + hash)
}

export function HashSync() {
  const pathname = usePathname()

  useEffect(() => {
    // 只在滚动 / 展开时改写，挂载时不动：带 hash 进来的链接先交给浏览器定位
    let last = current()

    // 浏览器本来就按帧合并 scroll 事件，不用再套 requestAnimationFrame；
    // 只在算出的小节变了时才写，replaceState 调用次数和小节数同级
    const onScroll = () => {
      const id = current()
      if (id === last) return
      last = id
      write(id)
    }

    // 点开一个问题 = 正在看它，直接写进地址栏，不必等它滚过判定线。
    // 收起时退回按位置算出来的那一节。
    const onToggle = (e: Event) => {
      const details = e.target
      if (!(details instanceof HTMLDetailsElement)) return
      const item = details.closest<HTMLElement>('[data-anchor="open"]')
      if (!item) return
      last = current()
      if (details.open) write(item.id)
      else if (location.hash === `#${item.id}`) write(last)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('toggle', onToggle, true) // toggle 不冒泡，只能捕获
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('toggle', onToggle, true)
    }
  }, [pathname])

  return null
}

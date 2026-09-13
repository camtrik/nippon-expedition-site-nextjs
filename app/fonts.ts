// 字体加载（ROADMAP 决定 12）。三件事交给 next/font：自动 preload、font-display、
// 以及用回退字体的度量补偿消掉布局偏移——这些手写 @font-face 都拿不到。
//
// ⚠️ 子集化没有交出去，也交不出去：next/font 不做这件事。文楷 GB 引的是
// assets/fonts/ 里已经切好的子集，缺字由 scripts/check-font-coverage.mjs 在构建前拦下来。
// ⚠️ 设计稿 <head> 里挂的是 jsDelivr 上的**完整**文楷 GB——那是为了在别人机器上能打开，
// 好几 MB，而且把子集护栏整个绕过去了。不要照搬。
import { Sofia_Sans, Sofia_Sans_Extra_Condensed } from 'next/font/google'
import localFont from 'next/font/local'

// 正文与界面。可变字体，声明一次拿全字重——设计稿用到 400/450/500/700/800。
export const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sofia',
})

// 字标专用的窄体。只用来排 "NIPPON EXPEDITION" 和路线字母，纯拉丁。
export const sofiaSansCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-sofia-cond',
})

// 中文正文。⚠️ 两档是**重量区间**不是单值：正文用 450、界面用 500，
// 区间写法直说「500 及以下画 Regular，600 及以上画 Medium」，
// 不必依赖 CSS 的 400→500 匹配回退分支。这一档也是 <strong> 能看出来的原因——
// 这个家族没有 Bold，Medium 映到 700 才有两级跳。
export const wenkai = localFont({
  src: [
    { path: '../assets/fonts/lxgw-wenkai-gb-regular.woff2', weight: '100 500', style: 'normal' },
    { path: '../assets/fonts/lxgw-wenkai-gb-medium.woff2', weight: '600 900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-wenkai',
})

export const fontVariables = [sofiaSans.variable, sofiaSansCondensed.variable, wenkai.variable].join(' ')

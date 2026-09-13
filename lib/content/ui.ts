// 站点词表。ROADMAP 决定 3d：整个重写过，形状照设计稿的 S.ui。
import uiJson from '@/content/ui.json'
import { Ui } from './schema'

const parsed = (() => {
  try {
    return Ui.parse(uiJson)
  } catch (e) {
    throw new Error(`content/ui.json 不合 schema：\n${(e as Error).message}`)
  }
})()

export const ui = parsed.ui
export const tagLabels = parsed.tagLabels
export const faqCount = parsed.faqCount
export const faqStatus = parsed.faqStatus
export const pageDesc = parsed.pageDesc

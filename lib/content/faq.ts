// 常见问题。
// ⚠️ item.slug 是永久公开契约——它决定页面上的 #q-<slug> 锚点，而那些地址散在
// 创意工坊的评论里。上线之后就不许再改（隔壁 AGENTS.md 写死的）。
import faqJson from '@/content/faq.json'
import { Faq } from './schema'

export const faq = (() => {
  try {
    return Faq.parse(faqJson)
  } catch (e) {
    throw new Error(`content/faq.json 不合 schema：\n${(e as Error).message}`)
  }
})()

export const anchorFor = (slug: string) => `q-${slug}`

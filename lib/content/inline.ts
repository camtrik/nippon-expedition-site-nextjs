// 行内 Markdown → 段（segment）数组。
//
// 为什么不渲染成 HTML 字符串：设计稿要的是结构化数据——每一段自己决定是普通文字、
// 粗体、链接还是行内代码，样式挂在组件上。渲成 HTML 再 dangerouslySetInnerHTML
// 会把设计稿那套版式全丢掉，还得往里塞内联样式。
//
// 允许的语法只有 ROADMAP 决定 3 说的那几种：**粗体**、[文字](链接)、`代码`，
// 以及粗体套链接。出现标题、列表这类块级语法一律报错——JSON 里不许有块级 Markdown。
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { PhrasingContent, Root } from 'mdast'

export type Seg = {
  kind: 'text' | 'code' | 'link'
  text: string
  url?: string
  bold?: boolean
}

export type Inline = {
  segs: Seg[]
  /** 源串里出现过 ⚠️。字形本身会被摘掉，改由组件渲染成一个「注意」药丸。 */
  warn: boolean
}

const processor = unified().use(remarkParse)

export const EMPTY: Inline = { segs: [], warn: false }

/** 把 mdast 的行内节点摊平成 Seg[]。bold 靠递归时往下传，所以粗体套链接不会丢。 */
function flatten(nodes: readonly PhrasingContent[], bold = false): Seg[] {
  const out: Seg[] = []
  for (const n of nodes) {
    switch (n.type) {
      case 'text':
        out.push({ kind: 'text', text: n.value, ...(bold && { bold }) })
        break
      case 'inlineCode':
        out.push({ kind: 'code', text: n.value, ...(bold && { bold }) })
        break
      case 'link':
        out.push({
          kind: 'link',
          text: n.children.map((c) => ('value' in c ? c.value : '')).join(''),
          url: n.url,
          ...(bold && { bold }),
        })
        break
      // 内容里没用过斜体，但 remark 会把 *…* 解析成 emphasis——按粗体处理比丢掉强
      case 'strong':
      case 'emphasis':
        out.push(...flatten(n.children, true))
        break
      default:
        throw new Error(`行内 Markdown 里不该出现 ${n.type}：只允许粗体、链接和行内代码`)
    }
  }
  // 相邻的同类段合并，免得 "**A**B" 这种拆成一堆碎片
  return out.reduce<Seg[]>((acc, s) => {
    const prev = acc[acc.length - 1]
    if (prev && prev.kind === 'text' && s.kind === 'text' && !prev.bold === !s.bold) {
      prev.text += s.text
      return acc
    }
    acc.push(s)
    return acc
  }, [])
}

/** ⚠️ 从文本里摘掉，改成一个标志位。设计稿就是这么处理的（`k_warn`）。 */
function extractWarn(segs: Seg[]): Inline {
  let warn = false
  const out = segs
    .map((s) => {
      if (s.kind !== 'text' || !s.text.includes('⚠️')) return s
      warn = true
      return { ...s, text: s.text.replace(/⚠️️?\s*/g, '') }
    })
    .filter((s) => s.kind !== 'text' || s.text !== '')
  return { segs: out, warn }
}

/** 从 mdast 行内节点直接来——releases 的正文走这条，不用把节点再序列化一遍。 */
export function segsFrom(nodes: readonly PhrasingContent[]): Inline {
  return extractWarn(flatten(nodes))
}

/** 从一个字符串来——content/ 的 JSON 字段走这条。 */
export function inline(md: string): Inline {
  if (!md) return EMPTY
  const root = processor.parse(md) as Root
  if (root.children.length === 0) return EMPTY
  if (root.children.length > 1 || root.children[0].type !== 'paragraph') {
    const kinds = root.children.map((c) => c.type).join(', ')
    throw new Error(
      `JSON 字符串里只允许行内 Markdown，这一条解析出了块级结构（${kinds}）：${md.slice(0, 60)}`,
    )
  }
  return segsFrom(root.children[0].children)
}

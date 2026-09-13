// 更新记录。规则整套从旧站 scripts/sitegen/releases.py 搬过来——那些规则不是随手定的，
// 每一条都对应一个踩过的坑，注释里写了是哪个。
//
// 文件形状（ROADMAP 决定 3b）：content/releases/<名字>.zh.md 和 <名字>.en.md 一对，
// front matter 里只有普通键，正文里没有 <!-- lang: --> 标记。
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { List, ListItem, Root } from 'mdast'

import { routing } from '@/i18n/routing'
import type { Locale } from '@/lib/i18n'
import { segsFrom, type Inline } from './inline'
import { FrontMatter, type FrontMatterData } from './schema'

const DIR = join(process.cwd(), 'content', 'releases')
const processor = unified().use(remarkParse)

/** 一条改动。子 mod 条目的日期挂在这里；本体条目没有日期，日期在整条 entry 上。 */
export type Change = { date?: string; body: Inline; sub: Inline[] }
/** 本体条目里 `### 新增` 这样的一组。note 是小标题下、列表前的那段说明。 */
export type Group = { head: string; note?: Inline; items: Change[] }

export type MainBody = { lede?: Inline; groups: Group[] }
export type SubmodBody = { lede?: Inline; changes: Change[] }

type Base = {
  source: string
  tags: FrontMatterData['tags']
  sortDate: string
  launchDate: string
}
export type MainEntry = Base & {
  channel: 'main'
  version: string
  date?: string
  type: 'release' | 'content' | 'balance' | 'hotfix'
  bodies: Partial<Record<Locale, MainBody>>
}
export type SubmodEntry = Base & {
  channel: 'submod'
  title: Partial<Record<Locale, string>>
  url?: string
  type?: 'release' | 'content' | 'balance' | 'hotfix'
  bodies: Partial<Record<Locale, SubmodBody>>
}
export type Entry = MainEntry | SubmodEntry

// ---- 正文解析 ---------------------------------------------------------------

/** 顶层条目开头的 `2026-08-30 `：那是个日期标签，不是正文。缩进的子条目不带。 */
const LEADING_DATE = /^(\d{4}-\d{2}-\d{2})\s+/

function parseItem(li: ListItem, topLevel: boolean): Change {
  const [first, ...rest] = li.children
  if (!first || first.type !== 'paragraph') {
    throw new Error(`列表项的第一个子节点应该是段落，实际是 ${first?.type ?? '空'}`)
  }
  const nested = rest.filter((n): n is List => n.type === 'list')
  if (nested.length !== rest.length) {
    const odd = rest.find((n) => n.type !== 'list')
    throw new Error(`列表项里出现了没处理的 ${odd?.type}`)
  }

  const children = [...first.children]
  let date: string | undefined
  if (topLevel && children[0]?.type === 'text') {
    const m = LEADING_DATE.exec(children[0].value)
    if (m) {
      date = m[1]
      children[0] = { ...children[0], value: children[0].value.slice(m[0].length) }
    }
  }

  const sub = nested.flatMap((l) => l.children.map((c) => parseItem(c, false).body))
  return { ...(date && { date }), body: segsFrom(children), sub }
}

function parseMain(tree: Root): MainBody {
  let lede: Inline | undefined
  const groups: Group[] = []
  for (const node of tree.children) {
    if (node.type === 'heading') {
      if (node.depth !== 3) throw new Error(`本体条目里只允许 ### 小标题，出现了 h${node.depth}`)
      groups.push({ head: segsFrom(node.children).segs.map((s) => s.text).join(''), items: [] })
      continue
    }
    const g = groups[groups.length - 1]
    if (node.type === 'paragraph') {
      const seg = segsFrom(node.children)
      // ### 之前的那段是整条的导语；之后的是这一组的说明
      if (!g) lede = seg
      else if (g.note) throw new Error(`「${g.head}」下出现了第二段说明，版式只排得下一段`)
      else if (g.items.length) throw new Error(`「${g.head}」的列表后面还有一段文字，版式没有这个位置`)
      else g.note = seg
      continue
    }
    if (node.type === 'list') {
      if (!g) throw new Error('本体条目的正文以列表开头，缺一个 ### 小标题')
      g.items.push(...node.children.map((c) => parseItem(c, true)))
      continue
    }
    throw new Error(`更新记录正文里出现了没处理的 ${node.type}`)
  }
  return { ...(lede && { lede }), groups }
}

function parseSubmod(tree: Root): SubmodBody {
  let lede: Inline | undefined
  const changes: Change[] = []
  for (const node of tree.children) {
    if (node.type === 'paragraph') {
      if (lede) throw new Error('子 mod 条目只排得下一段导语')
      if (changes.length) throw new Error('子 mod 条目的列表后面还有一段文字，版式没有这个位置')
      lede = segsFrom(node.children)
      continue
    }
    if (node.type === 'list') {
      changes.push(...node.children.map((c) => parseItem(c, true)))
      continue
    }
    throw new Error(`子 mod 条目正文里出现了没处理的 ${node.type}`)
  }
  return { ...(lede && { lede }), changes }
}

// ---- 排序 -------------------------------------------------------------------

/** `- 2026-08-30 …` 里的日期。⚠️ 只从中文正文取——旧站也是，两边分开取会排出两种顺序。 */
const BODY_DATE = /^\s*-\s+(\d{4}-\d{2}-\d{2})\b/gm

function bodyDates(md: string): string[] {
  return [...md.matchAll(BODY_DATE)].map((m) => m[1])
}

/** 1.10.0 排在 1.9.0 上面：按段切开转数字比，非数字段当 0。 */
function versionKey(v: string): number[] {
  if (!v) return [0]
  return v.split(/[.\-+]/).map((p) => (/^\d+$/.test(p) ? Number(p) : 0))
}

function cmpVersion(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0) // ⚠️ 短的算小，和 Python 的元组比较一致
    if (d) return d
  }
  return 0
}

// ---- 装载 -------------------------------------------------------------------

function readFrontMatter(file: string): { fm: FrontMatterData; content: string } {
  const { data, content } = matter(readFileSync(join(DIR, file), 'utf8'))
  try {
    return { fm: FrontMatter.parse(data), content }
  } catch (e) {
    throw new Error(`content/releases/${file} 的 front matter 不合 schema：\n${(e as Error).message}`)
  }
}

function collect(): Entry[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.md'))
  const bases = [...new Set(files.map((f) => f.replace(/\.(zh|en)\.md$/, '')))].sort()

  const entries = bases.map<Entry>((source) => {
    const per = new Map<Locale, { fm: FrontMatterData; content: string }>()
    for (const lang of routing.locales) {
      const file = `${source}.${lang}.md`
      if (files.includes(file)) per.set(lang, readFrontMatter(file))
    }
    const zh = per.get(routing.defaultLocale)
    // 缺中文是错误、缺英文只是回落——旧站也是这么分的（cli.py 只 warn）
    if (!zh) throw new Error(`content/releases/${source}：缺 .${routing.defaultLocale}.md`)

    const fm = zh.fm
    const dates = bodyDates(zh.content)
    // 有 front matter date 就用它；子 mod 没有，改用正文里最新的那天——
    // 这样加一行改动就自动重排，不用再去 front matter 改第二处。
    const sortDate = fm.date ?? (dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : '')
    // 正文里最早的那天 = 这个包上线的日子，用来给同一天改动的两个包分先后。
    const launchDate = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : ''
    const base: Base = { source, tags: fm.tags, sortDate, launchDate }

    if (fm.channel === 'submod') {
      const bodies: SubmodEntry['bodies'] = {}
      const title: SubmodEntry['title'] = {}
      for (const [lang, { fm: f, content }] of per) {
        bodies[lang] = wrap(source, lang, () => parseSubmod(processor.parse(content) as Root))
        if (f.title) title[lang] = f.title
      }
      return { ...base, channel: 'submod', title, url: fm.url, type: fm.type, bodies }
    }

    if (!fm.version) throw new Error(`content/releases/${source}：本体条目缺 version`)
    const bodies: MainEntry['bodies'] = {}
    for (const [lang, { content }] of per) {
      bodies[lang] = wrap(source, lang, () => parseMain(processor.parse(content) as Root))
    }
    // 本体条目默认算一次版本发布；子 mod 一条横跨很多次改动，标 release 是撒谎，所以不默认。
    return { ...base, channel: 'main', version: fm.version, date: fm.date, type: fm.type ?? 'release', bodies }
  })

  // 四个键全部降序。没有日期的条目按本仓库的约定是「还没发布」，用哨兵值顶到最上面。
  return entries.sort((a, b) => {
    const sa = a.sortDate || '9999-99-99'
    const sb = b.sortDate || '9999-99-99'
    if (sa !== sb) return sa < sb ? 1 : -1
    if (a.launchDate !== b.launchDate) return a.launchDate < b.launchDate ? 1 : -1
    const v = cmpVersion(
      versionKey(a.channel === 'main' ? a.version : ''),
      versionKey(b.channel === 'main' ? b.version : ''),
    )
    if (v) return -v
    return a.source < b.source ? 1 : -1
  })
}

function wrap<T>(source: string, lang: Locale, fn: () => T): T {
  try {
    return fn()
  } catch (e) {
    throw new Error(`content/releases/${source}.${lang}.md：${(e as Error).message}`)
  }
}

export const releases = collect()
export const mainReleases = releases.filter((r): r is MainEntry => r.channel === 'main')
export const submodReleases = releases.filter((r): r is SubmodEntry => r.channel === 'submod')

/**
 * 站上每一处「最新版本」印章引用的那一条。
 * ⚠️ 不是 releases[0]：子 mod 按自己的发布日排序、没有日期的条目按约定还没上线，
 * 两者都能排在它上面，但都不是能报给玩家去订阅的版本号。
 */
export const latestReleased = mainReleases.find((r) => r.version && r.date)

/** 取某语言的正文；没有就回落到中文，并告诉调用方要挂「暂无译文」的提示。 */
export function bodyFor<T extends Entry>(
  entry: T,
  lang: Locale,
): { body: NonNullable<T['bodies'][Locale]>; fallback: boolean } {
  const own = entry.bodies[lang]
  if (own) return { body: own as NonNullable<T['bodies'][Locale]>, fallback: false }
  const zh = entry.bodies[routing.defaultLocale]
  if (!zh) throw new Error(`${entry.source}：一份正文都没有`)
  return { body: zh as NonNullable<T['bodies'][Locale]>, fallback: true }
}

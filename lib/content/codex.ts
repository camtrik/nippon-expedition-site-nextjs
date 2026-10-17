// 图鉴：兵种与人物。手写的 content/codex/{units,chars}/*.json 加上
// scripts/export-codex.ts 生成的 content/codex/generated/…，在这里合成页面要的形状。
//
// 排序和分组不在这里定：兵种照 content/home/units.json 的分组与顺序（简介页那一排兵牌
// 也是它），人物照 content/home/lords.json 的出场顺序。两边对不上（图鉴有、简介没有，
// 或者反过来）一律报错——那种错在页面上只会表现为「某个兵种不见了」。
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { lords, units as homeUnits } from './home'
import {
  CodexChar,
  CodexUnit,
  GenTraits,
  GenTree,
  GenUnit,
  UNIT_KINDS,
  type CodexCharData,
  type CodexUnitData,
  type GenTraitsData,
  type GenTreeData,
  type GenUnitData,
} from './schema'

const DIR = join(process.cwd(), 'content', 'codex')

function load<T>(sub: string, schema: { parse: (v: unknown) => T }): Map<string, T> {
  const out = new Map<string, T>()
  for (const f of readdirSync(join(DIR, sub)).sort()) {
    if (!f.endsWith('.json')) continue
    try {
      out.set(f.slice(0, -5), schema.parse(JSON.parse(readFileSync(join(DIR, sub, f), 'utf8'))))
    } catch (e) {
      throw new Error(`content/codex/${sub}/${f} 不合 schema：\n${(e as Error).message}`)
    }
  }
  return out
}

const unitFiles = load('units', CodexUnit)
const charFiles = load('chars', CodexChar)
const genUnits = load('generated/units', GenUnit)
const genTrees = load('generated/trees', GenTree)
const genTraits = load('generated/traits', GenTraits)

export type Unit = CodexUnitData & { gen: GenUnitData; groupName: (typeof homeUnits.groups)[number]['name'] }
export type Char = CodexCharData & { gen?: GenTreeData; gameTraits?: GenTraitsData }

// ---- 兵种 ----------------------------------------------------------------------

export const unitGroups = homeUnits.groups.map((g) => ({
  name: g.name,
  items: g.items.map((item): Unit => {
    const u = unitFiles.get(item.slug)
    if (!u) throw new Error(`content/home/units.json 列了 ${item.slug}，content/codex/units/ 里没有这个兵种`)
    const gen = genUnits.get(item.slug)
    if (!gen) throw new Error(`content/codex/generated/units/${item.slug}.json 不存在——跑一次 pnpm export:codex`)
    return { ...u, gen, groupName: g.name }
  }),
}))

export const allUnits = unitGroups.flatMap((g) => g.items)

/** 图鉴索引按兵种类型分组（近战 / 远程 / 怪兽与怪步），组内按招募费从低到高（同价沿用简介页顺序）。
 *  简介页兵牌仍按 unitGroups，那边的顺序直接写在 content/home/units.json 里。 */
const recruitCost = (u: Unit) => u.cost?.recruit ?? Number.POSITIVE_INFINITY
export const unitKindGroups = UNIT_KINDS.map((kind) => ({
  kind,
  items: allUnits.filter((u) => u.kind === kind).sort((a, b) => recruitCost(a) - recruitCost(b)),
})).filter((g) => g.items.length > 0)

for (const slug of unitFiles.keys()) {
  if (!allUnits.some((u) => u.slug === slug)) {
    throw new Error(`content/codex/units/${slug}.json 没有出现在 content/home/units.json 的任何一组里`)
  }
}

export const unitBySlug = (slug: string) => allUnits.find((u) => u.slug === slug)

// ---- 人物 ----------------------------------------------------------------------

/** 简介页「新的领主和英雄」里的出场顺序；那里没列的人物排在最后 */
const order = lords.rows
  .flatMap((r) => r.items)
  .flatMap((it) => it.people?.map((p) => p.slug) ?? (it.slug ? [it.slug] : []))

export const allChars: Char[] = [...charFiles.values()]
  .sort((a, b) => {
    const ia = order.indexOf(a.slug)
    const ib = order.indexOf(b.slug)
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)
  })
  .map((c) => {
    const gen = genTrees.get(c.slug)
    if (c.tree && !gen) throw new Error(`content/codex/generated/trees/${c.slug}.json 不存在——跑一次 pnpm export:codex`)
    const gameTraits = genTraits.get(c.slug)
    if ((c.tree || c.traitsFrom) && !gameTraits) {
      throw new Error(`content/codex/generated/traits/${c.slug}.json 不存在——跑一次 pnpm export:codex`)
    }
    return { ...c, gen, gameTraits }
  })

export const charBySlug = (slug: string) => allChars.find((c) => c.slug === slug)

/** 图鉴「人物」页签的三组：传奇领主 / 传奇英雄（远征同伴）/ 通用领主与英雄 */
export const charGroups = (['legendary-lord', 'legendary-hero', 'generic'] as const).map((id) => ({
  id,
  items: allChars.filter((c) => (id === 'generic' ? c.rank === 'lord' || c.rank === 'hero' : c.rank === id)),
}))

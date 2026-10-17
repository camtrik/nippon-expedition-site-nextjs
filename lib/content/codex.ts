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
  type Bi,
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

/** 页面上一行数值：v 已经是最终显示值（DB 数值已代入） */
export type StatRow = { k: Bi; v: string | Bi; n?: Bi }
export type Unit = CodexUnitData & {
  gen: GenUnitData
  groupName: (typeof homeUnits.groups)[number]['name']
  cost: { recruit: number; upkeep: number }
  statRows: StatRow[]
}
export type Char = CodexCharData & { gen?: GenTreeData; gameTraits?: GenTraitsData }

// ---- 兵种数值：手写的标签 + DB 的数 --------------------------------------------

/** 这些标签对应 DB 数值。写成手抄数字（v）直接报错，除非写明 manual 原因——
 *  手抄的数随平衡改动过期，1.1.1 的改动就一条都没同步过来。 */
const STAT_BY_LABEL: Record<string, string> = {
  近战攻击: 'melee_attack',
  近战防御: 'melee_defence',
  '武器威力（基础／破甲）': 'melee_damage',
  '近战武器威力（基础／破甲）': 'melee_damage',
  对大型单位加成: 'bonus_v_large',
  对步兵加成: 'bonus_v_infantry',
  近战攻击间隔: 'melee_interval',
  冲锋加成: 'charge_bonus',
  '远程武器威力（基础／破甲）': 'missile_damage',
  远程对大型加成: 'missile_bonus_v_large',
  射程: 'range',
  弹药: 'ammo',
  装填时间: 'reload',
  护甲: 'armour',
  领导力: 'leadership',
  速度: 'speed',
  单模型生命值: 'hp',
  人数: 'num_men',
  法术抗性: 'resist_magic',
  远程抗性: 'resist_missile',
  物理抗性: 'resist_physical',
  火焰抗性: 'resist_flame',
}

/** 为 0 时 DB 那边不输出，页面上整行隐藏（雷刃旗本 1.1.1 去掉对大型加成就是这样） */
const OPTIONAL_STATS = new Set([
  'bonus_v_large', 'bonus_v_infantry', 'missile_bonus_v_large',
  'resist_magic', 'resist_missile', 'resist_physical', 'resist_flame', 'resist_all',
])

type Stats = GenUnitData['stats']

function statNum(s: Stats, key: string, where: string): number {
  const x = s[key]
  if (typeof x !== 'number') throw new Error(`${where}：DB 数值里没有 ${key}——重跑 mod 仓库的 build_site_vanilla_export.py 和 pnpm export:codex`)
  return x
}

function statPair(s: Stats, key: string, where: string): string {
  const x = s[key]
  if (!Array.isArray(x)) throw new Error(`${where}：DB 数值里没有 ${key}`)
  return `${x[0]}／${x[1]}`
}

function statCell(stat: string, s: Stats, where: string): string | Bi | null {
  if (OPTIONAL_STATS.has(stat) && s[stat] === undefined) return null
  switch (stat) {
    case 'melee_damage':
    case 'missile_damage':
      return statPair(s, stat, where)
    case 'melee_interval': {
      const x = statNum(s, stat, where).toFixed(1)
      return { zh: `${x} 秒`, en: `${x} seconds` }
    }
    case 'reload': {
      const x = statNum(s, stat, where)
      return { zh: `${x} 秒`, en: `${x} seconds` }
    }
    case 'missile_bonus_v_large':
      return `+${statNum(s, stat, where)}`
    case 'speed_fly': {
      const g = statNum(s, 'speed', where)
      const f = statNum(s, 'fly_speed', where)
      return { zh: `${g}（地面）／${f}（飞行）`, en: `${g} (ground) / ${f} (flying)` }
    }
    case 'hp_artillery': {
      const e = statNum(s, 'engine_hp', where)
      const c = statNum(s, 'crew_hp', where)
      return { zh: `炮体 ${e}／乘员 ${c}`, en: `Gun ${e} / crew ${c}` }
    }
    default:
      return stat.startsWith('resist_') ? `${statNum(s, stat, where)}%` : String(statNum(s, stat, where))
  }
}

/** 说明里的 {key} 换成 DB 数值。另有几个派生值：
 *  {hp_total} 单模型生命值 × 人数；{melee_total} / {missile_total} 基础 + 破甲；
 *  {missile_total_vl} 远程合计 + 远程对大型加成（对大型单发伤害） */
function fillTokens(text: string, s: Stats, where: string): string {
  const sum = (key: string) => {
    const x = s[key]
    if (!Array.isArray(x)) throw new Error(`${where}：DB 数值里没有 ${key}`)
    return x[0] + x[1]
  }
  const derived: Record<string, () => number> = {
    hp_total: () => statNum(s, 'hp', where) * statNum(s, 'num_men', where),
    melee_total: () => sum('melee_damage'),
    missile_total: () => sum('missile_damage'),
    missile_total_vl: () => sum('missile_damage') + statNum(s, 'missile_bonus_v_large', where),
  }
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(derived[key] ? derived[key]() : statNum(s, key, where)))
}

function resolveStats(u: CodexUnitData, gen: GenUnitData): StatRow[] {
  const where = `content/codex/units/${u.slug}.json`
  const fill = (b?: Bi) => b && { zh: fillTokens(b.zh, gen.stats, where), en: fillTokens(b.en, gen.stats, where) }
  const rows: StatRow[] = []
  for (const r of u.stats) {
    if (r.stat) {
      const v = statCell(r.stat, gen.stats, where)
      if (v !== null) rows.push({ k: r.k, v, n: fill(r.n) })
      continue
    }
    const mapped = STAT_BY_LABEL[r.k.zh]
    if (mapped && !r.manual) {
      throw new Error(`${where}：「${r.k.zh}」是 DB 数值，写 "stat": "${mapped}"，不要手抄数字（手抄的会随平衡改动过期）`)
    }
    rows.push({ k: r.k, v: r.v!, n: fill(r.n) })
  }
  return rows
}

// ---- 兵种 ----------------------------------------------------------------------

export const unitGroups = homeUnits.groups.map((g) => ({
  name: g.name,
  items: g.items.map((item): Unit => {
    const u = unitFiles.get(item.slug)
    if (!u) throw new Error(`content/home/units.json 列了 ${item.slug}，content/codex/units/ 里没有这个兵种`)
    const gen = genUnits.get(item.slug)
    if (!gen) throw new Error(`content/codex/generated/units/${item.slug}.json 不存在——跑一次 pnpm export:codex`)
    const where = `content/codex/generated/units/${item.slug}.json`
    return {
      ...u,
      gen,
      groupName: g.name,
      cost: { recruit: statNum(gen.stats, 'recruit_cost', where), upkeep: statNum(gen.stats, 'upkeep_cost', where) },
      statRows: resolveStats(u, gen),
    }
  }),
}))

export const allUnits = unitGroups.flatMap((g) => g.items)

/** 图鉴索引按兵种类型分组（近战 / 远程 / 其他），组内按招募费从低到高（同价沿用简介页顺序）。
 *  简介页兵牌仍按 unitGroups，那边的顺序直接写在 content/home/units.json 里。 */
const recruitCost = (u: Unit) => u.cost.recruit
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

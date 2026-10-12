// 从 data/vanilla 生成图鉴页要的技能、部队属性与技能树，图标挑进 assets/icons/。
//
//   pnpm export:codex           生成并写盘
//   pnpm export:codex --check   只比对，产物过期就退出码 1（validate-content 也会跑这一步）
//
// 为什么要这一步而不是页面直接读 data/vanilla：那边的图标是整目录导出的（四千多张），
// 动态 import 会把整个目录打进构建产物；vanilla-catalog.json 也有 16MB。这里只挑页面
// 真正用到的条目和图，文本先洗干净（[[img:]]、[[col:]] 这类游戏富文本标记、字面的 \n）。
//
// 读：data/vanilla/{vanilla-assets.json, units/, skills/}
//     content/codex/units/*.json   取 unit key 与站点 slug 的对应
//     content/codex/chars/*.json   取技能树要列哪几行（tree.branches）
// 写：content/codex/generated/units/<slug>.json、generated/trees/<slug>.json
//     assets/icons/<DB key>.png    整个目录是生成物，每次重写
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { CodexChar, CodexUnit, type GenAbilityData, type GenNodeData } from '../lib/content/schema'

const ROOT = join(__dirname, '..')
const VANILLA = join(ROOT, 'data/vanilla')
const GEN = join(ROOT, 'content/codex/generated')
const ICONS = join(ROOT, 'assets/icons')
const CHECK = process.argv.includes('--check')

type Bi = { zh: string; en: string }
type RawBi = { zh: string | null; en: string | null } | null
type RawIcon = { source: 'vanilla' | 'npex'; file: string } | null
type Asset = {
  kind: string
  source: 'vanilla' | 'npex'
  name: RawBi
  desc: RawBi
  icon: RawIcon
  unlocked_at_rank?: string | null
  level_ranks?: Record<string, number> | null
  effects?: { level: number | null; text: RawBi }[]
}
type Node = {
  node: string
  skill: string | null
  tier: number
  indent: number
  points_on_creation: string | null
  required_num_parents: string | null
  visible_in_ui: boolean
  parents: { node: string }[]
}

const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'))
const assets: Record<string, Asset> = readJson(join(VANILLA, 'vanilla-assets.json')).assets

// ---- 文本 ----------------------------------------------------------------------

/** 洗掉游戏富文本标记。[[img:…]][[/img]] 整个去掉；[[col:…]] / [[b]] 只去标签留字；
    字面的 \n 是行尾——中文直接接上，英文补一个空格。 */
function plain(s: string | null | undefined, lang: 'zh' | 'en'): string {
  if (!s) return ''
  return s
    .replace(/\[\[img:[^\]]*\]\]\[\[\/img\]\]/g, '')
    .replace(/\[\[\/?[a-z]+(:[^\]]*)?\]\]/g, '')
    .split('\\n')
    .map((x) => x.trim())
    .filter(Boolean)
    .join(lang === 'zh' ? '' : ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function bi(raw: RawBi): Bi | null {
  if (!raw) return null
  const zh = plain(raw.zh, 'zh')
  const en = plain(raw.en, 'en')
  if (!zh && !en) return null
  // 缺一边就拿另一边顶上，页面上不能出现空串
  return { zh: zh || en, en: en || zh }
}

const nameOf = (key: string): Bi => bi(assets[key]?.name ?? null) ?? { zh: key, en: key }

// ---- 图标 ----------------------------------------------------------------------

const icons = new Map<string, string>() // assets/icons 下的文件名 -> 源文件

/** npex 图标的 file 是相对 design/source 写的（指向快照），原版和新复制的在 data/vanilla 下 */
function iconFor(key: string): string | null {
  const ic = assets[key]?.icon
  if (!ic) return null
  const src = ic.file.startsWith('icons/') ? join(VANILLA, ic.file) : join(ROOT, 'design/source', ic.file)
  if (!existsSync(src)) throw new Error(`${key} 的图标不存在：${src}`)
  const name = `${key}.png`
  icons.set(name, src)
  return name
}

// ---- 兵种 ----------------------------------------------------------------------

const vanillaUnits = new Map<string, { abilities: { ref: string }[]; attributes_from_db: { ref: string }[] }>()
for (const f of readdirSync(join(VANILLA, 'units'))) {
  const d = readJson(join(VANILLA, 'units', f))
  vanillaUnits.set(d.unit, d)
}

function ability(key: string): GenAbilityData {
  const a = assets[key]
  if (!a) throw new Error(`事实表里没有 ${key}`)
  return { key, source: a.source, name: nameOf(key), desc: bi(a.desc), icon: iconFor(key) }
}

const outputs = new Map<string, string>() // 相对 ROOT 的路径 -> 内容

for (const f of readdirSync(join(ROOT, 'content/codex/units')).sort()) {
  const u = CodexUnit.parse(readJson(join(ROOT, 'content/codex/units', f)))
  const v = vanillaUnits.get(u.unit)
  if (!v) throw new Error(`content/codex/units/${f}：data/vanilla/units 里没有 ${u.unit}`)
  const gen = {
    _comment: '生成物，别手改。scripts/export-codex.ts 从 data/vanilla/units 与 vanilla-assets.json 生成。',
    unit: u.unit,
    abilities: v.abilities.map((a) => ability(a.ref)),
    attrs: v.attributes_from_db.map((a) => ability(a.ref)),
  }
  outputs.set(`content/codex/generated/units/${u.slug}.json`, JSON.stringify(gen, null, 2) + '\n')
}

// ---- 技能树 --------------------------------------------------------------------

/** 第一级的等级门槛。character_skill_level_details 优先，没有才看 character_skills 那一列；
    两者都是 0 起算——表里的 7 在游戏里显示为角色等级 8（见 data/vanilla/README.md「等级门槛」）。 */
function rankOf(skill: string): number {
  const a = assets[skill]
  const r = a?.level_ranks?.['1'] ?? Number(a?.unlocked_at_rank ?? 0)
  return r > 0 ? r + 1 : 0
}

/** 「登峰造极」这种 100 级的只留首尾两级，页面上写成 1 级 … 100 级 */
const MAX_LEVELS = 4

function joinNames(names: Bi[]): Bi {
  return { zh: names.map((n) => n.zh).join('、'), en: names.map((n) => n.en).join(', ') }
}

for (const f of readdirSync(join(ROOT, 'content/codex/chars')).sort()) {
  const c = CodexChar.parse(readJson(join(ROOT, 'content/codex/chars', f)))
  if (!c.tree) continue
  const nodes: Node[] = readJson(join(VANILLA, 'skills', `${c.tree.subject}.json`)).nodes
  const byNode = new Map(nodes.map((n) => [n.node, n]))
  const skillName = (nodeKey: string) => {
    const n = byNode.get(nodeKey)
    return n?.skill ? nameOf(n.skill) : { zh: nodeKey, en: nodeKey }
  }

  const branches = c.tree.branches.map((b) => {
    const row = nodes
      .filter((n) => n.visible_in_ui && n.indent === b.indent && n.skill)
      .filter((n) => b.only !== 'npex' || assets[n.skill!]?.source === 'npex')
      .sort((x, y) => x.tier - y.tier)
    return {
      indent: b.indent,
      nodes: row.map((n): GenNodeData => {
        const skill = n.skill!
        const a = assets[skill]
        if (!a) throw new Error(`${c.tree!.subject}：事实表里没有 ${skill}`)

        const byLevel = new Map<number, Bi[]>()
        for (const e of a.effects ?? []) {
          const t = bi(e.text)
          if (!t) continue // 隐藏管线效果，游戏里也不显示
          const lv = e.level ?? 1
          byLevel.set(lv, [...(byLevel.get(lv) ?? []), t])
        }
        let levels = [...byLevel.entries()].sort((x, y) => x[0] - y[0]).map(([level, lines]) => ({ level, lines }))
        if (levels.length > MAX_LEVELS) levels = [levels[0], levels[levels.length - 1]]

        const parents = n.parents.map((p) => p.node).filter((p) => byNode.get(p)?.visible_in_ui)
        const need = Number(n.required_num_parents) || parents.length
        const rank = rankOf(skill)
        const bits: Bi[] = []
        if (Number(n.points_on_creation) > 0) bits.push({ zh: '开局自带', en: 'Granted at start' })
        if (rank) bits.push({ zh: `角色等级 ${rank} 解锁`, en: `Unlocks at rank ${rank}` })
        if (parents.length) {
          const names = joinNames(parents.map(skillName))
          bits.push({ zh: `前置：${names.zh}`, en: `Requires ${names.en}` })
        }

        return {
          key: skill,
          name: nameOf(skill),
          desc: bi(a.desc),
          levels,
          icon: iconFor(skill),
          reuse: a.source !== 'npex',
          unlock: bits.length ? { zh: bits.map((x) => x.zh).join(' · '), en: bits.map((x) => x.en).join(' · ') } : null,
          hub: parents.length > 1 ? { zh: `需 ${need}/${parents.length}`, en: `${need} of ${parents.length}` } : null,
        }
      }),
    }
  })

  const gen = {
    _comment: '生成物，别手改。scripts/export-codex.ts 按 content/codex/chars 里的 tree.branches 从 data/vanilla/skills 生成。',
    subject: c.tree.subject,
    branches,
  }
  outputs.set(`content/codex/generated/trees/${c.slug}.json`, JSON.stringify(gen, null, 2) + '\n')
}

// ---- 写盘 / 比对 ---------------------------------------------------------------

const stale: string[] = []
for (const [rel, text] of outputs) {
  const p = join(ROOT, rel)
  if (CHECK) {
    if (!existsSync(p) || readFileSync(p, 'utf8') !== text) stale.push(rel)
  } else {
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, text)
  }
}
for (const sub of ['units', 'trees']) {
  const dir = join(GEN, sub)
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir)) {
    const rel = `content/codex/generated/${sub}/${f}`
    if (outputs.has(rel)) continue
    if (CHECK) stale.push(`${rel}（多余）`)
    else rmSync(join(dir, f))
  }
}

if (CHECK) {
  const have = existsSync(ICONS) ? new Set(readdirSync(ICONS)) : new Set<string>()
  for (const name of icons.keys()) {
    if (!have.has(name) || !readFileSync(join(ICONS, name)).equals(readFileSync(icons.get(name)!))) stale.push(`assets/icons/${name}`)
  }
  for (const name of have) if (!icons.has(name)) stale.push(`assets/icons/${name}（多余）`)
  if (stale.length) {
    console.error('✗ 图鉴生成物过期，跑一次 pnpm export:codex：\n' + stale.map((s) => '  · ' + s).join('\n'))
    process.exit(1)
  }
  console.log(`✓ 图鉴生成物是最新的（${outputs.size} 份 JSON、${icons.size} 张图标）`)
} else {
  rmSync(ICONS, { recursive: true, force: true })
  mkdirSync(ICONS, { recursive: true })
  for (const [name, src] of icons) copyFileSync(src, join(ICONS, name))
  console.log(`已写入 ${outputs.size} 份 JSON、${icons.size} 张图标`)
}

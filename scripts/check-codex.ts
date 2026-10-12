// 图鉴手写内容的交叉校验：schema 之外，还要对得上 data/vanilla 与 assets/。
//   pnpm exec tsx scripts/check-codex.ts [slug…]
// 这些错都不会让页面报错——effects 挂错 key 就是静默不显示，looks 写错就是一张裂图——
// 所以单独查。scripts/validate-content.ts 也会跑同一套检查。
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { CodexChar, CodexUnit } from '../lib/content/schema'

const ROOT = join(__dirname, '..')
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'))

const vanillaUnits = new Map<string, { abilities: { ref: string }[] }>()
for (const f of readdirSync(join(ROOT, 'data/vanilla/units'))) {
  const d = read(`data/vanilla/units/${f}`)
  vanillaUnits.set(d.unit, d)
}

export function checkCodex(only: string[] = []): string[] {
  const problems: string[] = []
  const want = (slug: string) => !only.length || only.includes(slug)

  for (const f of readdirSync(join(ROOT, 'content/codex/units'))) {
    const path = `content/codex/units/${f}`
    const parsed = CodexUnit.safeParse(read(path))
    if (!parsed.success) {
      problems.push(`${path}: ${parsed.error.message}`)
      continue
    }
    const u = parsed.data
    if (!want(u.slug)) continue
    if (`${u.slug}.json` !== f) problems.push(`${path}: 文件名和 slug 对不上`)
    if (!existsSync(join(ROOT, `assets/units/${u.slug}.webp`))) problems.push(`${path}: 没有兵牌 assets/units/${u.slug}.webp`)
    const v = vanillaUnits.get(u.unit)
    if (!v) {
      problems.push(`${path}: data/vanilla/units 里没有 unit=${u.unit}`)
      continue
    }
    const keys = new Set(v.abilities.map((a) => a.ref))
    for (const k of Object.keys(u.effects)) {
      if (!keys.has(k)) problems.push(`${path}: effects.${k} 不是这个兵种的技能（有：${[...keys].join(', ')}）`)
    }
  }

  for (const f of readdirSync(join(ROOT, 'content/codex/chars'))) {
    const path = `content/codex/chars/${f}`
    const parsed = CodexChar.safeParse(read(path))
    if (!parsed.success) {
      problems.push(`${path}: ${parsed.error.message}`)
      continue
    }
    const c = parsed.data
    if (!want(c.slug)) continue
    if (`${c.slug}.json` !== f) problems.push(`${path}: 文件名和 slug 对不上`)
    for (const look of c.looks) {
      for (const p of [`assets/chars/${look.key}.webp`, `assets/chars/full/${look.key}.webp`]) {
        if (!existsSync(join(ROOT, p))) problems.push(`${path}: 没有 ${p}`)
      }
    }
    if (c.looks.length > 1 && c.looks.some((l) => !l.label)) problems.push(`${path}: 多套外观时每套都要有 label`)
    if (c.tree) {
      const tp = `data/vanilla/skills/${c.tree.subject}.json`
      if (!existsSync(join(ROOT, tp))) {
        problems.push(`${path}: 没有 ${tp}`)
      } else {
        const indents = new Set(
          (read(tp).nodes as { indent: number; visible_in_ui: boolean }[])
            .filter((n) => n.visible_in_ui)
            .map((n) => n.indent),
        )
        for (const b of c.tree.branches) {
          if (!indents.has(b.indent)) problems.push(`${path}: 技能树第 ${b.indent} 行在 ${tp} 里没有可见节点`)
        }
      }
    }
  }
  return problems
}

if (require.main === module) {
  const problems = checkCodex(process.argv.slice(2))
  if (problems.length) {
    console.error('✗ 图鉴校验没过：\n' + problems.map((p) => '  · ' + p).join('\n'))
    process.exit(1)
  }
  console.log('✓ 图鉴校验通过')
}

// 单独校验 content/ 和 messages/ 的形状，不用等整个 next build。
// 构建时的护栏是 loader 本身——页面 await 它，schema 不过就构建失败；这个脚本只是快一点。
import { faq } from '../lib/content/faq'
import { hero, overview, lords, companions, units, buildings, victory, relocations, ai, compat, credits } from '../lib/content/home'
import { latestReleased, mainReleases, submodReleases } from '../lib/content/releases'
import { inline } from '../lib/content/inline'
import { TAGS } from '../lib/content/schema'
import { routing } from '../i18n/routing'
import { pick } from '../lib/i18n'
import zh from '../messages/zh.json'
import en from '../messages/en.json'

const problems: string[] = []

// 把每一个双语字符串都过一遍行内解析器——JSON 里混进块级 Markdown 要在这里就炸，
// 而不是等某个页面正好渲染到那一条。
function sweep(node: unknown, path: string) {
  if (typeof node === 'string') return
  if (Array.isArray(node)) return node.forEach((v, i) => sweep(v, `${path}[${i}]`))
  if (!node || typeof node !== 'object') return
  const o = node as Record<string, unknown>
  const keys = Object.keys(o)
  if (keys.length === 2 && keys.includes('zh') && keys.includes('en') &&
      typeof o.zh === 'string' && typeof o.en === 'string') {
    for (const locale of routing.locales) {
      try { inline(o[locale] as string) } catch (e) { problems.push(`${path}.${locale}: ${(e as Error).message}`) }
    }
    return
  }
  for (const [k, v] of Object.entries(o)) if (k !== '_comment') sweep(v, `${path}.${k}`)
}

const home = { hero, overview, lords, companions, units, buildings, victory, relocations, ai, compat, credits }
sweep(home, 'home')
sweep(faq, 'faq')

// FAQ 的 slug 是永久公开契约（#q-<slug>），重复就等于有一条永远打不开
const slugs = faq.sections.flatMap((s) => s.items.map((i) => i.slug))
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i)
if (dupes.length) problems.push(`faq: slug 重复 ${[...new Set(dupes)].join(', ')}`)

// ---- messages/ ---------------------------------------------------------------
// t() 的键名类型以 zh.json 为准（global.ts），所以中文缺键是编译错误；
// 英文那份 TS 管不到，这里比对两边的叶子路径，少一条、多一条都报。

function leaves(node: unknown, path = ''): string[] {
  if (typeof node === 'string') return [path]
  if (!node || typeof node !== 'object') { problems.push(`messages: ${path} 不是字符串也不是对象`); return [] }
  return Object.entries(node).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}
const zhKeys = new Set(leaves(zh))
const enKeys = new Set(leaves(en))
for (const k of zhKeys) if (!enKeys.has(k)) problems.push(`messages/en.json: 缺 ${k}`)
for (const k of enKeys) if (!zhKeys.has(k)) problems.push(`messages/en.json: 多出 ${k}（zh.json 里没有）`)

// 每个可用的 tag 都要有显示名，否则页面上会露出 raw key
for (const tag of TAGS) {
  if (!zhKeys.has(`tagLabels.${tag}`)) problems.push(`messages: tag "${tag}" 在 tagLabels 里没有`)
}

if (!latestReleased) problems.push('releases: 没有一条同时带 version 和 date 的本体条目，「最新版本」印章会是空的')

if (problems.length) {
  console.error('✗ content 校验没过：\n' + problems.map((p) => '  · ' + p).join('\n'))
  process.exit(1)
}

console.log('✓ content 校验通过')
console.log(`  home 11 个区块 · overview ${overview.plain.length} 条 + ${overview.packs.length} 张卡 + ${overview.requires.length} 条收尾`)
console.log(`  faq ${faq.sections.length} 类 ${slugs.length} 问`)
console.log(`  releases 本体 ${mainReleases.length} 条 / 子 mod ${submodReleases.length} 条`)
console.log(`  messages ${zhKeys.size} 条，zh / en 键集合一致`)
console.log(`  最新版本 v${latestReleased!.version} · ${latestReleased!.date}`)
console.log(`  本体排序 ${mainReleases.map((r) => 'v' + r.version).join(' → ')}`)
console.log(`  子 mod 排序 ${submodReleases.map((r) => pick({ zh: r.title.zh ?? r.source, en: r.title.en ?? r.source }, 'zh') + '(' + r.sortDate + ')').join(' → ')}`)

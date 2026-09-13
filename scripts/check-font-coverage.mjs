// 缺字护栏。旧站是 sitegen/fonts.py 的 check_font_coverage()，扫最终 HTML；
// 新站没有「一次渲染全部」那一步，改成扫内容源——content/ 和 messages/ 下所有 JSON 字符串和
// releases 正文。少一个字就构建失败并列出来。
//
// 为什么不能省：next/font 不提供这个。缺字不报错就静默回退到系统字体，
// 同一句话里出现两套字形——页面不报错，只有肉眼才看得出来。
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const COVERAGE = 'assets/fonts/coverage.txt'
const ROOTS = ['content', 'messages']

const covered = new Set([...readFileSync(COVERAGE, 'utf8')])

function walkFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walkFiles(p) : [p]
  })
}

/** JSON 里只取会渲染出去的字符串；.md 整份文本都算。
    ⚠️ `_comment` 是写给维护者看的，永远不渲染——把它算进来只会让子集白白变大。 */
function textsIn(path) {
  const raw = readFileSync(path, 'utf8')
  if (!path.endsWith('.json')) return [raw]
  const out = []
  const visit = (v) => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(visit)
    else if (v && typeof v === 'object') {
      for (const [k, child] of Object.entries(v)) if (k !== '_comment') visit(child)
    }
  }
  visit(JSON.parse(raw))
  return out
}

const missing = new Map() // 字 → 出现在哪些文件
for (const root of ROOTS) {
  for (const path of walkFiles(root)) {
    if (!/\.(json|md)$/.test(path)) continue
    for (const text of textsIn(path)) {
      for (const ch of text) {
        const cp = ch.codePointAt(0)
        // ASCII 由 Sofia Sans 覆盖；U+FE00–FE0F 是变体选择符（⚠️ 的那个），不是字形
        if (cp <= 0x7f || (cp >= 0xfe00 && cp <= 0xfe0f)) continue
        if (covered.has(ch)) continue
        if (!missing.has(ch)) missing.set(ch, new Set())
        missing.get(ch).add(path)
      }
    }
  }
}

if (missing.size) {
  console.error(`✗ 字体子集缺 ${missing.size} 个字——这些字会静默回退到系统字体，`)
  console.error('  同一句话里出现两套字形。补子集：')
  console.error('    pip install fonttools brotli && python3 ../nippon-expedition-site/scripts/subset_fonts.py')
  console.error('  然后把新的 woff2 和 coverage.txt 拷进 assets/fonts/。\n')
  for (const [ch, files] of [...missing].sort()) {
    console.error(`  ${ch}  U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}  ${[...files].join(', ')}`)
  }
  process.exit(1)
}

console.log(`✓ 字体覆盖检查通过（子集 ${covered.size} 字）`)

// 国内镜像导出后的整理，只在 .github/workflows/cn-mirror.yml 里跑。
//
// 中文不带前缀（i18n/routing.ts 的 as-needed）：页面里的中文链接写的是 /codex/，
// 但导出把中文页放在 out/zh/ 下——Vercel 上是 proxy.ts 把 /codex 改写到 /zh/codex，
// 静态托管没有中间件，所以把 out/zh/ 整个挪到根目录。
import { cpSync, existsSync, rmSync } from 'node:fs'

if (!existsSync('out/zh')) throw new Error('out/zh 不存在——先跑 STATIC_EXPORT=1 pnpm build')
cpSync('out/zh', 'out', { recursive: true })
rmSync('out/zh', { recursive: true })
console.log('[cn-mirror] out/zh → out/')

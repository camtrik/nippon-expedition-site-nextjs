// 兼容性页：content/compat.json 加上拓扑图的布局。
//
// 布局照设计稿的算法（design/远征尼朋官网.dc.html:2052 起，「React Flow 风格：左→右分层」）：
// 1240×992 的画布，中心是本体（圆）；右边三条泳道（兼容包接通 / 可直接共存 / 冲突）竖排，
// 左边是前置；兼容包作为中间一列，纵向对齐到它接通的那几个条目的平均高度。
// 设计稿在浏览器里现算、还能拖动节点；这里在构建时算好坐标，页面上零 JS——
// 缩放靠 CSS 容器查询单位，悬停高亮靠 :has()（见 styles/86-compat.css）。
import compatJson from '@/content/compat.json'
import { CompatPage, type CompatPageData } from './schema'

export const compatPage: CompatPageData = (() => {
  try {
    return CompatPage.parse(compatJson)
  } catch (e) {
    throw new Error(`content/compat.json 不合 schema：\n${(e as Error).message}`)
  }
})()

export const STAGE = { w: 1240, h: 992 }
export const HUB = { x: 424, y: 500, r: 82 }
export const NODE = { w: 244, h: 54, exp: 322 }
export const REQ = { w: 196, exp: 274 }
export const VIA = { w: 196, exp: 286 }
export const LANG = { w: 178, h: 38, exp: 280 }
const PITCH = 62
const LANE_GAP = 46
const COL_REQ = 154
const COL_VIA = 710
const COL_MOD = 1030

type Pt = { x: number; y: number; nx: number }
type Group = CompatPageData['nodes'][number]['group']

export type Placed = { key: string; x: number; y: number; w: number; exp: number; kin: string[] }
export type Edge = { d: string; kind: 'flow' | 'ok' | 'req' | 'conflict' | 'lang'; group: Group | 'lang'; kin: string[]; mid?: { x: number; y: number; dx: number; dy: number } }
export type Lane = { group: Group | 'via'; x: number; y: number; w: number; h: number }

function side(b: { x: number; y: number; w: number }, dir: 1 | -1): Pt {
  return { x: b.x + (dir * b.w) / 2, y: b.y, nx: dir }
}

/** 从圆心朝某点方向打到圆周上 */
function rad(toward: { x: number; y: number }): Pt {
  const dx = toward.x - HUB.x
  const dy = toward.y - HUB.y
  const l = Math.hypot(dx, dy) || 1
  return { x: HUB.x + (dx / l) * HUB.r, y: HUB.y + (dy / l) * HUB.r, nx: dx >= 0 ? 1 : -1 }
}

function curve(a: Pt, b: Pt) {
  const k = Math.max(52, Math.abs(b.x - a.x) * 0.46)
  const c1 = { x: a.x + a.nx * k, y: a.y }
  const c2 = { x: b.x + b.nx * k, y: b.y }
  const f = (n: number) => n.toFixed(1)
  const d = `M${f(a.x)} ${f(a.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(b.x)} ${f(b.y)}`
  // 中点与切线方向（冲突边上画一个 ×）
  const at = (t: number) => {
    const u = 1 - t
    return {
      x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
    }
  }
  const m = at(0.5)
  const p = at(0.54)
  const q = at(0.46)
  return { d, mid: { x: m.x, y: m.y, dx: p.x - q.x, dy: p.y - q.y } }
}

export function layout(data: CompatPageData) {
  const byGroup = (g: Group) => data.nodes.filter((n) => n.group === g)
  const y: Record<string, number> = {}
  const lanes: Lane[] = []

  let cur = 86
  for (const g of ['full', 'ok', 'conflict'] as const) {
    const list = byGroup(g)
    if (!list.length) continue
    const top = cur
    list.forEach((n, i) => (y[n.key] = cur + i * PITCH))
    const last = cur + (list.length - 1) * PITCH
    lanes.push({ group: g, x: COL_MOD - NODE.w / 2 - 16, y: top - NODE.h / 2 - 14, w: NODE.w + 32, h: last - top + NODE.h + 28 })
    cur = last + NODE.h + LANE_GAP
  }
  const req = byGroup('required')
  req.forEach((n, i) => (y[n.key] = HUB.y + (i - (req.length - 1) / 2) * 132))
  if (req.length) {
    const t = y[req[0].key]
    const l = y[req[req.length - 1].key]
    lanes.push({ group: 'required', x: COL_REQ - REQ.w / 2 - 16, y: t - NODE.h / 2 - 14, w: REQ.w + 32, h: l - t + NODE.h + 28 })
  }

  // 兼容包：同一个包接通多个条目时只画一个，纵向放在它们的平均高度，再往下推开免得叠住
  const viaKids = new Map<string, string[]>()
  const viaInfo = new Map<string, NonNullable<CompatPageData['nodes'][number]['via']>>()
  for (const n of data.nodes) {
    if (!n.via) continue
    viaKids.set(n.via.url, [...(viaKids.get(n.via.url) ?? []), n.key])
    viaInfo.set(n.via.url, n.via)
  }
  const viaKey = new Map([...viaKids.keys()].map((u, i) => [u, `via-${i}`]))
  const viaY = new Map(
    [...viaKids].map(([u, kids]) => [u, kids.reduce((s, k) => s + (y[k] ?? HUB.y), 0) / kids.length]),
  )
  const sorted = [...viaY.keys()].sort((a, b) => viaY.get(a)! - viaY.get(b)!)
  for (let i = 1; i < sorted.length; i++) {
    const need = viaY.get(sorted[i - 1])! + NODE.h + 6
    if (viaY.get(sorted[i])! < need) viaY.set(sorted[i], need)
  }
  if (sorted.length) {
    const t = viaY.get(sorted[0])!
    const l = viaY.get(sorted[sorted.length - 1])!
    lanes.push({ group: 'via', x: COL_VIA - VIA.w / 2 - 16, y: t - NODE.h / 2 - 14, w: VIA.w + 32, h: l - t + NODE.h + 28 })
  }

  const edges: Edge[] = []
  const vias = [...viaKids].map(([u, kids]) => {
    const key = viaKey.get(u)!
    const box = { key, x: COL_VIA, y: viaY.get(u)!, w: VIA.w, exp: VIA.exp, kin: kids }
    // 本体 → 兼容包这条边，悬停它接通的任何一个条目时也要亮着
    edges.push({ ...curve(rad(box), side(box, -1)), kind: 'flow', group: 'full', kin: [key, ...kids] })
    return { ...box, info: viaInfo.get(u)!, kids }
  })
  const viaBox = new Map(vias.map((v) => [v.info.url, v]))

  const nodes = data.nodes.map((n) => {
    const isReq = n.group === 'required'
    const w = isReq ? REQ.w : NODE.w
    const box = { key: n.key, x: isReq ? COL_REQ : COL_MOD, y: y[n.key], w, exp: isReq ? REQ.exp : NODE.exp, kin: [] as string[] }
    if (isReq) {
      edges.push({ ...curve(side(box, 1), rad(box)), kind: 'req', group: 'required', kin: [n.key] })
    } else if (n.group === 'conflict') {
      edges.push({ ...curve(rad(box), side(box, -1)), kind: 'conflict', group: 'conflict', kin: [n.key] })
    } else if (n.via && viaBox.has(n.via.url)) {
      const v = viaBox.get(n.via.url)!
      box.kin.push(v.key)
      edges.push({ ...curve(side(v, 1), side(box, -1)), kind: 'flow', group: 'full', kin: [n.key, v.key] })
    } else {
      edges.push({ ...curve(rad(box), side(box, -1)), kind: n.group === 'ok' ? 'ok' : 'flow', group: n.group, kin: [n.key] })
    }
    return { ...box, data: n }
  })

  // 语言包：软前置，竖着挂在它本地化的那个节点下面
  const langs = data.langs.map((l) => {
    const isHub = l.of === 'hub'
    const anchor = isHub ? HUB.y : (y[l.of] ?? HUB.y)
    const x = isHub ? HUB.x : COL_REQ
    const top = isHub ? HUB.y + HUB.r : anchor + NODE.h / 2
    const ly = isHub ? HUB.y + 142 : anchor + 70
    const key = `lang-${l.key}`
    const kin = isHub ? [] : [l.of]
    edges.push({ d: `M${x.toFixed(1)} ${top.toFixed(1)} L${x.toFixed(1)} ${(ly - LANG.h / 2).toFixed(1)}`, kind: 'lang', group: 'lang', kin: [key, ...kin] })
    return { key, x, y: ly, w: LANG.w, exp: LANG.exp, kin, data: l }
  })
  // 被挂语言包的节点也要认它这个亲戚
  for (const l of langs) for (const k of l.kin) nodes.find((n) => n.key === k)?.kin.push(l.key)

  return { lanes, vias, nodes, langs, edges }
}

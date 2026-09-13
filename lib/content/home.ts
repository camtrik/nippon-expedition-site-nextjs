// 简介页的内容。一个文件一个区块，文件名就是键名——照旧站 sitegen/content.py 的约定。
// 区块的显示顺序不在这里，在 app/[lang]/page.tsx 里（旧站是在模板里，一样的道理）。
//
// ⚠️ content/home/_about.json 只有一条 _comment，没有内容，所以不在这份清单里。
import heroJson from '@/content/home/hero.json'
import overviewJson from '@/content/home/overview.json'
import lordsJson from '@/content/home/lords.json'
import companionsJson from '@/content/home/companions.json'
import unitsJson from '@/content/home/units.json'
import buildingsJson from '@/content/home/buildings.json'
import victoryJson from '@/content/home/victory.json'
import relocationsJson from '@/content/home/relocations.json'
import aiJson from '@/content/home/ai.json'
import compatJson from '@/content/home/compat.json'
import creditsJson from '@/content/home/credits.json'

import {
  Ai,
  Buildings,
  Companions,
  Compat,
  Credits,
  Hero,
  Lords,
  Overview,
  Relocations,
  Units,
  Victory,
  type Bi,
  type OverviewPackData,
} from './schema'

/** 校验失败时把是哪个文件说清楚——不然 Zod 的路径是从 items[3] 开始的，找不着北。 */
function parse<T>(name: string, schema: { parse: (v: unknown) => T }, raw: unknown): T {
  try {
    return schema.parse(raw)
  } catch (e) {
    throw new Error(`content/home/${name}.json 不合 schema：\n${(e as Error).message}`)
  }
}

export const hero = parse('hero', Hero, heroJson.hero)
export const lords = parse('lords', Lords, lordsJson.lords)
export const companions = parse('companions', Companions, companionsJson.companions)
export const units = parse('units', Units, unitsJson.units)
export const buildings = parse('buildings', Buildings, buildingsJson.buildings)
export const victory = parse('victory', Victory, victoryJson.victory)
export const relocations = parse('relocations', Relocations, relocationsJson.relocations)
export const ai = parse('ai', Ai, aiJson.ai)
export const compat = parse('compat', Compat, compatJson.compat)
export const credits = parse('credits', Credits, creditsJson.credits)

const overviewRaw = parse('overview', Overview, overviewJson.overview)

/**
 * 设计稿把简介区块的 items[] 拆成三段渲染：普通条目、子 mod 卡片网格、收尾的前置需求说明。
 * 数据本身没变——这里只是按「有没有 url」把一个数组分成三份，分界点由数据顺序决定。
 */
function partition(items: readonly (OverviewPackData | Bi)[]) {
  const isPack = (x: OverviewPackData | Bi): x is OverviewPackData => 'url' in x
  const first = items.findIndex(isPack)
  if (first < 0) throw new Error('content/home/overview.json：一个带 url 的子 mod 条目都没有')
  const plain = items.slice(0, first) as Bi[]
  const packs = items.filter(isPack)
  const requires = items.slice(items.findLastIndex(isPack) + 1) as Bi[]
  return { plain, packs, requires }
}

export const overview = {
  title: overviewRaw.title,
  ...partition(overviewRaw.items),
}

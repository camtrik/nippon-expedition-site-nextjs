// 背景故事页的内容。胜利路线那一章不在这里，直接用 content/home/victory.json——
// 简介页的夜板和这里是同一份数据。
import loreJson from '@/content/lore.json'
import { Lore } from './schema'

export const lore = (() => {
  try {
    return Lore.parse(loreJson)
  } catch (e) {
    throw new Error(`content/lore.json 不合 schema：\n${(e as Error).message}`)
  }
})()

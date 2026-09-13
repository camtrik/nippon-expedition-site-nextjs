// content/ 的形状定义（ROADMAP 决定 11）。类型一律用 z.infer 推出来，不手写 type——
// 手写的 type 只活在编译期，运行时读进来的 JSON 少个字段它一无所知，页面上才变成 undefined。
import { z } from 'zod'

/** 中英同字段。⚠️ 不加 .min(1)：hero.note.zh 是有意留的空串。 */
export const Bilingual = z.object({ zh: z.string(), en: z.string() })

/**
 * content/ 里的对象一律 strict——多写一个键要当场报错，不然拼错的键会被静默丢掉，
 * 而「必填项缺失」的报错会指向错误的地方。`_comment` 是全局允许的例外（三个文件在用）。
 */
function obj<T extends z.ZodRawShape>(shape: T) {
  return z.strictObject({ _comment: z.string().optional(), ...shape })
}

const Slugged = obj({ slug: z.string(), name: Bilingual })

// ---- content/home/*.json ----------------------------------------------------

export const Hero = obj({
  eyebrow: Bilingual,
  wordmark: z.string(), // ⚠️ 不是双语：就一句 "NIPPON EXPEDITION"
  name: Bilingual,
  premise: Bilingual,
  note: Bilingual,
  crest_alt: Bilingual,
  art_alt: Bilingual,
})

/** 简介区块的条目是个判别联合：带 url 的是子 mod 卡片，不带的是普通条目。 */
export const OverviewPack = obj({
  url: z.string(),
  name: Bilingual,
  note: Bilingual,
  points: z.array(Bilingual).optional(),
})
export const Overview = obj({
  title: Bilingual,
  items: z.array(z.union([OverviewPack, Bilingual])),
})

/** 领主行：要么一个人（slug+name），要么一组人（people[]）。二选一，不能都没有。 */
export const LordItem = obj({
  rank: z.enum(['legendary', 'generic']),
  kind: Bilingual,
  body: Bilingual,
  slug: z.string().optional(),
  name: Bilingual.optional(),
  people: z.array(Slugged).optional(),
}).refine((v) => Boolean(v.people?.length) !== Boolean(v.slug && v.name), {
  message: '领主条目要么有 slug+name，要么有 people[]，不能都有也不能都没有',
})
export const Lords = obj({
  title: Bilingual,
  rows: z.array(obj({ side: z.enum(['left', 'right']), items: z.array(LordItem) })),
})

export const Companions = obj({
  title: Bilingual,
  lede: Bilingual,
  tiers_label: Bilingual,
  tiers: z.array(Bilingual),
  chapters_label: Bilingual,
  items: z.array(obj({ slug: z.string(), name: Bilingual, chapters: z.array(Bilingual) })),
  // ⚠️ 全站唯一一处「双语里包数组」——章节序号中文用壹贰叁肆、英文用 I II III IV。
  numerals: z.object({ zh: z.array(z.string()), en: z.array(z.string()) }),
  notes: z.array(Bilingual),
})

export const Units = obj({
  title: Bilingual,
  groups: z.array(obj({ name: Bilingual, items: z.array(Slugged) })),
})

export const Buildings = obj({
  title: Bilingual,
  items: z.array(obj({ name: Bilingual, body: Bilingual })),
})

/** tag / outcome 是设计稿要的，短期胜利的 tag 是站点自拟的编号，都允许缺。 */
const VictoryCard = obj({
  tag: z.string().optional(),
  kind: Bilingual,
  name: Bilingual,
  quote: Bilingual,
  goals: z.array(Bilingual),
  outcome: Bilingual.optional(),
})
export const Victory = obj({
  title: Bilingual,
  note: Bilingual.optional(),
  short: VictoryCard,
  routes: z.array(VictoryCard),
})

export const Relocations = obj({
  title: Bilingual,
  lede: Bilingual,
  head: obj({ lord: Bilingual, dest: Bilingual }),
  rows: z.array(obj({ lord: Bilingual, dest: Bilingual })),
})

// more / more_link / more_tail 是手工拆开的「句子—链接—句子」，别归一化成一个字符串。
export const Ai = obj({
  title: Bilingual,
  lede: Bilingual,
  items: z.array(Bilingual),
  more: Bilingual,
  more_link: obj({ url: z.string(), label: Bilingual }),
  more_tail: Bilingual,
})

export const Compat = obj({ title: Bilingual, items: z.array(Bilingual) })

export const Credits = obj({
  title: Bilingual,
  lede: Bilingual,
  items: z.array(obj({ url: z.string(), label: Bilingual })),
  tail: Bilingual,
})

// ---- content/faq.json -------------------------------------------------------

export const FaqItem = obj({
  slug: z.string(),
  status: z.enum(['updated', 'fixed']).optional(),
  version: z.string().optional(),
  question: Bilingual,
  answer: z.array(Bilingual), // 永远是数组，哪怕只有一段
  links: z.array(obj({ label: Bilingual, url: z.string() })).optional(),
}).refine((v) => !v.status || Boolean(v.version), {
  message: 'status 要配一个 version，徽章文案里有 {version} 占位',
})
export const Faq = obj({
  sections: z.array(obj({ slug: z.string(), title: Bilingual, items: z.array(FaqItem) })),
  tail: Bilingual,
})

// ---- content/releases/*.{zh,en}.md 的 front matter ---------------------------

export const RELEASE_TYPES = ['release', 'content', 'balance', 'hotfix'] as const
export const CHANNELS = ['main', 'submod'] as const
/** 更新记录能打的标签。每个标签在 messages/*.json 的 tagLabels 里都要有一条——键名对不上是编译错误。 */
export const TAGS = ['main', 'stronger-ai', 'nrs-compat', 'cathay-compat', 'yinyin-compat', 'wuh-compat'] as const
export type Tag = (typeof TAGS)[number]

export const FrontMatter = z
  .strictObject({
    // 1.0.0 有两个点，YAML 当字符串；但将来写 1.1 会变成 number，coerce 兜住
    version: z.coerce.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date 必须是 YYYY-MM-DD').optional(),
    title: z.string().optional(),
    channel: z.enum(CHANNELS).default('main'),
    url: z.string().optional(),
    type: z.enum(RELEASE_TYPES).optional(),
    tags: z.array(z.enum(TAGS)).default([]),
  })
  .refine((v) => Boolean(v.version) || Boolean(v.title), {
    message: 'front matter 需要 version，或者一个 title（不跟本体版本号走的条目）',
  })

export type Bi = z.infer<typeof Bilingual>
export type HeroData = z.infer<typeof Hero>
export type OverviewData = z.infer<typeof Overview>
export type OverviewPackData = z.infer<typeof OverviewPack>
export type LordsData = z.infer<typeof Lords>
export type LordItemData = z.infer<typeof LordItem>
export type CompanionsData = z.infer<typeof Companions>
export type UnitsData = z.infer<typeof Units>
export type BuildingsData = z.infer<typeof Buildings>
export type VictoryData = z.infer<typeof Victory>
export type RelocationsData = z.infer<typeof Relocations>
export type AiData = z.infer<typeof Ai>
export type CompatData = z.infer<typeof Compat>
export type CreditsData = z.infer<typeof Credits>
export type FaqData = z.infer<typeof Faq>
export type FaqItemData = z.infer<typeof FaqItem>
export type FrontMatterData = z.infer<typeof FrontMatter>

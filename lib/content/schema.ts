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
export const TAGS = [
  'main',
  'stronger-ai',
  'nrs-compat',
  'cathay-compat',
  'yinyin-compat',
  'wuh-compat',
  'techtree-compat',
  'wwd-compat',
] as const
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

// ---- content/codex/ ----------------------------------------------------------
//
// 图鉴（兵种页 / 人物页）。两类文件：
//   content/codex/{units,chars}/<slug>.json   手写，内容照 mod 仓库的设计书与 loc 整理
//   content/codex/generated/…                 scripts/export-codex.ts 从 data/vanilla 生成，别手改
// 手写的那份只放设计书里才有的东西（定位、招募、数值、说明文字）；技能、部队属性、
// 技能树这些游戏里真实存在的条目一律走生成，名字、描述、图标都是游戏原文。

/** 数值格：纯数字、「150／300」这类不分语言的写成字符串，带文字的写双语。 */
export const Cell = z.union([z.string(), Bilingual])

const KV = obj({ k: Bilingual, v: Bilingual })
/** 长文。一段就写一个双语对象，多段写成数组（loc 里用空行分段的那几条）；读进来一律是数组 */
const Paragraphs = z
  .union([Bilingual, z.array(Bilingual).min(1)])
  .transform((v) => (Array.isArray(v) ? v : [v]))
/** 设计书表格的一行。form 是「生效形态」那一列（全形态就不写）。 */
const Row = obj({ k: Bilingual, v: Bilingual, form: Bilingual.optional() })

export const UNIT_GROUPS = ['fleet', 'nippon', 'akatsuki'] as const

export const CodexUnit = obj({
  slug: z.string(),
  /** land_units key，生成那一侧按它去 data/vanilla/units 找技能与部队属性 */
  unit: z.string(),
  group: z.enum(UNIT_GROUPS),
  name: Bilingual,
  /** 战场定位，标题上方那一行 */
  role: Bilingual,
  /** 兵牌短文（loc unit_description_short_texts） */
  desc: Bilingual,
  /** 图鉴长文（loc unit_description_historical_texts）；与短文同句的不写 */
  story: Paragraphs.optional(),
  cost: obj({ recruit: z.number(), upkeep: z.number() }).optional(),
  /** 设计书「兵种类型」表里给玩家看的那几行（兵种类别、武器配置、护甲与盾牌、训练等级） */
  type: z.array(KV),
  recruit: z.array(KV),
  stats: z.array(obj({ k: Bilingual, v: Cell, n: Bilingual.optional() })),
  /** 设计书「特性」一节：兵牌上那些 ▲ 条目。down 是 ▼（缺点） */
  traits: z.array(obj({ name: Bilingual, desc: Bilingual, down: z.boolean().optional() })),
  /** 技能的效果说明，按 unit_abilities key 挂到生成的那一条下面（设计书「技能」表的效果列） */
  effects: z.record(z.string(), Bilingual).default({}),
  /** 设计书「部队属性」里有、DB 的 unit_attributes 里没有的（攻城者这类派生说法） */
  attrsExtra: z.array(obj({ name: Bilingual, desc: Bilingual })).default([]),
})

export const CHAR_RANKS = ['legendary-lord', 'legendary-hero', 'lord', 'hero'] as const

export const CodexChar = obj({
  slug: z.string(),
  rank: z.enum(CHAR_RANKS),
  name: Bilingual,
  /** 『』里那个称号，不带书名号 */
  epithet: Bilingual.optional(),
  /** 标题上方的药丸：位阶 · 定位 */
  rankLabel: Bilingual,
  /** 外观。key 对应 assets/chars/<key>.webp 与 assets/chars/full/<key>.webp；第一个是默认 */
  looks: z.array(obj({ key: z.string(), label: Bilingual.optional() })).min(1),
  desc: Bilingual,
  story: Paragraphs.optional(),
  identity: z.array(KV),
  stats: obj({
    forms: z.array(Bilingual).min(1),
    rows: z.array(obj({ k: Bilingual, v: z.array(Cell) })),
    note: Bilingual.optional(),
  })
    .refine((s) => s.rows.every((r) => r.v.length === s.forms.length), {
      message: '数值表每一行的格数要和 forms 一样多',
    })
    .optional(),
  weapons: z.array(Row).default([]),
  mounts: z.array(Row).default([]),
  traits: z.array(Row).default([]),
  abilities: z.array(Row).default([]),
  attrs: z.array(Row).default([]),
  /** 技能树。只列本 mod 原创的那几行；整行原版复用的不列 */
  tree: obj({
    /** data/vanilla/skills/<subject>.json */
    subject: z.string(),
    note: Bilingual.optional(),
    branches: z.array(
      obj({
        /** 游戏技能树里的第几行（character_skill_nodes.indent） */
        indent: z.number(),
        /** 'npex'：这一行只列原创节点（原版战斗线里夹着一个专属节点的那种） */
        only: z.literal('npex').optional(),
        label: Bilingual,
        sub: Bilingual.optional(),
      }),
    ),
  }).optional(),
  /** 游戏里的「特性」（开局特性 / 随机天性）从哪几套技能树取，默认就是 tree.subject。
      多套 = 招募面板上的几位候选各带一项（水师提督三席） */
  traitsFrom: z.array(z.string()).min(1).optional(),
  /** 远征同伴：四档羁绊。name / desc 是同伴特性那一档的名字与风味文，rewards 是达成这一档发的奖励，
      都照 loc（cth_npex_companions）原文；effects 是同伴特性本身的数值（设计书「同伴特性」） */
  companion: obj({
    trait: Bilingual,
    tiers: z.array(obj({ name: Bilingual, desc: Bilingual, rewards: z.array(Bilingual) })).length(4),
    effects: z.array(KV),
  }).optional(),
})

// ---- content/codex/generated/ ------------------------------------------------

const GenIcon = z.string().nullable()

export const GenAbility = z.strictObject({
  key: z.string(),
  source: z.enum(['vanilla', 'npex']),
  name: Bilingual,
  desc: Bilingual.nullable(),
  icon: GenIcon,
})

export const GenUnit = z.strictObject({
  _comment: z.string(),
  unit: z.string(),
  abilities: z.array(GenAbility),
  attrs: z.array(GenAbility),
})

export const GenNode = z.strictObject({
  key: z.string(),
  name: Bilingual,
  desc: Bilingual.nullable(),
  /** 每级一组效果行；单级技能就只有一组。级数很多的（登峰造极 100 级）只留首尾两级 */
  levels: z.array(z.strictObject({ level: z.number(), lines: z.array(Bilingual) })),
  icon: GenIcon,
  /** 原版技能（这一行里复用的节点，页面上压灰） */
  reuse: z.boolean(),
  unlock: Bilingual.nullable(),
  /** 「需 4/5」这种多父节点汇合 */
  hub: Bilingual.nullable(),
})

export const GenTree = z.strictObject({
  _comment: z.string(),
  subject: z.string(),
  branches: z.array(z.strictObject({ indent: z.number(), nodes: z.array(GenNode) })),
})

/** 游戏里的「特性」：技能树里藏起来（visible_in_ui = false）的第 6 行。
    fixed：开局自带的一项（传奇人物）；random：招募时从池子里随机一项（通用领主 / 英雄）；
    variant：每位候选各带一项（traitsFrom 列了多套树） */
export const GenTraits = z.strictObject({
  _comment: z.string(),
  kind: z.enum(['fixed', 'random', 'variant']),
  subjects: z.array(z.string()),
  nodes: z.array(GenNode),
})

export type CodexUnitData = z.infer<typeof CodexUnit>
export type CodexCharData = z.infer<typeof CodexChar>
export type GenUnitData = z.infer<typeof GenUnit>
export type GenTreeData = z.infer<typeof GenTree>
export type GenNodeData = z.infer<typeof GenNode>
export type GenTraitsData = z.infer<typeof GenTraits>
export type GenAbilityData = z.infer<typeof GenAbility>

// ---- content/lore.json -------------------------------------------------------

/** 背景故事页。正文尽量直接用游戏里的中英原文（开场短片旁白、加载屏、图鉴长文），
    少数串联段落照 mod 的 _docs/lore 整理。章节序号由页面按顺序给，不写在数据里。 */
export const Lore = obj({
  title: Bilingual,
  lede: Bilingual,
  chapters: z.array(
    obj({
      /** 锚点：/lore#<id> */
      id: z.string(),
      title: Bilingual,
      /** 引文，一行一条（开场短片旁白那种分行的诗体） */
      quote: z.array(Bilingual).default([]),
      body: z.array(Bilingual),
      pairs: z.array(KV).default([]),
    }),
  ),
  routesTitle: Bilingual,
})

export type LoreData = z.infer<typeof Lore>

// ---- content/compat.json -----------------------------------------------------

/** 兼容性拓扑页。中心是本体，四类节点：前置 / 兼容包接通 / 可直接共存 / 冲突；
    语言包挂在它本地化的那个节点下面。url 可以分语言（巧匠行会中英是两个工坊条目）。 */
export const COMPAT_GROUPS = ['required', 'full', 'ok', 'conflict'] as const
const Url = z.union([z.string(), Bilingual])

export const CompatPage = obj({
  lede: Bilingual,
  hub: Bilingual,
  hubSub: Bilingual,
  groups: z.array(obj({ key: z.enum(COMPAT_GROUPS), label: Bilingual, desc: Bilingual })),
  nodes: z.array(
    obj({
      key: z.string(),
      group: z.enum(COMPAT_GROUPS),
      name: Bilingual,
      /** 节点收起时显示的短名 */
      short: Bilingual,
      note: Bilingual,
      url: Url.optional(),
      /** 经由哪个兼容包接通 */
      via: obj({ label: Bilingual, url: z.string() }).optional(),
      /** 还没定论（可能冲突、待实机验证） */
      tbd: z.boolean().optional(),
    }),
  ),
  langs: z.array(
    obj({
      key: z.string(),
      /** 挂在哪个节点下；'hub' 是本体 */
      of: z.string(),
      only: z.enum(['zh', 'en']),
      name: Bilingual,
      short: Bilingual,
      note: Bilingual,
      url: z.string(),
    }),
  ),
  note: Bilingual,
})

export type CompatPageData = z.infer<typeof CompatPage>

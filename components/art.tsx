// 兵牌、人物卡、两者的高清大图、同伴场景图、技能图标。图都由 scripts/build_art.py / export-codex.ts 生成。
//
// ⚠️ slug 来自数据，所以只能用动态 import，而动态 import 的模板路径**必须写相对路径**——
// `@/assets/units/${slug}.webp` 构建时会报 Cannot find module：打包器要把模板变成一个
// 「目录上下文」，别名在这一步解析不了。字面量路径用 @/ 没问题，只有变量路径不行。
// 也因为这条，这个文件的位置不能随便挪——路径是相对它自己算的。
//
// 动态 import 只能在 Server Component 里用；这几个正好都是。
import Image from 'next/image'
import type { StaticImageData } from 'next/image'

import { Link } from '@/i18n/navigation'

type Kind = 'units' | 'chars'

export async function loadCard(kind: Kind, key: string): Promise<StaticImageData> {
  const mod =
    kind === 'units' ? await import(`../assets/units/${key}.webp`) : await import(`../assets/chars/${key}.webp`)
  return mod.default
}

/** 兵种页 / 人物页的大图：12:26 的高清兵牌，不撕边 */
export async function loadFull(kind: Kind, key: string): Promise<StaticImageData> {
  const mod =
    kind === 'units' ? await import(`../assets/units/full/${key}.webp`) : await import(`../assets/chars/full/${key}.webp`)
  return mod.default
}

/** 兵牌 / 人物卡。12:26 的立牌，宽高从静态导入里自动来，不会有布局偏移。给了 href 就整张可点。 */
export async function ArtCard({
  kind,
  slug,
  name,
  href,
  sub = [],
  accent = false,
}: {
  kind: Kind
  /** 图的 key：兵种是 slug，人物是外观 key（武士大将有三张脸） */
  slug: string
  name: string
  href?: string
  /** 名字下面的小字，一行一条（图鉴里的称号、另一种语言的名字） */
  sub?: string[]
  /** 第一行小字用翠色（称号 / 外观名） */
  accent?: boolean
}) {
  const art = await loadCard(kind, slug)
  const body = (
    <>
      <Image src={art} alt="" sizes="160px" />
      <span className="card__name">{name}</span>
      {sub.map((s, i) => (
        <span className={`card__sub${accent && i === 0 ? ' card__sub--accent' : ''}`} key={i}>
          {s}
        </span>
      ))}
    </>
  )
  return href ? (
    <Link className={`card card--${kind}`} href={href}>
      {body}
    </Link>
  ) : (
    <figure className={`card card--${kind}`}>{body}</figure>
  )
}

/** 同伴横幅，16:9。 */
export async function SceneImage({ slug, alt }: { slug: string; alt: string }) {
  const { default: art } = await import(`../assets/scenes/${slug}.jpg`)
  return <Image className="companion__scene" src={art} alt={alt} sizes="(max-width: 700px) 100vw, 300px" />
}

/** 技能 / 部队属性的图标。file 是 export-codex 挑进 assets/icons/ 的文件名。 */
export async function SkillIcon({ file, className }: { file: string; className?: string }) {
  const { default: art } = await import(`../assets/icons/${file}`)
  return <Image className={className} src={art} alt="" sizes="56px" />
}

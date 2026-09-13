// 兵牌、人物卡、同伴场景图。
//
// ⚠️ slug 来自数据，所以只能用动态 import，而动态 import 的模板路径**必须写相对路径**——
// `@/assets/units/${slug}.webp` 构建时会报 Cannot find module：打包器要把模板变成一个
// 「目录上下文」，别名在这一步解析不了。字面量路径用 @/ 没问题，只有变量路径不行。
// 也因为这条，这个文件的位置不能随便挪——路径是相对它自己算的。
//
// 动态 import 只能在 Server Component 里用；这几个正好都是。
import Image from 'next/image'
import type { StaticImageData } from 'next/image'

async function load(kind: 'units' | 'chars', slug: string): Promise<StaticImageData> {
  const mod =
    kind === 'units'
      ? await import(`../assets/units/${slug}.webp`)
      : await import(`../assets/chars/${slug}.webp`)
  return mod.default
}

/** 兵牌 / 人物卡。12:26 的立牌，宽高从静态导入里自动来，不会有布局偏移。 */
export async function ArtCard({
  kind,
  slug,
  name,
}: {
  kind: 'units' | 'chars'
  slug: string
  name: string
}) {
  const art = await load(kind, slug)
  return (
    <figure className="card">
      <Image src={art} alt="" sizes="132px" />
      <figcaption className="card__name">{name}</figcaption>
    </figure>
  )
}

/** 同伴横幅，16:9。 */
export async function SceneImage({ slug, alt }: { slug: string; alt: string }) {
  const { default: art } = await import(`../assets/scenes/${slug}.jpg`)
  return <Image className="companion__scene" src={art} alt={alt} sizes="(max-width: 700px) 100vw, 300px" />
}

// 行内 Markdown 的四种段。内容里只允许这四种（ROADMAP 决定 3），
// 多出一种会在 lib/content/inline.ts 里就报错，不会静默漏渲染。
import type { Seg as SegData } from '@/lib/content/inline'

function One({ seg }: { seg: SegData }) {
  const body =
    seg.kind === 'code' ? (
      <code>{seg.text}</code>
    ) : seg.kind === 'link' ? (
      // 内容里的链接全是站外的（工坊、其他 mod），一律新开且断掉 opener
      <a href={seg.url} target="_blank" rel="noopener" className="seg-link">
        {seg.text}
      </a>
    ) : (
      seg.text
    )
  return seg.bold ? <strong>{body}</strong> : <>{body}</>
}

export function Segs({ segs }: { segs: readonly SegData[] }) {
  return (
    <>
      {segs.map((s, i) => (
        <One key={i} seg={s} />
      ))}
    </>
  )
}

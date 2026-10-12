import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { CodexIndex } from '@/components/CodexIndex'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return buildMetadata('codex', {
    href: '/codex/chars',
    title: `${t('tabChars')} · ${t('nav.codex')}`,
    description: t('pageDesc.codex'),
  })
}

export default function CodexCharsPage() {
  return <CodexIndex tab="chars" />
}
